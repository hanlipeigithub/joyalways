// CMS API：以 Vite 中间件形式挂在 dev server 内（/api/*，无第二进程）
// 注意：/api/cninfo 由 vite proxy 处理，本中间件只匹配自身路由，其余 next() 放行
import {
  db, seedAll, verifyPassword, createSession, findSessionUser, deleteSession,
} from './db.js'

const TYPES = ['news', 'notices', 'products']
const BODY_LIMIT = 2 * 1024 * 1024 // 2MB

/* ------------------------------------------------------------------ */
/* 工具                                                                */
/* ------------------------------------------------------------------ */

function send(res, status, obj) {
  const body = JSON.stringify(obj)
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(body)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (c) => {
      size += c.length
      if (size > BODY_LIMIT) {
        reject(new Error('请求体过大（上限 2MB）'))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => {
      if (chunks.length === 0) return resolve({})
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf-8')))
      } catch {
        reject(new Error('JSON 解析失败'))
      }
    })
    req.on('error', reject)
  })
}

function requireAuth(req, res) {
  const m = /^Bearer\s+(.+)$/.exec(req.headers.authorization ?? '')
  const session = m ? findSessionUser(m[1]) : null
  if (!session) {
    send(res, 401, { error: '未登录或会话已过期' })
    return null
  }
  return session
}

