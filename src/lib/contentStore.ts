import { useEffect, useState } from 'react'
import newsJson from '@/data/news.json'
import noticesJson from '@/data/notices.json'
import productsJson from '@/data/products.json'

/* ------------------------------------------------------------------ */
/* 数据模型                                                            */
/* ------------------------------------------------------------------ */

export interface NewsItem {
  id: string
  title: string
  date: string
  summary: string
  bodyHtml: string
  cover: string
  hidden: boolean
  pinned: boolean
}

export interface NoticeItem extends NewsItem {
  pdf: string
}

export interface ProductItem {
  id: string
  category: 'wipes' | 'beauty' | string
  /** 应用场景：baby-care / medical-care / home-care / pet-care / beauty-care */
  scene: string
  title: string
  desc: string
  categories: string
  cover: string
  images?: string[]
  bodyHtml: string
  hidden: boolean
  pinned: boolean
}

export interface Scene {
  key: string
  name: string
  en: string
}

/** 五大应用场景 */
export const SCENES: Scene[] = [
  { key: 'baby-care', name: '婴童护理', en: 'BABY CARE' },
  { key: 'medical-care', name: '医疗护理', en: 'MEDICAL CARE' },
  { key: 'home-care', name: '家庭清洁', en: 'HOME CARE' },
  { key: 'pet-care', name: '宠物护理', en: 'PET CARE' },
  { key: 'beauty-care', name: '美妆护理', en: 'BEAUTY CARE' },
]

export function sceneName(key: string): string {
  return SCENES.find((s) => s.key === key)?.name ?? key
}

/** 缺 scene 字段时按关键词回退映射（兼容旧数据） */
export function inferScene(item: { title?: string; desc?: string; categories?: string; category?: string }): string {
  const text = `${item.title ?? ''} ${item.desc ?? ''} ${item.categories ?? ''}`
  if (/婴|儿童|宝宝|baby/i.test(text)) return 'baby-care'
  if (/宠物|pet/i.test(text)) return 'pet-care'
  if (/消毒|抗菌|医|器械|酒精/i.test(text)) return 'medical-care'
  if (/家清|家居|厨房|厕|干巾|个人护理|日常/i.test(text)) return 'home-care'
  if (item.category === 'beauty') return 'beauty-care'
  return 'home-care'
}

export interface ProductCategory {
  key: string
  name: string
  en: string
}

export const PRODUCT_CATEGORIES: ProductCategory[] =
  (productsJson as { categories: ProductCategory[] }).categories ?? []

/* ------------------------------------------------------------------ */
/* 数据源：bundle 快照首屏 + /api/content 实时替换（生产静态环境自动降级） */
/* ------------------------------------------------------------------ */

const UPDATE_EVENT = 'joya-cms-update'

interface ContentCache {
  news: NewsItem[]
  notices: NoticeItem[]
  products: ProductItem[]
  /** 'snapshot' = bundle JSON，'api' = dev server 数据库 */
  source: 'snapshot' | 'api'
}

function normProducts(items: Omit<ProductItem, 'hidden' | 'pinned'>[] | ProductItem[]): ProductItem[] {
  return items.map((it) => ({
    hidden: false,
    pinned: false,
    ...it,
    scene: it.scene || inferScene(it),
  }))
}

const SNAPSHOT: ContentCache = {
  news: (newsJson as Omit<NewsItem, 'hidden' | 'pinned'>[]).map((n) => ({ ...n, hidden: false, pinned: false })),
  notices: (noticesJson as Omit<NoticeItem, 'hidden' | 'pinned'>[]).map((n) => ({ ...n, hidden: false, pinned: false })),
  products: normProducts(productsJson.items as Omit<ProductItem, 'hidden' | 'pinned'>[]),
  source: 'snapshot',
}

let cache: ContentCache = SNAPSHOT
let inflight: Promise<void> | null = null

/** 一次性清理旧演示方案的 localStorage 覆盖层与旧门禁标记 */
try {
  localStorage.removeItem('joya-cms-v1')
  localStorage.removeItem('joya-admin-auth')
} catch {
  /* ignore */
}

/** 从 dev server API 拉取最新内容；失败（生产静态环境）保持快照 */
export function refreshContent(): Promise<void> {
  if (inflight) return inflight
  inflight = fetch('/api/content')
    .then(async (res) => {
      if (!res.ok) return
      const json = (await res.json()) as Partial<ContentCache>
      if (!Array.isArray(json.news) || !Array.isArray(json.products)) return
      cache = {
        news: json.news as NewsItem[],
        notices: (json.notices ?? []) as NoticeItem[],
        products: normProducts(json.products as ProductItem[]),
        source: 'api',
      }
      window.dispatchEvent(new Event(UPDATE_EVENT))
    })
    .catch(() => {
      /* 无 API 环境：保持快照 */
    })
    .finally(() => {
      inflight = null
    })
  return inflight
}

/* ------------------------------------------------------------------ */
/* 同步读取（当前缓存）                                                  */
/* ------------------------------------------------------------------ */

export function getNews(): NewsItem[] {
  return cache.news
}
export function getNotices(): NoticeItem[] {
  return cache.notices
}
export function getProducts(): ProductItem[] {
  return cache.products
}
export function contentSource(): 'snapshot' | 'api' {
  return cache.source
}

/* 可见 + 排序（置顶优先，再按日期倒序） */
export function visibleSorted<T extends { hidden: boolean; pinned: boolean; date?: string }>(items: T[]): T[] {
  return items
    .filter((i) => !i.hidden)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return (b.date || '').localeCompare(a.date || '')
    })
}

/* ------------------------------------------------------------------ */
/* React 订阅                                                          */
/* ------------------------------------------------------------------ */

export function useContent() {
  const [, setTick] = useState(0)
  useEffect(() => {
    const bump = () => setTick((t) => t + 1)
    window.addEventListener(UPDATE_EVENT, bump)
    refreshContent()
    return () => window.removeEventListener(UPDATE_EVENT, bump)
  }, [])
  return {
    news: getNews(),
    notices: getNotices(),
    products: getProducts(),
  }
}
