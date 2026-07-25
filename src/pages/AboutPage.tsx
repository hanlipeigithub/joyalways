import { Link } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, Eye, HeartHandshake, Leaf, Target, Users,
} from 'lucide-react'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* 真实内容常量（来源：原站抓取 pages.json about 栏目 / 首页数据带）      */
/* ------------------------------------------------------------------ */

/** 公司介绍正文（about_sec01 原文分段重排） */
const PROFILE_PARAS = [
  '铜陵市洁雅航空用品有限责任公司，成立于 1999 年 8 月。2021 年 12 月 3 日，铜陵洁雅生物科技股份有限公司在深圳证券交易所创业板成功上市（股票名称：洁雅股份，股票代码：301108）。',
  '洁雅股份经过二十多年的持续研发和技术积累，在溶液配方、生产工艺等方面拥有深厚的技术积累，掌握了一系列核心技术，并凭借深厚的研发实力、丰富的湿巾产品生产经验以及优质的全球客户资源，逐步成长为国内领先的湿巾类产品专业制造商。',
  '公司湿巾类产品涵盖婴儿系列、成人功能型系列、抗菌消毒系列、家庭清洁系列、医用护理系列和宠物清洁系列等六大系列，可以满足客户对各种不同规格、不同功效的湿巾类产品需求，实现一站式采购。同时，公司亦生产包括面膜在内的多种化妆品类产品。',
]

/** 参与 / 承担的标准（about_sec01 真实事实） */
const STANDARDS = [
  'GB/T 27728 湿巾系列国家标准',
  'GB/T 43585 一次性卫生棉条国家标准',
  'T/CTAPI 002 湿巾保存期限评价方法',
  'T/CTAPI 003 匠心产品卫生用品',
  'DB 34/T 1294 抗菌擦拭布（独立起草）',
]

/** 数据面板（首页数据带同源真实数据） */
const PROFILE_STATS = [
  { num: '1999', unit: '年', label: '公司创立' },
  { num: '301108', unit: '', label: '深交所创业板 · 股票代码' },
  { num: '220,000', unit: '㎡+', label: '制造基地面积' },
  { num: '10', unit: '亿', label: '年销售额（近）' },
]

/** 真实历程 + 战略节点的时间轴数据 */
interface Milestone {
  year: string
  title: string
  desc: string
  tag?: string
}
const MILESTONES: Milestone[] = [
  {
    year: '1999',
    title: '公司创立',
    desc: '铜陵市洁雅航空用品有限责任公司成立，开启洁净事业的起点。',
  },
  {
    year: '2008',
    title: '股份制改造',
    desc: '公司更名（股改）为铜陵洁雅生物科技股份有限公司。',
  },
  {
    year: '2021',
    title: '深交所创业板上市',
    desc: '10 月 26 日 IPO 注册生效，12 月 3 日在深圳证券交易所创业板成功上市（股票代码：301108）。',
    tag: '里程碑',
  },
  {
    year: '至今',
    title: '智能制造升级',
    desc: 'SAP / MES / WMS 全面上线，AGV 物流与 AI 质量检测构建数字化未来工厂。',
    tag: '智能制造',
  },
  {
    year: '全球化',
    title: '美国工厂建设 · 全球布局',
    desc: '推进海外制造基地建设，产品服务全球 30+ 国家和地区，向全球个人护理智能制造企业迈进。',
    tag: '全球化',
  },
]

/** 企业文化（sec_culture 原文） */
const CULTURE = [
  {
    icon: Target,
    title: '企业使命',
    en: 'MISSION',
    desc: '持续不断地为全球客户提供极具竞争力的美容护肤、健康护理的产品和服务。',
  },
  {
    icon: Eye,
    title: '企业愿景',
    en: 'VISION',
    desc: '打造美容护肤、健康护理领域最值得信赖的供应商。',
  },
  {
    icon: HeartHandshake,
    title: '核心价值观',
    en: 'VALUES',
    desc: '信任信心、关爱尊重、诚实正直、积极求胜、共创共赢。',
  },
]

