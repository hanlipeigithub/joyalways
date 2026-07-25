import {
  Award, BadgeCheck, Beaker, ClipboardCheck, Factory, FlaskConical,
  Microscope, Scale, ShieldCheck,
} from 'lucide-react'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { useI18n } from '@/lib/i18n'

/* ------------------------------------------------------------------ */
/* 结构化事实数据（来源：原站抓取 pages.json research / manufacturing /  */
/* quality / muslim 栏目，仅引用已核实存在于 public/assets/site 的图片）  */
/* ------------------------------------------------------------------ */

const GROUPS = [
  { anchor: 'research', title: '研发能力', en: 'R&D CAPABILITY' },
  { anchor: 'manufacturing', title: '制造能力', en: 'MANUFACTURING' },
  { anchor: 'quality', title: '质量体系', en: 'QUALITY SYSTEM' },
  { anchor: 'halal', title: '清真政策', en: 'HALAL POLICY' },
]

const LABS = [
  '健康护理技术研究室', '美容护肤技术研究室', '新材料技术研究室',
  '包装运输测试实验室', '产品稳定性实验室', '综合研发测试实验室',
  '功效评价测试实验室', '公共实验室检测平台',
]

/** 核心服务（原站 one_step 块） */
const CORE_SERVICES = [
  { icon: ShieldCheck, text: '“消”字证产品、配方、工艺全维度开发' },
  { icon: Beaker, text: '“妆”字证中试、工艺放大应用开发' },
  { icon: Microscope, text: '各项理化 & 微生物检验、测试、分析中心' },
  { icon: FlaskConical, text: '“妆”字证产品、配方全方位研发' },
  { icon: ClipboardCheck, text: '化妆品功效评价' },
]

/** 新产品开发流程（原站 huanjing 块） */
const PROCESS_STEPS = [
  { title: '研发质量管理体系', desc: '全流程质量管控' },
  { title: '包装设计与开发', desc: '材料选择、TD 设计、产品保护' },
  { title: '配方研发', desc: '防腐剂体系、主张声明、毒性测试等' },
  { title: '技术标准', desc: '成品、包装材料、化学品等' },
  { title: '稳定性 / 兼容性测试', desc: '配方 + 基质 + 包装' },
  { title: '法规与合规审核', desc: '市场相关法律法规的识别' },
]

/** 研发成果（原站 research 块） */
const RND_ACHIEVEMENTS = [
  { num: '6', unit: '项', label: '发明专利' },
  { num: '51', unit: '项', label: '实用新型专利' },
  { num: '2', unit: '项', label: '外观设计专利' },
]

const RND_HONORS = [
  '参与制定国家标准《湿巾 GB/T 27728-2011》并参与后续修订',
  '参与制定行业团体标准《匠心产品 卫生用品 T/CTAPI 003-2022》',
  '独立承担安徽省地方标准《抗菌擦拭布 DB 34/T 1294-2010》起草',
  '国家高新技术企业',
  '技术研发中心被认定为“省认定企业技术中心”',
  '“安徽省清洁消毒用品工程技术研究中心”',
  '“酚类化合物多功能抗菌擦拭布”荣获安徽省科学技术奖',
]

/** 产能数据（原站 inquipment 块） */
const CAPACITY = [
  { num: '30', unit: '多条', label: '生产线', desc: '完全满足各类湿巾生产需求，年产能高达 10 亿' },
  { num: '120', unit: '亿片', label: '湿巾线年产能', desc: '年产高达近 120 亿片' },
  { num: '50', unit: '亿片', label: '桶装线年产能', desc: '年产高达近 50 亿片' },
  { num: '1', unit: '亿片', label: '面膜线年产能', desc: '年产高达近 1 亿片' },
]

const WORKSHOP_PHOTOS = [
  '/assets/site/couch/uploads/image/manufacturing/mc01.jpg',
  '/assets/site/couch/uploads/image/manufacturing/mc02.jpg',
  '/assets/site/couch/uploads/image/manufacturing/mc03.jpg',
  '/assets/site/couch/uploads/image/manufacturing/mc04.jpg',
  '/assets/site/couch/uploads/image/manufacturing/mc05.jpg',
  '/assets/site/couch/uploads/image/manufacturing/mc06.jpg',
]

const EQUIPMENT_PHOTOS = [
  '/assets/site/images/zhizao/zhizao_1.jpg',
  '/assets/site/images/zhizao/zhizao_2.jpg',
  '/assets/site/images/zhizao/zhizao_3.jpg',
]

