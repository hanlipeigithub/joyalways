import { useState } from 'react'
import {
  ArrowUpRight, Building2, ChevronDown, ChevronUp, ExternalLink, FileText,
  Globe, Mail, MapPin, Phone,
} from 'lucide-react'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { useI18n } from '@/lib/i18n'
import { snapshotDate, useCninfo, type CninfoItem, type PeriodicItem } from '@/lib/cninfo'
import { cn } from '@/lib/utils'

/** 巨潮资讯网 · 洁雅股份公告页 */
const CNINFO_URL =
  'http://www.cninfo.com.cn/new/disclosure/stock?orgId=9900041541&stockCode=301108#latestAnnouncement'

/** 董秘联系方式（来源：原站抓取事实数据） */
const CONTACT_ROWS = [
  { icon: Phone, label: '传真', value: '0562-6868001' },
  { icon: Mail, label: '邮箱', value: 'zqb@babywipes.com.cn' },
  { icon: MapPin, label: '地址', value: '安徽省铜陵市狮子山经济开发区铜井东路 1928 号' },
  { icon: Building2, label: '邮编', value: '244031' },
  { icon: Globe, label: '网址', value: 'www.babywipes.com.cn' },
]

const KIND_TABS = ['全部', '年度报告', '半年度报告', '一季度报告', '三季度报告'] as const

const KIND_STYLE: Record<string, string> = {
  年度报告: 'bg-joy-blue/10 text-joy-blue',
  半年度报告: 'bg-joy-green/10 text-joy-green',
  一季度报告: 'bg-joy-navy/5 text-joy-navy/60',
  三季度报告: 'bg-joy-navy/5 text-joy-navy/60',
}

const LATEST_DEFAULT = 10

/* ------------------------------------------------------------------ */
/* 小组件                                                              */
/* ------------------------------------------------------------------ */

/** 数据源标识：live 绿色「实时数据」，快照灰色「更新于日期」 */
function SourceBadge({ live, date }: { live: boolean; date: string }) {
  return (
    <span className="flex shrink-0 items-center gap-2 text-xs text-joy-navy/40">
      数据来源：巨潮资讯网
      <span className="flex items-center gap-1.5">
        {live ? (
          <>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-joy-green" />
            <span className="font-medium text-joy-green">实时数据</span>
          </>
        ) : (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-joy-navy/25" />
            <span className="font-num">更新于 {date}</span>
          </>
        )}
      </span>
    </span>
  )
}

