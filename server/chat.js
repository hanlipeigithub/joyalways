// AI 智能助手 - 知识库 + 语义搜索
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { db } from './db.js'

const ROOT = dirname(fileURLToPath(import.meta.url))
const SRC_DATA = join(ROOT, '..', 'src', 'data')

// 停用词（中文常见无意义词）
const STOP_WORDS = new Set('的 了 是 在 我 有 和 就 不 人 都 一 一个 上 也 很 到 说 要 去 你 会 着 没有 看 好 自己 这 他 她 它 们 那 里 么 吗 啊 哦 嗯 吧 呢 让 为 与 及 或 被 把 对 从 向 以 比 如 但 而 因 所 能 可 该 这个 那个 什么 怎么 如何 哪 谁 几 多 少 些 还 又 再 才 就 已经 正在 将会 可能 应该 必须 需要 关于 除了 通过 根据 按照 为了 随着 作为 之后 之前 以上 以下 的 地 得'.split(' '))

// 知识库条目
const knowledgeBase = []

// 中文分词（简单二元分词）
function tokenize(text) {
  const cleaned = text.replace(/<[^>]+>/g, ' ').replace(/[，。！？、；：""''（）【】《》\n\r\t\s]+/g, ' ').toLowerCase()
  const tokens = []
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i]
    if (/[\u4e00-\u9fff]/.test(char)) {
      tokens.push(char)
      if (i + 1 < cleaned.length && /[\u4e00-\u9fff]/.test(cleaned[i + 1])) {
        tokens.push(char + cleaned[i + 1])
      }
    } else if (/[a-zA-Z0-9]/.test(char)) {
      let word = ''
      while (i < cleaned.length && /[a-zA-Z0-9]/.test(cleaned[i])) {
        word += cleaned[i++]
      }
      i--
      tokens.push(word.toLowerCase())
    }
  }
  return tokens.filter(t => t.length > 0 && !STOP_WORDS.has(t))
}

// 构建倒排索引
class SearchEngine {
  constructor() {
    this.index = new Map()   // term → Map<docId, count>
    this.docs = new Map()    // docId → {title, content, source, url}
    this.nextId = 0
  }

  addDoc(title, content, source, url = '') {
    const id = this.nextId++
    const tokens = tokenize(title + ' ' + (content || ''))
    const termCount = new Map()
    
    // 标题词加权 (重复2次)
    const titleTokens = tokenize(title)
    for (const t of titleTokens) {
      termCount.set(t, (termCount.get(t) || 0) + 2)
    }
    
    for (const t of tokens) {
      termCount.set(t, (termCount.get(t) || 0) + 1)
    }

    for (const [term, count] of termCount) {
      if (!this.index.has(term)) this.index.set(term, new Map())
      this.index.get(term).set(id, count)
    }

    this.docs.set(id, { title, content, source, url })
  }

  search(query, maxResults = 5) {
    const queryTokens = tokenize(query)
    if (queryTokens.length === 0) return []

    const scores = new Map()

    for (const qt of queryTokens) {
      const postings = this.index.get(qt)
      if (!postings) continue
      for (const [docId, count] of postings) {
        scores.set(docId, (scores.get(docId) || 0) + count)
      }
    }

    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxResults)
      .map(([docId, score]) => ({
        ...this.docs.get(docId),
        score,
      }))
  }
}

export const engine = new SearchEngine()

// 初始化知识库（加载所有数据）
export function initKnowledgeBase() {
  if (engine.docs.size > 0) return // 只初始化一次

  console.log('🤖 正在初始化 AI 助手知识库...')

  // 1. 加载 pages.json（公司介绍、研发制造等页面内容）
  try {
    const pages = JSON.parse(readFileSync(join(SRC_DATA, 'pages.json'), 'utf-8'))
    for (const [pageKey, pageData] of Object.entries(pages)) {
      const plainText = pageData.plainText || ''
      if (plainText) {
        const lines = plainText.split(/\n+/).filter(l => l.trim().length > 10)
        for (const line of lines) {
          engine.addDoc(line.slice(0, 50) + '...', line, pageKey)
        }
      }
    }
    console.log(`  📄 pages.json: ${engine.docs.size} 条索引`)
  } catch (e) { console.error('  ⚠ pages.json 加载失败:', e.message) }

  // 2. 加载新闻
  try {
    const news = JSON.parse(readFileSync(join(SRC_DATA, 'news.json'), 'utf-8'))
    for (const item of news) {
      const content = (item.summary || '') + ' ' + (item.bodyHtml || '').replace(/<[^>]+>/g, ' ')
      engine.addDoc(item.title, content, 'news', `/news/${item.id}`)
    }
    console.log(`  📰 新闻: ${news.length} 条`)
  } catch (e) { console.error('  ⚠ news.json 加载失败:', e.message) }

  // 3. 加载公告
  try {
    const notices = JSON.parse(readFileSync(join(SRC_DATA, 'notices.json'), 'utf-8'))
    for (const item of notices) {
      const content = (item.summary || '') + ' ' + (item.bodyHtml || '').replace(/<[^>]+>/g, ' ')
      engine.addDoc(item.title, content, 'notices', `/notices/${item.id}`)
    }
    console.log(`  📑 公告: ${notices.length} 条`)
  } catch (e) { console.error('  ⚠ notices.json 加载失败:', e.message) }

  // 4. 加载产品
  try {
    const products = JSON.parse(readFileSync(join(SRC_DATA, 'products.json'), 'utf-8'))
    const items = products.items || products
    for (const item of items) {
      const content = (item.desc || item.description || '') + ' ' + (item.bodyHtml || '').replace(/<[^>]+>/g, ' ')
      engine.addDoc(item.title, content, 'products', `/products/${item.id}`)
    }
    console.log(`  📦 产品: ${items.length} 条`)
  } catch (e) { console.error('  ⚠ products.json 加载失败:', e.message) }

  console.log(`  ✅ AI 助手知识库就绪：共 ${engine.docs.size} 条知识条目`)
}

// 生成回答
export function generateAnswer(question) {
  const results = engine.search(question, 5)

  if (results.length === 0) {
    return {
      answer: '抱歉，我目前的知识库中还没有找到与您问题相关的信息。您可以尝试问一些关于洁雅股份公司介绍、产品、新闻或研发制造方面的问题。',
      sources: [],
    }
  }

  // 构建回答
  const best = results[0]
  let answer = `关于"${question}"，我找到以下相关信息：\n\n`

  if (results.length === 1) {
    answer += best.content.slice(0, 500)
  } else {
    answer += results.map((r, i) => {
      return `${i + 1}. **${r.title}**\n   ${r.content.slice(0, 200)}${r.content.length > 200 ? '…' : ''}`
    }).join('\n\n')
  }

  // 附加信息来源
  answer += '\n\n💡 以上信息来自洁雅股份官网内容。如需更多详情，可以浏览网站相关页面。'

  return {
    answer,
    sources: results.map(r => ({
      title: r.title,
      source: r.source,
      url: r.url,
    })),
  }
}