const VALUES_CHIPS = ['信任信心', '关爱尊重', '诚实正直', '积极求胜', '共创共赢']

/** 资质荣誉徽章墙（sec_honor 块 8 张真实证书，名称按文件名核对） */
const HONORS = [
  { img: '/assets/site/couch/uploads/image/gao-xin-ji-shu-qi-ye-zheng-shu.jpg', name: '国家高新技术企业' },
  { img: '/assets/site/couch/uploads/image/an-hui-sheng-chuang-xin-xing-qi-ye.jpg', name: '安徽省创新型企业' },
  { img: '/assets/site/couch/uploads/image/sheng-ren-ding-qi-ye-zheng-shu.jpg', name: '省认定企业技术中心' },
  { img: '/assets/site/couch/uploads/image/an-hui-sheng-qing-jie-xiao-du-yong-pin-gong-cheng-ji-shu-yan-jiu-zhong-xin-jiang-pai.jpg', name: '省清洁消毒用品工程技术研究中心' },
  { img: '/assets/site/couch/uploads/image/an-hui-sheng-chan-xue-yan-lian-he-shi-fan-qi-ye.jpg', name: '省产学研联合示范企业' },
  { img: '/assets/site/couch/uploads/image/an-hui-sheng-shang-biao-pin-pai-shi-fan-qi-ye-zheng-shu.jpg', name: '省商标品牌示范企业' },
  { img: '/assets/site/couch/uploads/image/2014nian-sheng-cheng-xin-qi-ye-zheng-shu.jpg', name: '省诚信企业' },
  { img: '/assets/site/couch/uploads/image/tong-ling-shi-di-ba-jie-shi-zhang-zhi-liang-jiang-ti-ming-jiang.jpg', name: '铜陵市市长质量奖提名奖' },
]

/** 社会责任（sec_duty 块真实活动照片） */
const DUTY_PHOTOS = [
  { img: '/assets/site/couch/uploads/image/_1_.jpg', alt: '洁雅社会责任活动 1' },
  { img: '/assets/site/couch/uploads/image/cs.jpg', alt: '洁雅社会责任活动 2' },
  { img: '/assets/site/couch/uploads/image/_2_.jpg', alt: '洁雅社会责任活动 3' },
]

const DUTY_ITEMS = [
  { icon: Leaf, title: '绿色制造', desc: 'FSC 认证材料与可持续供应链并行，以绿色工艺打造洁净产品。' },
  { icon: BadgeCheck, title: '品质承诺', desc: '积极履行企业社会责任，做美容护肤、健康护理领域最值得信赖的供应商。' },
  { icon: Users, title: '回馈社会', desc: '回馈社区、关爱员工，以企业公民的责任心践行长期主义。' },
]

/* ------------------------------------------------------------------ */
/* 小组件                                                              */
/* ------------------------------------------------------------------ */

