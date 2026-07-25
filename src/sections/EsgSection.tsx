import { Leaf, Recycle, HeartHandshake } from 'lucide-react'
import Reveal from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
import { useI18n } from '@/lib/i18n'

const CARDS = [
  {
    icon: Leaf,
    title: '绿色制造',
    en: 'GREEN MANUFACTURING',
    desc: '以清洁能源与绿色工艺打造洁净产品，FSC 认证材料与可持续供应链并行。',
  },
  {
    icon: Recycle,
    title: '节能减排',
    en: 'ENERGY & EMISSION',
    desc: '持续优化产线能耗与废弃物管理，让每一分资源都物尽其用。',
  },
  {
    icon: HeartHandshake,
    title: '社会责任',
    en: 'SOCIAL RESPONSIBILITY',
    desc: '回馈社区、关爱员工，以企业公民的责任心践行长期主义。',
  },
]

/** 第六幕：ESG（绿色点缀色强化区） */
export default function EsgSection() {
  const { t } = useI18n()
  return (
    <section id="esg" className="relative overflow-hidden bg-joy-mist py-24 md:py-32">
      <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
      <div
        className="orb orb-a left-[-8%] bottom-[-20%] h-[400px] w-[400px] bg-[radial-gradient(circle,rgba(154,205,50,0.16),transparent_70%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={t('sec.esg.eyebrow')}
          title={t('sec.esg.title')}
          description={t('sec.esg.desc')}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 130}>
              <div className="card-lift group relative h-full overflow-hidden rounded-2xl border border-joy-line bg-white p-8">
                <div
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-joy-green/70 via-joy-green to-joy-green/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                />
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-joy-green/10 text-joy-green transition-all duration-500 group-hover:bg-joy-green group-hover:text-white">
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-joy-navy">{c.title}</h3>
                <span className="font-num mt-1 block text-[10px] tracking-[0.3em] text-joy-navy/35">{c.en}</span>
                <p className="mt-4 text-sm leading-[1.9] text-joy-navy/55">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
