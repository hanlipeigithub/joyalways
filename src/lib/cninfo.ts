import { useEffect, useState } from 'react'
import snapshotJson from '@/data/cninfo.json'

/* ------------------------------------------------------------------ */
/* 类型                                                                */
/* ------------------------------------------------------------------ */

export interface CninfoItem {
  id: string
  title: string
  /** YYYY-MM-DD */
  date: string
  /** 完整 PDF URL（static.cninfo.com.cn） */
  pdf: string
  sizeKB: number
}

export interface PeriodicItem extends CninfoItem {
  kind: '年度报告' | '半年度报告' | '一季度报告' | '三季度报告' | string
}

export interface CninfoData {
  source: string
  stock: string
  fetchedAt: string
  periodic: PeriodicItem[]
  latest: CninfoItem[]
}

const SNAPSHOT = snapshotJson as unknown as CninfoData

/* ------------------------------------------------------------------ */
/* 实时拉取（dev 代理 /api/cninfo → www.cninfo.com.cn/new）              */
/* 方案：periodic 复用快照（四类报告变动极少），latest 实时拉 30 条      */
/* ------------------------------------------------------------------ */

const TIMEOUT_MS = 3000

interface RawAnnouncement {
  announcementId: number
  announcementTitle: string
  adjunctUrl: string
  announcementTime: number
  adjunctSize?: number
}

interface RawResponse {
  totalAnnouncement?: number
  announcements?: RawAnnouncement[]
}

function stripEm(s: string): string {
  return s.replace(/<\/?em>/g, '')
}

function fmtDate(ms: number): string {
  const d = new Date(ms)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

/**
 * 尝试实时拉取最新公告；成功返回替换 latest 后的数据，失败（超时 / 非 dev
 * 环境无代理 / 接口异常）返回 null。
 */
export async function fetchCninfoLive(): Promise<CninfoData | null> {
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
    const res = await fetch('/api/cninfo/hisAnnouncement/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: 'pageNum=1&pageSize=30&column=szse&tabName=fulltext&plate=sz&stock=301108%2C9900041541&category=&seDate=',
      signal: ctrl.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return null
    const json = (await res.json()) as RawResponse
    if (!json.announcements || json.announcements.length === 0) return null
    const latest: CninfoItem[] = json.announcements.map((a) => ({
      id: String(a.announcementId),
      title: stripEm(a.announcementTitle),
      date: fmtDate(a.announcementTime),
      pdf: `http://static.cninfo.com.cn/${a.adjunctUrl}`,
      sizeKB: Math.round((a.adjunctSize ?? 0) / 1024),
    }))
    return {
      ...SNAPSHOT,
      latest,
      fetchedAt: fmtDate(Date.now()),
    }
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ */
/* Hook：快照立即渲染，挂载后尝试 live 替换                              */
/* ------------------------------------------------------------------ */

export function useCninfo(): { data: CninfoData; live: boolean } {
  const [data, setData] = useState<CninfoData>(SNAPSHOT)
  const [live, setLive] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchCninfoLive().then((d) => {
      if (cancelled) return
      if (d) {
        setData(d)
        setLive(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { data, live }
}

/** 快照日期（YYYY-MM-DD 部分） */
export function snapshotDate(d: CninfoData): string {
  return d.fetchedAt.slice(0, 10)
}
