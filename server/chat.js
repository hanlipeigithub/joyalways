// 洁雅智能助手 - 高质量知识库 + 智能回答生成
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const SRC_DATA = join(ROOT, '..', 'src', 'data')

// ──── 知识库 ────
const knowledge = { company: [], products: [], news: [], research: [], general: [] }
let initialized = false

// HTML 标签剥离
function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim()
}

// 提取中文关键词（字符二元组）
function extractKeywords(text) {
  const cleaned = text.replace(/<[^>]+>/g, '').replace(/[，。！？、；："“”‘’（）【】《》\n\r\t\sa-zA-Z0-9]+/g, ' ')
  const chars = cleaned.replace(/\s/g, '')
  const result = []
  // 单个有意义的汉字
  for (const c of chars) result.push(c)
  // 二元组
  for (let i = 0; i < chars.length - 1; i++) result.push(chars[i] + chars[i + 1])
  // 三元组
  for (let i = 0; i < chars.length - 2; i++) result.push(chars[i] + chars[i + 1] + chars[i + 2])
  return [...new Set(result.filter(t => t.length > 0))]
}

// 添加条目
function addEntry(category, title, content, extra) {
  knowledge[category].push({
    title,
    content: content.slice(0, 800),
    keywords: extractKeywords(title + ' ' + content),
    ...(extra?.date ? { date: extra.date } : {}),
    ...(extra?.category ? { category: extra.category } : {}),
  })
}

// ──── 初始化 ────
export function initKnowledgeBase() {
  if (initialized) return; initialized = true

  // 核心公司信息
  addEntry('general', '公司简介', '铜陵洁雅生物科技股份有限公司（股票代码：301108），创立于1999年，2021年12月3日在深圳证券交易所创业板上市。公司是国内领先的湿巾类产品专业制造商，产品涵盖婴儿系列、成人功能型系列、抗菌消毒系列、家庭清洁系列、医用护理系列和宠物清洁系列等六大系列。公司亦生产面膜等化妆品类产品。')
  addEntry('general', '公司愿景', '洁雅股份秉持"打造美容护肤、健康护理领域最值得信赖的供应商"的企业愿景。以智能制造与全球视野，守护每一个日常的纯净。')
  addEntry('general', '企业文化', '核心价值观：信任信心、关爱尊重、诚实正直、积极求胜、共创共赢。企业使命：持续不断地为全球客户提供极具竞争力的美容护肤、健康护理的产品和服务。')
  addEntry('general', '发展历程', '1999年公司成立（铜陵市洁雅航空用品有限责任公司）→ 2008年股改更名（铜陵洁雅生物科技股份有限公司）→ 2021年12月3日深交所创业板上市成功（股票代码：301108）。')
  addEntry('general', '全球化布局', '洁雅股份在美国东海岸与埃及苏伊士经济特区建设工厂，构建"中国+美国+埃及"三地联动战略布局。产品网络覆盖全球30多个国家和地区。')
  addEntry('general', '联系方式', '公司名称：铜陵洁雅生物科技股份有限公司。股票代码：301108（深交所创业板）。上市日期：2021年12月3日。')
  addEntry('general', '科研实力', '洁雅拥有59项专利（6项发明、51项实用新型、2项外观设计）。是国家高新技术企业、安徽省创新型企业。参与制定国家标准《GB/T 27728湿巾系列》。')
  addEntry('general', '智能制造', '洁雅股份推进SAP/MES/WMS全流程数字化，AGV与AI质检构建未来工厂。建有数字孪生系统，实现物理工厂的数字镜像。')
  addEntry('general', '研发创新', '洁雅以技术为驱动力，在铜陵和上海建立两大研发技术中心，拥有近百名技术研发人员。设有健康护理技术研究室、美容护肤技术研究室、新材料技术研究室、包装运输测试实验室、产品稳定性实验室等。具备独立开发各种湿巾、化妆品类产品的研发能力。')
  addEntry('general', '专利成果', '洁雅拥有59项专利，其中6项发明专利、51项实用新型专利、2项外观设计专利。公司参与制定了国家标准《GB/T 27728湿巾系列》和《GB/T43585-2023一次性卫生棉条》，独立承担安徽省地方标准《抗菌擦拭布》的起草工作。')
  addEntry('general', '质量认证', '洁雅通过FDA、GMPC、ISO等多项国际检测认证，拥有「消」字证产品、配方、工艺全维度开发能力。理化与微生物检验检测中心为产品品质提供保障。')

  // 从 pages.json 提取内容
  try {
    const pages = JSON.parse(readFileSync(join(SRC_DATA, 'pages.json'), 'utf-8'))
    for (const [pageKey, pageData] of Object.entries(pages)) {
      const blocks = pageData.blocks || []
      for (const block of blocks) {
        if (!block.html) continue
        const text = stripHtml(block.html)
        if (text.length < 30) continue
        const key = block.key || ''
        if (key.includes('about') || key.includes('culture') || key.includes('history')) addEntry('company', `关于洁雅`, text)
        else if (key.includes('yanfa') || key.includes('research') || key.includes('manufactur')) addEntry('research', `研发制造`, text)
        else addEntry('general', pageKey, text)
      }
    }
  } catch {}

  // 产品
  try {
    const data = JSON.parse(readFileSync(join(SRC_DATA, 'products.json'), 'utf-8'))
    const cats = {}; for (const c of (data.categories || [])) cats[c.key] = c.name
    for (const item of (data.items || [])) addEntry('products', item.title, stripHtml((item.desc || item.description || '') + ' ' + (item.bodyHtml || '')), { category: cats[item.category] || item.category || '其他' })
  } catch {}

  // 新闻
  try {
    for (const item of JSON.parse(readFileSync(join(SRC_DATA, 'news.json'), 'utf-8'))) {
      addEntry('news', item.title, stripHtml(item.summary || ''), { date: item.date || '' })
    }
  } catch {}

  // 公告
  try {
    for (const item of JSON.parse(readFileSync(join(SRC_DATA, 'notices.json'), 'utf-8'))) {
      addEntry('news', item.title, stripHtml(item.summary || ''), { date: item.date || '' })
    }
  } catch {}

  const total = Object.values(knowledge).reduce((s, a) => s + a.length, 0)
}

// ──── 匹配 ────
function match(query, entries, topN) {
  const qWords = extractKeywords(query)
  return entries.map(e => {
    let score = 0
    for (const qw of qWords) {
      if (e.keywords?.includes(qw)) score += 2
      if (e.title?.includes(qw)) score += 3
      if (e.content?.includes(qw)) score += 1
    }
    if (qWords.length > 2) score += qWords.filter(qw => e.keywords?.includes(qw)).length * 1.5
    return { entry: e, score }
  }).filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, topN || 3)
}

// ──── 问题分类 ────
function classifyQuestion(q) {
  if (/上市|股票|代码|股价|行情|301108|成立|创立|创始|历史|发展|介绍|简介|愿景|使命|文化|核心|价值观|关于|公司/.test(q)) return 'about'
  if (/产品|生产|制造|湿巾|纸巾|面膜|化妆品|婴儿|护理|消毒|OEM|ODM|采购/.test(q)) return 'product'
  if (/新闻|资讯|公告|报道|动态|最新|消息|通知/.test(q)) return 'news'
  if (/研发|技术|创新|专利|实验|检测|实验室|配方|工艺|工厂|车间|智能|数字化|SAP|MES|WMS|AGV|质量|认证|FDA|ISO/.test(q)) return 'research'
  if (/联系|电话|邮箱|地址|合作|咨询|客服/.test(q)) return 'contact'
  return 'unknown'
}

// ──── 回答构建 ────
function buildAnswer(type, question) {
  const aboutR = match(question, knowledge.company, 3)
  const productR = match(question, knowledge.products, 3)
  const newsR = match(question, knowledge.news, 2)
  const researchR = match(question, knowledge.research, 3)
  const generalR = match(question, knowledge.general, 3)

  const seen = new Set()
  const add = (text) => { const k = text?.slice(0, 40); if (k && !seen.has(k)) { seen.add(k); return true } return false }

  switch (type) {
    case 'about': {
      const parts = []
      for (const r of generalR) if (add(r.entry.content)) parts.push(r.entry.content)
      for (const r of aboutR) if (add(r.entry.content)) parts.push(r.entry.content)
      return parts.length ? parts.join('\n\n') : ''
    }
    case 'product': {
      if (!productR.length) return ''
      return '关于洁雅的产品，我找到以下信息：\n\n' + productR.map((r, i) => `📦 **${r.entry.title}**（${r.entry.category || '其他'}）\n${r.entry.content.slice(0, 300)}`).join('\n\n') + '\n\n💡 更多产品详情请浏览网站 **产品中心** 页面。'
    }
    case 'news': {
      if (!newsR.length) return ''
      return '关于最新的资讯动态：\n\n' + newsR.map(r => `📰 ${r.entry.date ? `**[${r.entry.date}]** ` : ''}${r.entry.title}\n${r.entry.content.slice(0, 200)}`).join('\n\n') + '\n\n💡 更多新闻请浏览网站 **新闻中心** 页面。'
    }
    case 'research': {
      const parts = []
      for (const r of researchR) if (add(r.entry.content)) parts.push(r.entry.content)
      if (!parts.length) for (const r of generalR.filter(g => g.entry.content.includes('专利') || g.entry.content.includes('智能') || g.entry.content.includes('研发'))) if (add(r.entry.content)) parts.push(r.entry.content)
      return parts.length ? '🔬 **洁雅的研发制造能力**\n\n' + parts.join('\n\n') + '\n\n💡 更多信息请浏览网站 **研发制造** 页面。' : ''
    }
    case 'contact':
      return '📞 **联系洁雅股份**\n\n• 公司名称：铜陵洁雅生物科技股份有限公司\n• 股票代码：301108（深交所创业板）\n• 官方网站：https://www.joyalways.com\n\n如需业务合作、OEM/ODM代工咨询，请在网站 **联系我们** 页面填写表单，洁雅团队将第一时间响应。'
    default: {
      const parts = []
      for (const r of generalR) if (add(r.entry.content)) parts.push(r.entry.content)
      for (const r of aboutR) if (add(r.entry.content)) parts.push(r.entry.content)
      for (const r of researchR) if (add(r.entry.content)) parts.push(r.entry.content)
      if (productR.length && parts.length < 3) parts.push(`📦 推荐产品：${productR[0].entry.title}`)
      if (newsR.length && parts.length < 3) parts.push(`📰 最新动态：${newsR[0].entry.title}（${newsR[0].entry.date || ''}）`)
      return parts.length ? parts.join('\n\n') : ''
    }
  }
}

// ──── 入口 ────
export function generateAnswer(question) {
  const q = question.trim()
  if (!q) return { answer: '请问你想了解什么？关于洁雅股份的任何问题都可以问我哦~', sources: [] }

  const type = classifyQuestion(q)
  let answer = buildAnswer(type, q)

  if (!answer) {
    answer = '😊 关于这个问题，我暂时还没有找到确切的信息。你可以试试问：\n\n• 洁雅股份是什么公司？\n• 公司有哪些产品？\n• 公司什么时候上市的？\n• 公司有哪些研发能力？\n• 如何联系洁雅？'
    return { answer, sources: [] }
  }

  // 收集来源
  const sourceMap = new Map()
  for (const r of match(q, knowledge.company, 3)) sourceMap.set(r.entry.title, { title: r.entry.title, source: 'about', url: '' })
  for (const r of match(q, knowledge.products, 3)) sourceMap.set(r.entry.title, { title: r.entry.title, source: 'products', url: '/products' })
  for (const r of match(q, knowledge.news, 2)) sourceMap.set(r.entry.title, { title: r.entry.title, source: 'news', url: '/news' })
  for (const r of match(q, knowledge.research, 3)) sourceMap.set(r.entry.title, { title: r.entry.title, source: 'research', url: '' })
  for (const r of match(q, knowledge.general, 3)) sourceMap.set(r.entry.title, { title: r.entry.title, source: 'general', url: '' })

  return { answer, sources: [...sourceMap.values()].slice(0, 3) }
}