function newId(type) {
  return `u-${type}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function nextSort(type) {
  return (db.prepare(`SELECT COALESCE(MAX(sort), -1) + 1 AS s FROM ${type}`).get().s)
}

function bool(v) {
  return v ? 1 : 0
}

/* ------------------------------------------------------------------ */
/* 行 → API 对象（产品 description → desc 映射，保持前端字段不变）        */
/* ------------------------------------------------------------------ */

function rowToItem(type, r) {
  const base = {
    id: r.id,
    title: r.title,
    date: r.date ?? '',
    summary: r.summary ?? '',
    bodyHtml: r.bodyHtml ?? '',
    cover: r.cover ?? '',
    pinned: !!r.pinned,
    hidden: !!r.hidden,
    sort: r.sort,
  }
  if (type === 'notices') return { ...base, pdf: r.pdf ?? '' }
  if (type === 'products') {
    let images = []
    try { images = JSON.parse(r.images || '[]') } catch { /* ignore */ }
    return {
      id: r.id, title: r.title, category: r.category ?? 'wipes', scene: r.scene ?? '',
      desc: r.description ?? '', categories: r.categories ?? '', bodyHtml: r.bodyHtml ?? '',
      cover: r.cover ?? '', images, pinned: !!r.pinned, hidden: !!r.hidden, sort: r.sort,
    }
  }
  return base
}

function listRows(type, includeHidden) {
  const where = includeHidden ? '' : 'WHERE hidden = 0'
  const order = type === 'products'
    ? 'ORDER BY pinned DESC, sort ASC'
    : 'ORDER BY pinned DESC, date DESC, sort ASC'
  return db.prepare(`SELECT * FROM ${type} ${where} ${order}`).all()
}

/* ------------------------------------------------------------------ */
/* CRUD                                                                */
/* ------------------------------------------------------------------ */

function insertItem(type, b) {
  const id = newId(type)
  const sort = nextSort(type)
  if (type === 'news') {
    db.prepare('INSERT INTO news (id, title, date, summary, bodyHtml, cover, pinned, hidden, sort) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(id, b.title, b.date ?? '', b.summary ?? '', b.bodyHtml ?? '', b.cover ?? '', bool(b.pinned), bool(b.hidden), sort)
  } else if (type === 'notices') {
    db.prepare('INSERT INTO notices (id, title, date, summary, bodyHtml, cover, pdf, pinned, hidden, sort) VALUES (?,?,?,?,?,?,?,?,?,?)')
      .run(id, b.title, b.date ?? '', b.summary ?? '', b.bodyHtml ?? '', b.cover ?? '', b.pdf ?? '', bool(b.pinned), bool(b.hidden), sort)
  } else {
    db.prepare('INSERT INTO products (id, title, category, scene, description, categories, bodyHtml, cover, images, pinned, hidden, sort) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
      .run(id, b.title, b.category ?? 'wipes', b.scene ?? '', b.desc ?? '', b.categories ?? '',
        b.bodyHtml ?? '', b.cover ?? '', JSON.stringify(Array.isArray(b.images) ? b.images : []),
        bool(b.pinned), bool(b.hidden), sort)
  }
  return id
}

function updateItem(type, id, b) {
  if (type === 'news') {
    return db.prepare('UPDATE news SET title=?, date=?, summary=?, bodyHtml=?, cover=?, pinned=?, hidden=? WHERE id=?')
      .run(b.title, b.date ?? '', b.summary ?? '', b.bodyHtml ?? '', b.cover ?? '', bool(b.pinned), bool(b.hidden), id).changes
  }
  if (type === 'notices') {
    return db.prepare('UPDATE notices SET title=?, date=?, summary=?, bodyHtml=?, cover=?, pdf=?, pinned=?, hidden=? WHERE id=?')
      .run(b.title, b.date ?? '', b.summary ?? '', b.bodyHtml ?? '', b.cover ?? '', b.pdf ?? '', bool(b.pinned), bool(b.hidden), id).changes
  }
  return db.prepare('UPDATE products SET title=?, category=?, scene=?, description=?, categories=?, bodyHtml=?, cover=?, images=?, pinned=?, hidden=? WHERE id=?')
    .run(b.title, b.category ?? 'wipes', b.scene ?? '', b.desc ?? '', b.categories ?? '', b.bodyHtml ?? '',
      b.cover ?? '', JSON.stringify(Array.isArray(b.images) ? b.images : []), bool(b.pinned), bool(b.hidden), id).changes
}

/* ------------------------------------------------------------------ */
/* 路由                                                                */
/* ------------------------------------------------------------------ */

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost')
  const path = url.pathname
  const method = req.method

  /* ---- 认证 ---- */
  if (path === '/api/auth/login' && method === 'POST') {
    const b = await readBody(req)
    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(String(b.username ?? ''))
    if (!user || !verifyPassword(b.password ?? '', user.salt, user.pass_hash)) {
      return send(res, 401, { error: '用户名或密码错误' })
    }
    const token = createSession(user.id)
    return send(res, 200, { token, username: user.username })
  }
  if (path === '/api/auth/logout' && method === 'POST') {
    const m = /^Bearer\s+(.+)$/.exec(req.headers.authorization ?? '')
    if (m) deleteSession(m[1])
    return send(res, 200, { ok: true })
  }
  if (path === '/api/auth/me' && method === 'GET') {
    const session = requireAuth(req, res)
    if (!session) return
    return send(res, 200, { username: session.username })
  }

  /* ---- 公开内容（前台） ---- */
  if (path === '/api/content' && method === 'GET') {
    return send(res, 200, {
      news: listRows('news', false).map((r) => rowToItem('news', r)),
      notices: listRows('notices', false).map((r) => rowToItem('notices', r)),
      products: listRows('products', false).map((r) => rowToItem('products', r)),
    })
  }

  /* ---- 管理端 ---- */
  if (path === '/api/admin/reset' && method === 'POST') {
    if (!requireAuth(req, res)) return
    seedAll(true)
    return send(res, 200, { ok: true })
  }

  const mAdmin = /^\/api\/admin\/(\w+)(?:\/([^/]+))?$/.exec(path)
  if (mAdmin) {
    const [, type, id] = mAdmin
    if (!TYPES.includes(type)) return send(res, 404, { error: '未知内容类型' })
    if (!requireAuth(req, res)) return

    if (method === 'GET' && !id) {
      return send(res, 200, { items: listRows(type, true).map((r) => rowToItem(type, r)) })
    }
    if (method === 'POST' && !id) {
      const b = await readBody(req)
      if (!b.title || !String(b.title).trim()) return send(res, 400, { error: '标题不能为空' })
      const newItemId = insertItem(type, { ...b, title: String(b.title).trim() })
      const row = db.prepare(`SELECT * FROM ${type} WHERE id = ?`).get(newItemId)
      return send(res, 200, { item: rowToItem(type, row) })
    }
    if (method === 'PUT' && id) {
      const b = await readBody(req)
      if (!b.title || !String(b.title).trim()) return send(res, 400, { error: '标题不能为空' })
      const changes = updateItem(type, id, { ...b, title: String(b.title).trim() })
      if (changes === 0) return send(res, 404, { error: '内容不存在' })
      const row = db.prepare(`SELECT * FROM ${type} WHERE id = ?`).get(id)
      return send(res, 200, { item: rowToItem(type, row) })
    }
    if (method === 'DELETE' && id) {
      const changes = db.prepare(`DELETE FROM ${type} WHERE id = ?`).run(id).changes
      if (changes === 0) return send(res, 404, { error: '内容不存在' })
      return send(res, 200, { ok: true })
    }
    return send(res, 405, { error: 'Method Not Allowed' })
  }

  return false // 未匹配，放行（/api/cninfo 等交给 proxy）
}

/* ------------------------------------------------------------------ */
/* Vite 插件                                                           */
/* ------------------------------------------------------------------ */

export function cmsApiPlugin() {
  return {
    name: 'joya-cms-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next()
        // /api/cninfo 代理路由直接放行
        if (req.url.startsWith('/api/cninfo')) return next()
        handle(req, res)
          .then((handled) => {
            if (handled === false) next()
          })
          .catch((err) => {
            if (!res.headersSent) send(res, 500, { error: err?.message || '服务器内部错误' })
            else res.end()
          })
      })
    },
  }
}

export { handle }