/** 资质认证证书墙（原站 zhiliang_grid_wrap 块，图序与名称经原 HTML 核对） */
const CERTS = [
  { img: '/assets/site/couch/uploads/image/muslim/fda-zheng-shu.jpg', name: 'FDA 证书' },
  { img: '/assets/site/couch/uploads/image/muslim/4.jpg', name: 'GMPC 认证' },
  { img: '/assets/site/couch/uploads/image/muslim/5.jpg', name: 'ISO45001 认证' },
  { img: '/assets/site/couch/uploads/image/muslim/6.jpg', name: 'ISO9001 认证' },
  { img: '/assets/site/couch/uploads/image/muslim/7.jpg', name: 'ISO14001 认证' },
  { img: '/assets/site/couch/uploads/image/muslim/8.jpg', name: 'ISO22716 认证' },
  { img: '/assets/site/couch/uploads/image/muslim/10.jpg', name: '一厂 EPA 证书' },
  { img: '/assets/site/couch/uploads/image/muslim/9.jpg', name: '二厂 EPA 证书' },
  { img: '/assets/site/couch/uploads/image/muslim/fsc-zheng-shu.jpg', name: 'FSC 证书' },
  { img: '/assets/site/couch/uploads/image/muslim/brc-zheng-shu.jpg', name: 'BRC 认证证书' },
]

/** 清真政策承诺（原站 qingzhen_container 块中英全文） */
const HALAL_ITEMS = [
  {
    zh: '保证所有销往穆斯林市场的产品都被 Halal Authorized Body 认证是清真的。',
    en: 'Ensuring all products sold to Moslem market are certified as halal products by Halal Authorized Body.',
  },
  {
    zh: '保证生产中所有的原辅料都是清真的。',
    en: 'Ensuring all raw materials procured and used in the manufacture of our products are halal.',
  },
  {
    zh: '保证所有的生产系统是清洁的，并且没有非清真的和不洁的成分。',
    en: 'Ensuring the production systems are clean and free from non-halal and filthy ingredients.',
  },
]

/* ------------------------------------------------------------------ */
/* 小组件                                                              */
/* ------------------------------------------------------------------ */