function PdfLink({ item }: { item: CninfoItem }) {
  return (
    <a
      href={item.pdf}
      target="_blank"
      rel="noopener noreferrer"
      className="group/pdf flex shrink-0 items-center gap-1.5 rounded-full border border-joy-line px-4 py-1.5 text-xs font-medium text-joy-navy/60 transition-all hover:border-joy-blue hover:bg-joy-blue hover:text-white"
    >
      <FileText className="h-3.5 w-3.5" />
      PDF
      <ArrowUpRight className="h-3 w-3 transition-transform group-hover/pdf:translate-x-0.5 group-hover/pdf:-translate-y-0.5" />
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* 页面                                                                */
/* ------------------------------------------------------------------ */

export default function InvestorPage() {
  const { t } = useI18n()
  const { data, live } = useCninfo()
  const [tab, setTab] = useState<(typeof KIND_TABS)[number]>('全部')
  const [expanded, setExpanded] = useState(false)

  const periodic: PeriodicItem[] =
    tab === '全部' ? data.periodic : data.periodic.filter((p) => p.kind === tab)
  const latestShown = expanded ? data.latest : data.latest.slice(0, LATEST_DEFAULT)
  const fetched = snapshotDate(data)

  return (
    <>
      <PageHero
        eyebrow="INVESTOR RELATIONS"
        title={t('nav.investor')}
        desc="股票代码 301108 · 深圳证券交易所创业板。"
      />

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* 股票信息卡 */}
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-3xl bg-joy-navy p-9 text-white shadow-lift">
              <div className="flex items-center justify-between">
                <span className="font-num text-[11px] tracking-[0.35em] text-white/40">SZSE · CHINEXT</span>
                <span className="flex items-center gap-1.5 text-xs text-joy-green">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-joy-green" />
                  深交所 · 创业板
                </span>
              </div>
              <div className="mt-8">
                <span className="text-sm text-white/50">股票代码</span>
                <div className="font-num mt-1 text-6xl font-semibold tracking-tight md:text-7xl">301108</div>
              </div>
              <div className="mt-8 flex-1 space-y-3 border-t border-white/10 pt-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/45">公司简称</span>
                  <span className="font-medium text-white/90">洁雅股份</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/45">公司全称</span>
                  <span className="text-right text-white/90">铜陵洁雅生物科技股份有限公司</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/45">上市时间</span>
                  <span className="font-num text-white/90">2021-12-03</span>
                </div>
              </div>
              <a
                href={CNINFO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-joy-blue"
              >
                定期公告 · 巨潮资讯网
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </Reveal>

          {/* 董秘联系 */}
          <Reveal delay={140} className="lg:col-span-3">
            <div className="h-full rounded-3xl border border-joy-line bg-white p-8 shadow-soft md:p-9">
              <div className="flex items-center gap-3">
                <span className="font-num text-[11px] tracking-[0.35em] text-joy-blue/80">BOARD SECRETARY</span>
                <span className="hairline-shimmer h-px flex-1" aria-hidden />
              </div>
              <h2 className="mt-3 text-xl font-semibold text-joy-navy">董秘联系</h2>
              <div className="mt-6 divide-y divide-joy-line/60">
                {CONTACT_ROWS.map((row) => (
                  <div key={row.label} className="flex items-center gap-4 py-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-joy-blue/10 text-joy-blue">
                      <row.icon className="h-4 w-4" />
                    </span>
                    <span className="w-12 shrink-0 text-sm text-joy-navy/40">{row.label}</span>
                    <span className="text-sm font-medium text-joy-navy/80">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ===== 定期报告（主打） ===== */}
        <Reveal delay={80}>
          <section className="mt-10 rounded-3xl border border-joy-line bg-white p-8 shadow-soft md:p-9">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-num text-[11px] tracking-[0.35em] text-joy-blue/80">PERIODIC REPORTS</span>
                  <span className="hairline-shimmer h-px w-16" aria-hidden />
                </div>
                <h2 className="mt-3 text-xl font-semibold text-joy-navy">定期报告</h2>
              </div>
              <SourceBadge live={live} date={fetched} />
            </div>

            {/* 分类 Tab */}
            <div className="mt-6 flex flex-wrap gap-2">
              {KIND_TABS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTab(k)}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-[13px] font-medium transition-all',
                    tab === k
                      ? 'bg-joy-navy text-white shadow-soft'
                      : 'bg-joy-mist/80 text-joy-navy/55 hover:bg-joy-blue/10 hover:text-joy-blue',
                  )}
                >
                  {k}
                </button>
              ))}
            </div>

            <div className="mt-4 divide-y divide-joy-line/60">
              {periodic.length === 0 && (
                <p className="py-10 text-center text-sm text-joy-navy/40">该分类暂无报告</p>
              )}
              {periodic.map((p) => (
                <div key={p.id} className="flex items-center gap-4 py-4">
                  <span className="font-num w-24 shrink-0 text-[13px] text-joy-navy/45">{p.date}</span>
                  <span
                    className={cn(
                      'hidden w-[72px] shrink-0 rounded-full px-2.5 py-1 text-center text-[11px] font-medium sm:block',
                      KIND_STYLE[p.kind] ?? 'bg-joy-navy/5 text-joy-navy/60',
                    )}
                  >
                    {p.kind.replace('报告', '')}
                  </span>
                  <span className="line-clamp-1 flex-1 text-sm font-medium text-joy-navy/80">{p.title}</span>
                  {p.sizeKB > 0 && (
                    <span className="font-num hidden shrink-0 text-xs text-joy-navy/30 md:block">
                      {p.sizeKB} KB
                    </span>
                  )}
                  <PdfLink item={p} />
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ===== 最新公告 ===== */}
        <Reveal delay={140}>
          <section className="mt-10 rounded-3xl border border-joy-line bg-white p-8 shadow-soft md:p-9">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-num text-[11px] tracking-[0.35em] text-joy-blue/80">LATEST ANNOUNCEMENTS</span>
                  <span className="hairline-shimmer h-px w-16" aria-hidden />
                </div>
                <h2 className="mt-3 text-xl font-semibold text-joy-navy">最新公告</h2>
              </div>
              <SourceBadge live={live} date={fetched} />
            </div>

            <div className="mt-4 divide-y divide-joy-line/60">
              {latestShown.length === 0 && (
                <p className="py-10 text-center text-sm text-joy-navy/40">暂无公告</p>
              )}
              {latestShown.map((n) => (
                <div key={n.id} className="flex items-center gap-4 py-4">
                  <span className="font-num w-24 shrink-0 text-[13px] text-joy-navy/45">{n.date}</span>
                  <span className="line-clamp-1 flex-1 text-sm font-medium text-joy-navy/80">{n.title}</span>
                  {n.sizeKB > 0 && (
                    <span className="font-num hidden shrink-0 text-xs text-joy-navy/30 md:block">
                      {n.sizeKB} KB
                    </span>
                  )}
                  <PdfLink item={n} />
                </div>
              ))}
            </div>

            {data.latest.length > LATEST_DEFAULT && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setExpanded((e) => !e)}
                  className="inline-flex items-center gap-2 rounded-full border border-joy-blue/30 bg-white/70 px-8 py-2.5 text-sm font-medium text-joy-blue transition-all hover:bg-joy-blue hover:text-white"
                >
                  {expanded ? (
                    <>
                      收起
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      展开全部（{data.latest.length} 条）
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
        </Reveal>

        {/* 免责声明 */}
        <Reveal delay={180}>
          <p className="mt-12 border-t border-joy-line/60 pt-6 text-center text-xs leading-relaxed text-joy-navy/35">
            本页面信息仅供参考，不构成投资建议。市场有风险，投资需谨慎。公司信息以法定信息披露平台公告为准。
          </p>
        </Reveal>
      </div>
    </>
  )
}