/** HUD 角标（浅色区用蓝、深色区用亮蓝） */
function HudCorners({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const c = tone === 'dark' ? 'border-joy-blue/50' : 'border-joy-blue/30'
  return (
    <div className="pointer-events-none absolute inset-4" aria-hidden>
      <div className={cn('absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2', c)} />
      <div className={cn('absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2', c)} />
      <div className={cn('absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2', c)} />
      <div className={cn('absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2', c)} />
    </div>
  )
}

function SectionHead({
  index, en, title, dark = false,
}: { index: string; en: string; title: string; dark?: boolean }) {
  return (
    <Reveal>
      <div className="mb-4 flex items-center gap-3">
        <span className="hairline-shimmer h-px w-10" aria-hidden />
        <span className={cn('font-num text-[11px] font-medium tracking-[0.4em]', dark ? 'text-joy-blue' : 'text-joy-blue/80')}>
          {index} · {en}
        </span>
      </div>
      <h2 className={cn('text-3xl font-semibold tracking-tight md:text-4xl', dark ? 'text-white' : 'text-joy-navy')}>
        <span className="title-underline">{title}</span>
      </h2>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */
/* 页面                                                                */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  const { t } = useI18n()
  return (
    <>
      <PageHero
        eyebrow="ABOUT JOYALWAYS"
        title={t('nav.about')}
        desc="创立于 1999 年，国内领先的湿巾类产品专业制造商，2021 年登陆深交所创业板。"
        bg="/assets/site/couch/uploads/image/index/banner2.jpg"
      />

      {/* 锚点导航 */}
      <div className="sticky top-16 z-30 border-b border-joy-line/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-3">
          {[
            ['#pos1', '公司介绍'],
            ['#timeline', t('about.timeline.title')],
            ['#pos2', '企业文化'],
            ['#pos3', '资质荣誉'],
            ['#pos4', '社会责任'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium text-joy-navy/60 transition-colors hover:bg-joy-blue/5 hover:text-joy-blue"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* ============ 01 公司介绍 · 数据面板 ============ */}
      <section id="pos1" className="relative scroll-mt-32 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-grid-fine opacity-60" aria-hidden />
        <HudCorners />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <SectionHead index="01" en="COMPANY PROFILE" title="洁雅简介" />

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            {/* 左：正文 + 标准 */}
            <Reveal>
              <div className="space-y-5">
                {PROFILE_PARAS.map((p) => (
                  <p key={p.slice(0, 12)} className="text-[15px] leading-[1.95] text-joy-navy/65">
                    {p}
                  </p>
                ))}
                <div className="flex flex-wrap gap-2 pt-2">
                  {STANDARDS.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-joy-blue/15 bg-joy-blue/5 px-3 py-1 text-xs text-joy-navy/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* 右：2×2 等宽数字数据面板 */}
            <Reveal delay={120}>
              <div className="relative overflow-hidden rounded-3xl bg-joy-navy p-8 shadow-lift md:p-9">
                <div className="absolute inset-0 bg-grid-dark opacity-70" aria-hidden />
                <div className="scanline" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-num text-[11px] tracking-[0.35em] text-white/40">DATA PANEL</span>
                    <span className="flex items-center gap-1.5 text-xs text-joy-green">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-joy-green" />
                      EST. 1999
                    </span>
                  </div>
                  <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10">
                    {PROFILE_STATS.map((s) => (
                      <div key={s.label} className="bg-joy-navy/95 p-6">
                        <div className="font-num text-3xl font-semibold tracking-tight text-white md:text-4xl">
                          {s.num}
                          {s.unit && <span className="ml-1 text-base font-normal text-joy-green">{s.unit}</span>}
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-white/45">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* 世界地图 · 全球布局 */}
          <Reveal delay={140}>
            <div className="relative mt-12 overflow-hidden rounded-3xl bg-joy-navy shadow-lift">
              <div className="absolute inset-0 bg-grid-dark opacity-60" aria-hidden />
              <div className="relative px-6 pb-8 pt-10 md:px-12 md:pt-12">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className="font-num text-[10px] tracking-[0.3em] text-joy-blue/80">GLOBAL STRATEGY · WORLD MAP</span>
                    <p className="mt-2 text-lg font-semibold text-white md:text-xl">
                      「中国 + 美国 + 埃及」三地联动
                    </p>
                    <p className="mt-1 max-w-md text-xs leading-relaxed text-white/50">
                      先后开始在美国东海岸与埃及苏伊士经济特区建设工厂，全球化制造战略能力迎来巨大升级。
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {[
                      { num: '30+', label: '国家和地区' },
                      { num: '6', label: '湿巾产品系列' },
                    ].map((s) => (
                      <div key={s.label} className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-center backdrop-blur-sm">
                        <div className="font-num text-2xl font-semibold text-white">{s.num}</div>
                        <p className="mt-0.5 text-[11px] text-white/50">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative mt-8">
                  <img
                    src="/assets/site/images/business_map.png"
                    alt="洁雅股份全球业务布局世界地图"
                    loading="lazy"
                    className="w-full opacity-90"
                  />
                  {/* 基地脉冲标记 */}
                  {[
                    { name: '中国 · 铜陵总部', x: '77%', y: '40%', primary: true },
                    { name: '美国 · 东海岸工厂', x: '26%', y: '36%', primary: false },
                    { name: '埃及 · 苏伊士工厂', x: '55%', y: '45%', primary: false },
                  ].map((m) => (
                    <div
                      key={m.name}
                      className="group absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: m.x, top: m.y }}
                    >
                      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${m.primary ? 'bg-joy-green' : 'bg-joy-blue'}`} aria-hidden />
                      <span className={`relative block h-3 w-3 rounded-full ring-4 ${m.primary ? 'bg-joy-green ring-joy-green/25' : 'bg-joy-blue ring-joy-blue/25'}`} />
                      <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/15 bg-joy-navy/85 px-2 py-1 text-[10px] font-medium text-white/85 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                        {m.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* 全景实拍 */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              { img: '/assets/site/couch/uploads/image/99.jpg', alt: '洁雅制造基地全景 1' },
              { img: '/assets/site/couch/uploads/image/qqq.jpg', alt: '洁雅制造基地全景 2' },
            ].map((p, i) => (
              <Reveal key={p.img} delay={i * 120}>
                <div className="img-zoom relative rounded-2xl shadow-soft">
                  <img src={p.img} alt={p.alt} loading="lazy" className="aspect-[3/2] w-full rounded-2xl object-cover" />
                  <span className="font-num absolute left-4 top-4 rounded border border-white/25 bg-joy-navy/50 px-2.5 py-1 text-[10px] tracking-[0.25em] text-white/80 backdrop-blur-sm">
                    PANORAMA · 0{i + 1}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 02 发展时间轴 · 深色科技带 ============ */}
      <section id="timeline" className="relative scroll-mt-32 overflow-hidden bg-joy-navy">
        <div className="absolute inset-0 bg-grid-dark opacity-70" aria-hidden />
        <div className="scanline" />
        <HudCorners tone="dark" />
        <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24">
          <SectionHead index="02" en={t('about.timeline.eyebrow')} title={t('about.timeline.title')} dark />

          <div className="relative mt-16">
            {/* 中央发光竖线 */}
            <div
              className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-joy-blue via-joy-blue/50 to-joy-green shadow-[0_0_12px_rgba(56,198,244,0.6)] md:left-1/2"
              aria-hidden
            />

            <div className="space-y-12">
              {MILESTONES.map((m, i) => (
                <Reveal key={m.year + m.title} delay={i * 100}>
                  <div
                    className={cn(
                      'relative flex md:w-1/2',
                      i % 2 === 0 ? 'md:pr-14' : 'md:ml-auto md:pl-14',
                      'pl-14 md:pl-0',
                      i % 2 === 1 && 'md:pl-14',
                    )}
                  >
                    {/* 脉冲节点 */}
                    <span
                      className={cn(
                        'absolute top-3 flex h-4 w-4 items-center justify-center',
                        'left-3 md:left-auto',
                        i % 2 === 0 ? 'md:-right-2' : 'md:-left-2',
                      )}
                      aria-hidden
                    >
                      <span className={cn('ping-soft absolute h-4 w-4 rounded-full', m.tag ? 'bg-joy-green/40' : 'bg-joy-blue/40')} />
                      <span className={cn('relative h-2.5 w-2.5 rounded-full', m.tag ? 'bg-joy-green' : 'bg-joy-blue')} />
                    </span>

                    <div className="group w-full rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-joy-blue/40 hover:shadow-[0_0_36px_-6px_rgba(56,198,244,0.45)]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-num text-3xl font-semibold tracking-tight text-white md:text-4xl">
                          {m.year}
                        </span>
                        {m.tag && (
                          <span
                            className={cn(
                              'rounded-full px-3 py-1 text-xs font-medium',
                              m.tag === '智能制造'
                                ? 'bg-joy-blue/15 text-joy-blue'
                                : 'bg-joy-green/15 text-joy-green',
                            )}
                          >
                            {m.tag}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2.5 text-lg font-semibold text-white/90">{m.title}</h3>
                      <p className="mt-2 text-sm leading-[1.85] text-white/50">{m.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* 加入我们 CTA */}
          <Reveal delay={200}>
            <Link
              to="/careers"
              className="group mt-16 flex items-center justify-between rounded-2xl border border-joy-blue/30 bg-white/[0.06] p-6 backdrop-blur-sm transition-all hover:border-joy-blue/60 hover:bg-white/[0.09]"
            >
              <div>
                <p className="font-semibold text-white">{t('footer.careers')}</p>
                <p className="mt-1 text-sm text-white/45">{t('careers.desc')}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-joy-blue transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ 03 企业文化 · 浅色 ============ */}
      <section id="pos2" className="relative scroll-mt-32 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-grid-fine opacity-60" aria-hidden />
        <HudCorners />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <SectionHead index="03" en="CORPORATE CULTURE" title="企业文化" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {CULTURE.map((c, i) => (
              <Reveal key={c.title} delay={i * 110}>
                <div className="card-lift flex h-full flex-col rounded-3xl border border-joy-line bg-white p-8 shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-joy-blue/10 text-joy-blue">
                    <c.icon className="h-6 w-6" />
                  </span>
                  <span className="font-num mt-6 text-[10px] tracking-[0.3em] text-joy-navy/25">{c.en}</span>
                  <h3 className="mt-1.5 text-xl font-semibold text-joy-navy">{c.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-[1.9] text-joy-navy/55">{c.desc}</p>
                  {c.title === '核心价值观' && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {VALUES_CHIPS.map((v) => (
                        <span key={v} className="rounded-full bg-joy-green/10 px-2.5 py-1 text-[11px] text-joy-green">
                          {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 04 资质荣誉 · 深色徽章墙 ============ */}
      <section id="pos3" className="relative scroll-mt-32 overflow-hidden bg-joy-navy">
        <div className="absolute inset-0 bg-grid-dark opacity-70" aria-hidden />
        <div className="scanline" />
        <HudCorners tone="dark" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <SectionHead index="04" en="HONORARY CERTIFICATE" title="资质荣誉" dark />
          <Reveal>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
              国家高新技术企业、安徽省创新型企业 —— 每一份认可，都是洁净事业路上的刻度。
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {HONORS.map((h, i) => (
              <Reveal key={h.name} delay={i * 60}>
                <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_32px_-6px_rgba(56,198,244,0.5)]">
                  <div className="flex aspect-[4/3] items-center justify-center bg-joy-mist/60 p-3">
                    <img
                      src={h.img}
                      alt={h.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="border-t border-joy-line/70 px-3 py-3 text-center text-xs font-medium leading-snug text-joy-navy/75">
                    {h.name}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 05 社会责任 · 浅色 ESG ============ */}
      <section id="pos4" className="relative scroll-mt-32 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-grid-fine opacity-60" aria-hidden />
        <HudCorners />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <SectionHead index="05" en="SOCIAL RESPONSIBILITY" title="社会责任" />
          <Reveal>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-joy-navy/55">
              公司秉持「打造美容护肤、健康护理领域最值得信赖的供应商」的企业愿景，积极履行企业社会责任。
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {DUTY_ITEMS.map((d, i) => (
              <Reveal key={d.title} delay={i * 110}>
                <div className="card-lift flex h-full flex-col rounded-3xl border border-joy-line bg-white p-8 shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-joy-green/10 text-joy-green">
                    <d.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-joy-navy">{d.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-[1.9] text-joy-navy/55">{d.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {DUTY_PHOTOS.map((p, i) => (
              <Reveal key={p.img} delay={i * 100}>
                <div className="img-zoom relative rounded-2xl shadow-soft">
                  <img src={p.img} alt={p.alt} loading="lazy" className="aspect-[21/10] w-full rounded-2xl object-cover md:aspect-[16/9]" />
                  <span className="font-num absolute left-4 top-4 rounded border border-white/25 bg-joy-navy/50 px-2.5 py-1 text-[10px] tracking-[0.25em] text-white/80 backdrop-blur-sm">
                    CSR · 0{i + 1}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