function SectionHead({ index, en, title }: { index: number; en: string; title: string }) {
  return (
    <Reveal>
      <div className="mb-8 flex items-center gap-3">
        <span className="font-num text-[11px] font-medium tracking-[0.4em] text-joy-blue/80">
          0{index} · {en}
        </span>
        <span className="hairline-shimmer h-px flex-1" aria-hidden />
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-joy-navy">{title}</h2>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */
/* 页面                                                                */
/* ------------------------------------------------------------------ */

export default function RndPage() {
  const { t } = useI18n()
  return (
    <>
      <PageHero
        eyebrow="R&D & MANUFACTURING"
        title={t('nav.rnd')}
        desc="二十多年的持续研发和技术积累，GMP 级洁净车间与 30 多条生产线。"
        bg="/assets/site/couch/uploads/image/manufacturing/mc02.jpg"
      />

      {/* sticky 锚点子导航 */}
      <div className="sticky top-16 z-30 border-b border-joy-line/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-3">
          {GROUPS.map((g) => (
            <a
              key={g.anchor}
              href={`#${g.anchor}`}
              className="shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium text-joy-navy/60 transition-colors hover:bg-joy-blue/5 hover:text-joy-blue"
            >
              {g.title}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-24 px-6 py-16 md:py-24">
        {/* ============ 01 研发能力 ============ */}
        <section id="research" className="scroll-mt-32">
          <SectionHead index={1} en="R&D CAPABILITY" title="研发能力" />

          {/* 引言 + 实验室 */}
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col rounded-3xl border border-joy-line bg-white p-8 shadow-soft md:p-10">
                <p className="text-xl font-medium leading-relaxed text-joy-navy md:text-2xl">
                  研发筑梦，引领创新。
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-joy-navy/60">
                  洁雅以技术为驱动力，持续为您提供更完美的产品体验，让生活更加美好。
                </p>
                <p className="mt-5 text-sm leading-relaxed text-joy-navy/55">
                  为了满足市场及品牌客户对产品持续研发创新的需求，公司斥巨资于铜陵和上海两地分别建立了现代化的研发技术中心，配备有一流的产品研发所必须的实验仪器和设备设施，与国内多家知名高校基于提取、发酵等工艺建立长期产学研合作，成果颇丰，完全具备独立开发各种湿巾、化妆品类产品的研发能力。
                </p>
                <div className="mt-6 flex flex-wrap gap-2 border-t border-joy-line/70 pt-6">
                  {LABS.map((lab) => (
                    <span
                      key={lab}
                      className="rounded-full border border-joy-blue/15 bg-joy-blue/5 px-3 py-1 text-xs text-joy-navy/70"
                    >
                      {lab}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs text-joy-navy/40">
                  研发中心共拥有近百名技术研发人员。
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="img-zoom h-full rounded-3xl shadow-soft">
                <img
                  src="/assets/site/couch/uploads/image/research/07.jpg"
                  alt="洁雅研发技术中心"
                  loading="lazy"
                  className="h-full min-h-[320px] w-full rounded-3xl object-cover"
                />
              </div>
            </Reveal>
          </div>

          {/* 核心服务 5 卡 */}
          <Reveal delay={80}>
            <h3 className="mt-14 text-lg font-semibold text-joy-navy">
              核心服务
              <span className="font-num ml-3 text-[11px] tracking-[0.3em] text-joy-navy/30">ONE-STOP SERVICE</span>
            </h3>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CORE_SERVICES.map((s, i) => (
              <Reveal key={s.text} delay={i * 70}>
                <div className="group flex h-full flex-col rounded-2xl border border-joy-line bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-joy-blue/10 text-joy-blue transition-colors group-hover:bg-joy-blue group-hover:text-white">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="font-num mt-4 text-[11px] text-joy-navy/25">0{i + 1}</span>
                  <p className="mt-1.5 text-sm font-medium leading-relaxed text-joy-navy/80">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* 新产品开发流程 stepper */}
          <Reveal delay={80}>
            <h3 className="mt-14 text-lg font-semibold text-joy-navy">
              新产品开发流程
              <span className="font-num ml-3 text-[11px] tracking-[0.3em] text-joy-navy/30">DEVELOPMENT PROCESS</span>
            </h3>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 60}>
                <div className="relative h-full rounded-2xl border border-joy-line bg-white p-5 shadow-soft">
                  <span className="font-num flex h-8 w-8 items-center justify-center rounded-full bg-joy-navy text-[13px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <p className="mt-3.5 text-sm font-semibold leading-snug text-joy-navy">{step.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-joy-navy/50">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* 研发成果数字带 */}
          <Reveal delay={100}>
            <div className="relative mt-14 overflow-hidden rounded-3xl bg-joy-navy p-9 shadow-lift md:p-12">
              <div className="absolute inset-0 bg-grid-dark opacity-70" aria-hidden />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-joy-green" />
                  <span className="font-num text-[11px] tracking-[0.35em] text-white/40">
                    RESEARCH AND DEVELOPMENT ABILITY
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-white">研发成果</h3>
                <div className="mt-8 grid gap-8 sm:grid-cols-3">
                  {RND_ACHIEVEMENTS.map((a) => (
                    <div key={a.label}>
                      <div className="font-num text-5xl font-semibold tracking-tight text-white">
                        {a.num}
                        <span className="ml-1 text-lg font-normal text-joy-green">{a.unit}</span>
                      </div>
                      <p className="mt-2 text-sm text-white/50">{a.label}</p>
                    </div>
                  ))}
                </div>
                <ul className="mt-8 grid gap-x-10 gap-y-2.5 border-t border-white/10 pt-7 sm:grid-cols-2">
                  {RND_HONORS.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-white/60">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-joy-green/80" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ============ 02 制造能力 ============ */}
        <section id="manufacturing" className="scroll-mt-32">
          <SectionHead index={2} en="MANUFACTURING" title="制造能力" />

          <div className="grid gap-8 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <div className="flex h-full flex-col justify-between rounded-3xl border border-joy-line bg-white p-8 shadow-soft md:p-10">
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-joy-blue/10 text-joy-blue">
                    <Factory className="h-6 w-6" />
                  </span>
                  <p className="mt-6 text-xl font-medium leading-relaxed text-joy-navy md:text-2xl">精益生产</p>
                  <p className="mt-4 text-sm leading-relaxed text-joy-navy/55">
                    一流的生产线 —— 30 多条生产线，完全满足各类湿巾的生产需求，年产能高达 10 亿。
                  </p>
                </div>
                <p className="font-num mt-8 text-[11px] tracking-[0.3em] text-joy-navy/25">
                  LEAN MANUFACTURING
                </p>
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
              {CAPACITY.map((c, i) => (
                <Reveal key={c.label} delay={i * 70}>
                  <div className="h-full rounded-2xl border border-joy-line bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                    <div className="font-num text-4xl font-semibold tracking-tight text-joy-navy">
                      {c.num}
                      <span className="ml-1 text-base font-normal text-joy-blue">{c.unit}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-joy-navy/75">{c.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-joy-navy/45">{c.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* 车间实拍墙 */}
          <Reveal delay={80}>
            <h3 className="mt-14 text-lg font-semibold text-joy-navy">
              洁净车间实拍
              <span className="font-num ml-3 text-[11px] tracking-[0.3em] text-joy-navy/30">WORKSHOP</span>
            </h3>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            {WORKSHOP_PHOTOS.map((src, i) => (
              <Reveal key={src} delay={i * 60}>
                <div className="img-zoom rounded-xl shadow-soft">
                  <img
                    src={src}
                    alt={`洁雅洁净车间实拍 ${i + 1}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>

          {/* 设备与产线 */}
          <Reveal delay={80}>
            <h3 className="mt-14 text-lg font-semibold text-joy-navy">
              设备与产线
              <span className="font-num ml-3 text-[11px] tracking-[0.3em] text-joy-navy/30">EQUIPMENT</span>
            </h3>
          </Reveal>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {EQUIPMENT_PHOTOS.map((src, i) => (
              <Reveal key={src} delay={i * 70}>
                <div className="img-zoom rounded-xl shadow-soft">
                  <img
                    src={src}
                    alt={`洁雅生产设备 ${i + 1}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============ 03 质量体系 ============ */}
        <section id="quality" className="scroll-mt-32">
          <SectionHead index={3} en="QUALITY SYSTEM" title="质量体系" />
          <Reveal>
            <p className="max-w-2xl text-sm leading-relaxed text-joy-navy/55">
              资质认证 —— 从 FDA、GMPC 到 ISO 体系与 EPA、FSC、BRC，以国际标准构建全流程质量保障。
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {CERTS.map((c, i) => (
              <Reveal key={c.name} delay={i * 50}>
                <div className="group overflow-hidden rounded-2xl border border-joy-line bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex aspect-[3/4] items-center justify-center bg-joy-mist/60 p-3">
                    <img
                      src={c.img}
                      alt={c.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="border-t border-joy-line/70 px-4 py-3 text-center text-[13px] font-medium text-joy-navy/75">
                    {c.name}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============ 04 清真政策 ============ */}
        <section id="halal" className="scroll-mt-32">
          <SectionHead index={4} en="HALAL POLICY" title="清真政策" />
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-joy-line bg-white p-8 shadow-soft md:p-12">
              <span
                className="pointer-events-none absolute -right-6 -top-10 select-none font-num text-[160px] font-semibold leading-none text-joy-blue/[0.05]"
                aria-hidden
              >
                Halal
              </span>
              <div className="relative">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-joy-green/10 text-joy-green">
                  <Scale className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-2xl font-semibold text-joy-navy">Halal Policy</h3>
                <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-joy-navy/70">
                  铜陵洁雅生物科技股份有限公司承诺：我司生产的清真产品满足包括穆斯林消费者在内的所有消费者的要求，我们将做到——
                </p>
                <p className="mt-2 max-w-3xl text-[13px] italic leading-relaxed text-joy-navy/40">
                  Tongling Jieya Biologic Technology Stock Co., Ltd. is committed to consistently produce
                  halal products to meet consumers’ needs including those of the Moslem consumers.
                  We will achieve this by:
                </p>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {HALAL_ITEMS.map((item, i) => (
                    <div key={item.en} className="rounded-2xl border border-joy-line/80 bg-joy-mist/50 p-6">
                      <span className="font-num flex h-8 w-8 items-center justify-center rounded-full bg-joy-navy text-[13px] font-semibold text-white">
                        {i + 1}
                      </span>
                      <p className="mt-4 text-sm font-medium leading-relaxed text-joy-navy/80">{item.zh}</p>
                      <p className="mt-2.5 text-xs italic leading-relaxed text-joy-navy/45">{item.en}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  )
}
