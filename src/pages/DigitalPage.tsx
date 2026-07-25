import { Brain, Database, Factory, Network, Boxes, Copy, BotMessageSquare } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { useI18n } from '@/lib/i18n'
import mediaJson from '@/data/media.json'

const MFG: string[] = (mediaJson as { manufacturing: string[] }).manufacturing ?? []

const BOARDS = [
  {
    icon: Brain,
    name: 'AI',
    en: 'ARTIFICIAL INTELLIGENCE',
    desc: '以机器视觉与智能算法赋能质量检测与工艺优化，让产线拥有「思考力」。',
  },
  {
    icon: Database,
    name: 'SAP',
    en: 'ENTERPRISE RESOURCE PLANNING',
    desc: '企业资源计划中枢，打通财务、采购、生产与供应链的全链路数据。',
  },
  {
    icon: Factory,
    name: 'MES',
    en: 'MANUFACTURING EXECUTION SYSTEM',
    desc: '制造执行系统，工单、工艺、质量数据实时采集与追溯。',
  },
  {
    icon: Network,
    name: '工业互联网',
    en: 'INDUSTRIAL INTERNET',
    desc: '设备互联、数据上云，车间每一台设备都是数据网络中的节点。',
  },
  {
    icon: Boxes,
    name: '数字工厂',
    en: 'DIGITAL FACTORY',
    desc: 'WMS 智能仓储与 AGV 无人物流协同，构建全数字化制造底座。',
  },
  {
    icon: Copy,
    name: '数字孪生',
    en: 'DIGITAL TWIN',
    desc: '物理工厂的数字镜像，以仿真驱动决策、以数据预见未来。',
  },
  {
    icon: BotMessageSquare,
    name: 'AI Agent',
    en: 'AI AGENT',
    desc: '探索智能体在排产、质检与知识管理中的应用，让 AI 成为工厂的新同事。',
  },
]

export default function DigitalPage() {
  const { t } = useI18n()
  return (
    <>
      <PageHero
        eyebrow={t('digital.eyebrow')}
        title={t('digital.title')}
        desc={t('digital.desc')}
        bg={MFG[0]}
      />

      <section className="relative overflow-hidden bg-joy-navy py-20 md:py-28">
        <div className="absolute inset-0 bg-grid-dark" aria-hidden />
        <div className="data-stream absolute inset-0 opacity-70" aria-hidden />
        <div
          className="orb orb-a right-[-8%] top-[-15%] h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(15,163,227,0.2),transparent_70%)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BOARDS.map((b, i) => (
              <Reveal key={b.name} delay={i * 90} className={i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-all duration-500 hover:border-joy-blue/40 hover:bg-white/[0.07]">
                  <span className="font-num absolute right-5 top-4 text-4xl font-extralight text-white/10" aria-hidden>
                    0{i + 1}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-joy-blue/25 bg-joy-blue/10 text-joy-blue transition-all duration-500 group-hover:bg-joy-blue group-hover:text-white">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-num mt-6 text-xl font-semibold tracking-wide text-white">{b.name}</h3>
                  <span className="mt-1 font-num text-[10px] tracking-[0.3em] text-joy-blue/60">{b.en}</span>
                  <p className="mt-4 flex-1 text-sm leading-[1.9] text-white/50">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* 车间实拍收尾 */}
          <Reveal delay={250}>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {MFG.slice(3, 6).map((src, i) => (
                <div key={src} className="img-zoom rounded-2xl shadow-lift">
                  <img
                    src={src}
                    alt={`数字化车间 ${i + 1}`}
                    loading="lazy"
                    className="aspect-[16/10] w-full rounded-2xl object-cover"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
