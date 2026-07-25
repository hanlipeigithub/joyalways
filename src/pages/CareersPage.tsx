import { Link } from 'react-router-dom'
import { ArrowRight, Sprout, FlaskConical, Building2, Users } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { useI18n } from '@/lib/i18n'
import pagesJson from '@/data/pages.json'

interface Block {
  key: string
  html: string
}
const JOBS = (pagesJson as { jobs?: { blocks: Block[] } }).jobs

const CARDS = [
  {
    icon: Sprout,
    title: '员工成长',
    en: 'GROWTH',
    desc: '完善的培养体系与晋升通道，让每一位伙伴与企业共同成长。',
    img: '/assets/site/couch/uploads/image/99.jpg',
  },
  {
    icon: FlaskConical,
    title: '研发环境',
    en: 'R&D ENVIRONMENT',
    desc: '理化与微生物检验检测中心，为技术人才提供一流实验平台。',
    img: '/assets/site/couch/uploads/image/research/07.jpg',
  },
  {
    icon: Building2,
    title: '办公环境',
    en: 'WORKPLACE',
    desc: '220,000㎡+ 现代化制造基地，GMP 级洁净车间与舒适办公空间。',
    img: '/assets/site/couch/uploads/image/manufacturing/mc03.jpg',
  },
  {
    icon: Users,
    title: '企业文化',
    en: 'CULTURE',
    desc: '人人皆可成才、人人尽展其才 —— 开放、务实、长期主义。',
    img: '/assets/site/couch/uploads/image/qqq.jpg',
  },
]

export default function CareersPage() {
  const { t } = useI18n()
  return (
    <>
      <PageHero
        eyebrow={t('careers.eyebrow')}
        title={t('careers.title')}
        desc={t('careers.desc')}
        bg="/assets/site/couch/uploads/image/index/banner3.jpg"
      />

      {/* 雇主品牌四卡 */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-7 sm:grid-cols-2">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 110}>
              <div className="card-lift group relative h-72 overflow-hidden rounded-3xl">
                <div className="img-zoom absolute inset-0" aria-hidden>
                  <img src={c.img} alt={c.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-joy-navy/90 via-joy-navy/40 to-transparent" aria-hidden />
                <div className="relative flex h-full flex-col justify-end p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-md">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-white">{c.title}</h3>
                  <span className="font-num text-[10px] tracking-[0.3em] text-white/40">{c.en}</span>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/65">{c.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* 真实招聘岗位与福利 */}
      {JOBS?.blocks?.length ? (
        <div className="mx-auto max-w-5xl space-y-10 px-6 pb-20">
          {JOBS.blocks.map((b, i) => (
            <Reveal key={b.key} delay={i * 120}>
              <div className="rounded-3xl border border-joy-line bg-white p-7 shadow-soft md:p-10">
                <div className="prose-joya" dangerouslySetInnerHTML={{ __html: b.html }} />
              </div>
            </Reveal>
          ))}
        </div>
      ) : null}

      <div className="mx-auto max-w-5xl px-6 pb-20">
        <Reveal>
          <Link
            to="/contact"
            className="group flex items-center justify-between rounded-2xl bg-gradient-to-r from-joy-navy to-joy-blue-deep p-7 text-white transition-all hover:shadow-lift"
          >
            <div>
              <p className="text-lg font-semibold">投递简历 / 咨询岗位</p>
              <p className="mt-1 text-sm text-white/55">人力资源热线：18555222899 · jieyahr@babywipes.com.cn</p>
            </div>
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </Reveal>
      </div>
    </>
  )
}
