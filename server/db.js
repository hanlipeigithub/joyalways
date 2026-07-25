// CMS 数据库层：Node 内置 node:sqlite（无原生依赖）
// 数据库文件 server/data/cms.db，首次启动自动建表 + 从 src/data/*.json 种子导入
import { DatabaseSync } from 'node:sqlite'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { mkdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(ROOT, 'data')
const DB_PATH = path.join(DATA_DIR, 'cms.db')

mkdirSync(DATA_DIR, { recursive: true })

export const db = new DatabaseSync(DB_PATH)

/* ------------------------------------------------------------------ */
/* 建表                                                                */
/* ------------------------------------------------------------------ */

db.exec(`
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  bodyHtml TEXT DEFAULT '',
  cover TEXT DEFAULT '',
  pinned INTEGER DEFAULT 0,
  hidden INTEGER DEFAULT 0,
  sort INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  bodyHtml TEXT DEFAULT '',
  cover TEXT DEFAULT '',
  pdf TEXT DEFAULT '',
  pinned INTEGER DEFAULT 0,
  hidden INTEGER DEFAULT 0,
  sort INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'wipes',
  scene TEXT DEFAULT '',
  description TEXT DEFAULT '',
  categories TEXT DEFAULT '',
  bodyHtml TEXT DEFAULT '',
  cover TEXT DEFAULT '',
  images TEXT DEFAULT '[]',
  pinned INTEGER DEFAULT 0,
  hidden INTEGER DEFAULT 0,
  sort INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  pass_hash TEXT NOT NULL,
  salt TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
`)

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

const SESSION_TTL = 7 * 24 * 3600 * 1000 // 7 天

export function createSession(userId) {
  const token = randomBytes(32).toString('hex')
  const now = Date.now()
  db.prepare('INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)')
    .run(token, userId, now, now + SESSION_TTL)
  return token
}

export function findSessionUser(token) {
  if (!token) return null
  const row = db
    .prepare(
      `SELECT s.token, u.id AS user_id, u.username
       FROM sessions s JOIN admin_users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > ?`,
    )
    .get(token, Date.now())
  return row ?? null
}

export function deleteSession(token) {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token)
}

/* ------------------------------------------------------------------ */
/* 种子导入（表为空才导）                                                */
/* ------------------------------------------------------------------ */

function readJson(rel) {
  return JSON.parse(readFileSync(path.join(ROOT, '..', 'src', 'data', rel), 'utf-8'))
}

function tableEmpty(name) {
  return db.prepare(`SELECT COUNT(*) AS c FROM ${name}`).get().c === 0
}

export function seedAll(force = false) {
  if (force || tableEmpty('news')) {
    const news = readJson('news.json')
    const stmt = db.prepare(
      'INSERT OR REPLACE INTO news (id, title, date, summary, bodyHtml, cover, pinned, hidden, sort) VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?)',
    )
    db.prepare('DELETE FROM news').run()
    news.forEach((n, i) =>
      stmt.run(String(n.id), n.title ?? '', n.date ?? '', n.summary ?? '', n.bodyHtml ?? '', n.cover ?? '', i),
    )
  }
  if (force || tableEmpty('notices')) {
    const notices = readJson('notices.json')
    const stmt = db.prepare(
      'INSERT OR REPLACE INTO notices (id, title, date, summary, bodyHtml, cover, pdf, pinned, hidden, sort) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?)',
    )
    db.prepare('DELETE FROM notices').run()
    notices.forEach((n, i) =>
      stmt.run(String(n.id), n.title ?? '', n.date ?? '', n.summary ?? '', n.bodyHtml ?? '', n.cover ?? '', n.pdf ?? '', i),
    )
  }
  if (force || tableEmpty('products')) {
    const products = readJson('products.json').items ?? []
    const stmt = db.prepare(
      `INSERT OR REPLACE INTO products (id, title, category, scene, description, categories, bodyHtml, cover, images, pinned, hidden, sort)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)`,
    )
    db.prepare('DELETE FROM products').run()
    products.forEach((p, i) =>
      stmt.run(
        String(p.id), p.title ?? '', p.category ?? 'wipes', p.scene ?? '',
        p.desc ?? p.description ?? '', p.categories ?? '', p.bodyHtml ?? '',
        p.cover ?? '', JSON.stringify(Array.isArray(p.images) ? p.images : []), i,
      ),
    )
  }
  if (tableEmpty('admin_users')) {
    const salt = randomBytes(16).toString('hex')
    db.prepare('INSERT INTO admin_users (username, pass_hash, salt) VALUES (?, ?, ?)')
      .run('admin', hashPassword('joya2024', salt), salt)
  }
}

seedAll()
