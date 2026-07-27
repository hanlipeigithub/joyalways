// CMS 数据存储层：JSON 文件数据库（零依赖，兼容所有 Node 版本）
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(ROOT, 'data')
const DB_PATH = path.join(DATA_DIR, 'cms.json')

mkdirSync(DATA_DIR, { recursive: true })

// ──── JSON 数据库引擎 ────
class JsonDB {
  constructor(filePath) {
    this.filePath = filePath
    this.data = { news: [], notices: [], products: [], admin_users: [], sessions: [] }
    this.load()
  }

  load() {
    try {
      if (existsSync(this.filePath)) {
        this.data = JSON.parse(readFileSync(this.filePath, 'utf-8'))
      }
    } catch {}
  }

  save() {
    writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8')
  }

  // table(name) → 返回该表数组引用
  table(name) {
    if (!this.data[name]) this.data[name] = []
    return this.data[name]
  }

  // find: 条件查询，返回第一条
  findOne(tableName, predicate) {
    return this.table(tableName).find(predicate) || null
  }

  // filter: 条件查询，返回数组
  find(tableName, predicate) {
    return this.table(tableName).filter(predicate)
  }

  // insert: 插入一条
  insert(tableName, item) {
    this.table(tableName).push(item)
    this.save()
  }

  // update: 更新匹配的第一条
  update(tableName, predicate, updates) {
    const items = this.table(tableName)
    const idx = items.findIndex(predicate)
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...updates }
      this.save()
      return 1
    }
    return 0
  }

  // delete: 删除匹配的第一条
  delete(tableName, predicate) {
    const items = this.table(tableName)
    const idx = items.findIndex(predicate)
    if (idx >= 0) {
      items.splice(idx, 1)
      this.save()
      return 1
    }
    return 0
  }

  // count
  count(tableName) {
    return this.table(tableName).length
  }

  // clear
  clear(tableName) {
    this.data[tableName] = []
    this.save()
  }
}

export const db = new JsonDB(DB_PATH)

/* ------------------------------------------------------------------ */
/* 密码 / 会话                                                         */
/* ------------------------------------------------------------------ */

export function hashPassword(password, salt) {
  return scryptSync(String(password), salt, 64).toString('hex')
}

export function verifyPassword(password, salt, expectHash) {
  const actual = Buffer.from(hashPassword(password, salt), 'hex')
  const expect = Buffer.from(expectHash, 'hex')
  return actual.length === expect.length && timingSafeEqual(actual, expect)
}

const SESSION_TTL = 7 * 24 * 3600 * 1000

export function createSession(userId) {
  const token = randomBytes(32).toString('hex')
  const now = Date.now()
  db.insert('sessions', { token, user_id: userId, created_at: now, expires_at: now + SESSION_TTL })
  return token
}

export function findSessionUser(token) {
  if (!token) return null
  const row = db.findOne('sessions', s => s.token === token && s.expires_at > Date.now())
  if (!row) return null
  const user = db.findOne('admin_users', u => u.id === row.user_id)
  return user ? { token: row.token, user_id: user.id, username: user.username } : null
}

export function deleteSession(token) {
  db.delete('sessions', s => s.token === token)
}

/* ------------------------------------------------------------------ */
/* 种子导入                                                             */
/* ------------------------------------------------------------------ */

function readJson(rel) {
  return JSON.parse(readFileSync(path.join(ROOT, '..', 'src', 'data', rel), 'utf-8'))
}

export function seedAll(force = false) {
  if (force || db.count('news') === 0) {
    const news = readJson('news.json')
    db.clear('news')
    news.forEach((n, i) => db.insert('news', {
      id: String(n.id), title: n.title ?? '', date: n.date ?? '', summary: n.summary ?? '',
      bodyHtml: n.bodyHtml ?? '', cover: n.cover ?? '', pinned: 0, hidden: 0, sort: i,
    }))
  }
  if (force || db.count('notices') === 0) {
    const notices = readJson('notices.json')
    db.clear('notices')
    notices.forEach((n, i) => db.insert('notices', {
      id: String(n.id), title: n.title ?? '', date: n.date ?? '', summary: n.summary ?? '',
      bodyHtml: n.bodyHtml ?? '', cover: n.cover ?? '', pdf: n.pdf ?? '', pinned: 0, hidden: 0, sort: i,
    }))
  }
  if (force || db.count('products') === 0) {
    const products = readJson('products.json').items ?? []
    db.clear('products')
    products.forEach((p, i) => db.insert('products', {
      id: String(p.id), title: p.title ?? '', category: p.category ?? 'wipes', scene: p.scene ?? '',
      description: p.desc ?? p.description ?? '', categories: p.categories ?? '',
      bodyHtml: p.bodyHtml ?? '', cover: p.cover ?? '',
      images: JSON.stringify(Array.isArray(p.images) ? p.images : []),
      pinned: 0, hidden: 0, sort: i,
    }))
  }
  if (db.count('admin_users') === 0) {
    const salt = randomBytes(16).toString('hex')
    db.insert('admin_users', { id: 1, username: 'admin', pass_hash: hashPassword('joya2024', salt), salt })
  }
}

seedAll()
