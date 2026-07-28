// CMS API：JSON 文件数据库（零依赖）
import {
  db, seedAll, verifyPassword, createSession, findSessionUser, deleteSession,
} from './db.js'
import { initKnowledgeBase, generateAnswer } from './chat.js'

const TYPES = ['news', 'notices', 'products']
const ADMIN_TYPES = [...TYPES, 'banners', 'contact_info']
const BODY_LIMIT = 2 * 1024 * 1024

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
      if (size > BODY_LIMIT) { reject(new Error('请求体过大')); req.destroy(); return }
      chunks.push(c)
    })
    req.on('end', () => {
      if (chunks.length === 0) return resolve({})
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf-8'))) }
      catch { reject(new Error('JSON 解析失败')) }
    })
    req.on('error', reject)
  })
}

function requireAuth(req, res) {
  const m = /^Bearer\s+(.+)$/.exec(req.headers.authorization ?? '')
  const session = m ? findSessionUser(m[1]) : null
  if (!session) { send(res, 401, { error: '未登录或会话已过期' }); return null }
  return session
}

function newId(type) {
  return `u-${type}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function nextSort(type) {
  const items = db.table(type)
  return items.length === 0 ? 0 : Math.max(...items.map(r => r.sort ?? -1)) + 1
}

function rowToItem(type, r) {
  const base = { id: r.id, title: r.title, date: r.date ?? '', summary: r.summary ?? '', bodyHtml: r.bodyHtml ?? '', cover: r.cover ?? '', pinned: !!r.pinned, hidden: !!r.hidden, sort: r.sort }
  if (type === 'notices') return { ...base, pdf: r.pdf ?? '' }
  if (type === 'products') {
    let images = []
    try { images = JSON.parse(typeof r.images === 'string' ? r.images : '[]') } catch {}
    return { id: r.id, title: r.title, category: r.category ?? 'wipes', scene: r.scene ?? '', desc: r.description ?? '', categories: r.categories ?? '', bodyHtml: r.bodyHtml ?? '', cover: r.cover ?? '', images, pinned: !!r.pinned, hidden: !!r.hidden, sort: r.sort }
  }
  return base
}

function listRows(type, includeHidden) {
  const items = db.table(type)
  let filtered = includeHidden ? items : items.filter(r => !r.hidden)
  if (type === 'products') {
    filtered.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (a.sort ?? 0) - (b.sort ?? 0))
  } else {
    filtered.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (b.date || '').localeCompare(a.date || '') || (a.sort ?? 0) - (b.sort ?? 0))
  }
  return filtered
}

function insertItem(type, b) {
  const id = newId(type)
  const sort = nextSort(type)
  const item = { id, title: b.title, date: b.date ?? '', summary: b.summary ?? '', bodyHtml: b.bodyHtml ?? '', cover: b.cover ?? '', pinned: b.pinned ? 1 : 0, hidden: b.hidden ? 1 : 0, sort }
  if (type === 'notices') { item.pdf = b.pdf ?? '' }
  if (type === 'products') {
    Object.assign(item, { category: b.category ?? 'wipes', scene: b.scene ?? '', description: b.desc ?? '', categories: b.categories ?? '', images: JSON.stringify(Array.isArray(b.images) ? b.images : []) })
  }
  db.insert(type, item)
  return id
}

function updateItem(type, id, b) {
  const updates = { title: b.title }
  if (b.date !== undefined) updates.date = b.date
  if (b.summary !== undefined) updates.summary = b.summary
  if (b.bodyHtml !== undefined) updates.bodyHtml = b.bodyHtml
  if (b.cover !== undefined) updates.cover = b.cover
  if (b.pinned !== undefined) updates.pinned = b.pinned ? 1 : 0
  if (b.hidden !== undefined) updates.hidden = b.hidden ? 1 : 0
  if (type === 'notices' && b.pdf !== undefined) updates.pdf = b.pdf
  if (type === 'products') {
    if (b.category !== undefined) updates.category = b.category
    if (b.scene !== undefined) updates.scene = b.scene
    if (b.desc !== undefined) updates.description = b.desc
    if (b.categories !== undefined) updates.categories = b.categories
    if (b.images !== undefined) updates.images = JSON.stringify(Array.isArray(b.images) ? b.images : [])
  }
  return db.update(type, r => r.id === id, updates)
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost')
  const path = url.pathname
  const method = req.method

  /* ---- 认证 ---- */
  if (path === '/api/auth/login' && method === 'POST') {
    const b = await readBody(req)
    const user = db.findOne('admin_users', u => u.username === String(b.username ?? ''))
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

  /* ---- 公开内容 ---- */
  if (path === '/api/content' && method === 'GET') {
    return send(res, 200, {
      news: listRows('news', false).map(r => rowToItem('news', r)),
      notices: listRows('notices', false).map(r => rowToItem('notices', r)),
      products: listRows('products', false).map(r => rowToItem('products', r)),
      banners: db.table('banners').sort((a, b) => a.sort - b.sort),
      contact_info: db.findOne('contact_info', r => r.id === 'main') || null,
    })
  }

  /* ---- AI 助手 ---- */
  if (path === '/api/chat' && method === 'POST') {
    const b = await readBody(req)
    const question = String(b.question || '').trim()
    if (!question) return send(res, 400, { error: '请输入问题' })
    initKnowledgeBase()
    return send(res, 200, generateAnswer(question))
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
    if (!ADMIN_TYPES.includes(type)) return send(res, 404, { error: '未知内容类型' })
    if (!requireAuth(req, res)) return

    // contact_info: 单个记录 PUT 更新
    if (type === 'contact_info') {
      if (method === 'GET') {
        const row = db.findOne('contact_info', r => r.id === 'main') || {}
        return send(res, 200, { item: row })
      }
      if (method === 'PUT') {
        const b = await readBody(req)
        db.update('contact_info', r => r.id === 'main', {
          address: b.address ?? '', hotlines: b.hotlines ?? [],
          emails: b.emails ?? [], fax: b.fax ?? '',
        })
        const row = db.findOne('contact_info', r => r.id === 'main')
        return send(res, 200, { item: row })
      }
    }

    // banners: 简化的 CRUD
    if (type === 'banners') {
      if (method === 'GET' && !id) {
        return send(res, 200, { items: db.table('banners').sort((a, b) => a.sort - b.sort) })
      }
      if (method === 'POST' && !id) {
        const b = await readBody(req)
        const items = db.table('banners')
        const newId = String(Date.now())
        db.insert('banners', { id: newId, src: b.src ?? '', title: b.title ?? '', sort: items.length })
        const row = db.findOne('banners', r => r.id === newId)
        return send(res, 200, { item: row })
      }
      if (method === 'PUT' && id) {
        const b = await readBody(req)
        const updates = {}
        if (b.src !== undefined) updates.src = b.src
        if (b.title !== undefined) updates.title = b.title
        if (b.sort !== undefined) updates.sort = b.sort
        const changes = db.update('banners', r => r.id === id, updates)
        if (changes === 0) return send(res, 404, { error: '内容不存在' })
        const row = db.findOne('banners', r => r.id === id)
        return send(res, 200, { item: row })
      }
      if (method === 'DELETE' && id) {
        db.delete('banners', r => r.id === id)
        return send(res, 200, { ok: true })
      }
    }

    if (method === 'GET' && !id) {
      return send(res, 200, { items: listRows(type, true).map(r => rowToItem(type, r)) })
    }
    if (method === 'POST' && !id) {
      const b = await readBody(req)
      if (!b.title || !String(b.title).trim()) return send(res, 400, { error: '标题不能为空' })
      const newItemId = insertItem(type, { ...b, title: String(b.title).trim() })
      const row = db.findOne(type, r => r.id === newItemId)
      return send(res, 200, { item: rowToItem(type, row) })
    }
    if (method === 'PUT' && id) {
      const b = await readBody(req)
      if (!b.title || !String(b.title).trim()) return send(res, 400, { error: '标题不能为空' })
      const changes = updateItem(type, id, { ...b, title: String(b.title).trim() })
      if (changes === 0) return send(res, 404, { error: '内容不存在' })
      const row = db.findOne(type, r => r.id === id)
      return send(res, 200, { item: rowToItem(type, row) })
    }
    if (method === 'DELETE' && id) {
      const changes = db.delete(type, r => r.id === id)
      if (changes === 0) return send(res, 404, { error: '内容不存在' })
      return send(res, 200, { ok: true })
    }
    return send(res, 405, { error: 'Method Not Allowed' })
  }

  return false
}

export function cmsApiPlugin() {
  return {
    name: 'joya-cms-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next()
        if (req.url.startsWith('/api/cninfo')) return next()
        handle(req, res).then(handled => { if (handled === false) next() }).catch(err => {
          if (!res.headersSent) send(res, 500, { error: err?.message || '服务器内部错误' })
          else res.end()
        })
      })
    },
  }
}

export { handle }
