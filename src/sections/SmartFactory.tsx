import { Link } from 'react-router-dom'
import { ArrowRight, Database, Factory, Warehouse, Bot, ScanSearch, Boxes } from 'lucide-react'
import Reveal from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
import { useI18n } from '@/lib/i18n'
import mediaJson from '@/data/media.json'

const MFG: string[] = (mediaJson as { manufacturing: string[] }).manufacturing ?? []

const CAPS = [
  { icon: Database, name: 'SAP', desc: '企业资源计划系统，打通财务、采购、生产与供应链数据' },
  { icon: Factory, name: 'MES', desc: '制造执行系统，产线工单、工艺与质量全程数字化管控' },
  { icon: Warehouse, name: 'WMS', desc: '智能仓储管理，库位、批次与出入库实时可视' },
  { icon: Bot, name: 'AGV', desc: '自动导引物流，物料在车间与仓库之间无人化流转' },
  { icon: ScanSearch, name: 'AI 质量检测', desc: '机器视觉与 AI 算法辅助质检，守护每一片产品' },
  { icon: Boxes, name: '数字孪生', desc: '物理工厂的数字镜像，为决策与优化提供仿真底座' },
]

/** 第四幕：智能制造（深蓝科技区块） */
export default function SmartFactory() {
  const { t } = useI18n()
  return (
    <section id="smart" className="relative overflow-hidden bg-joy-navy py-24 md:py-32">
      <div className="absolute inset-0 bg-grid-dark" aria-hidden />
      <div className="data-stream absolute inset-0 opacity-60" aria-hidden />
      <div
        className="orb orb-b right-[-8%] top-[-20%] h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(15,163,227,0.22),transparent_70%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={t('sec.smart.eyebrow')}
          title={t('sec.smart.title')}
          description={t('sec.smart.desc')}
          dark
        />

        <div className="grid gap-10 lg:grid-cols-12">
          {/* 六大能力卡 */}
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
            {CAPS.map((c, i) => (
              <Reveal key={c.name} delay={i * 90}>
                <div className="group flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-500 hover:border-joy-blue/40 hover:bg-white/[0.07]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-joy-blue/25 bg-joy-blue/10 text-joy-blue transition-all duration-500 group-hover:bg-joy-blue group-hover:text-white">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-num font-semibold tracking-wide text-white">{c.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/50">{c.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* 车间实拍 */}
          <Reveal delay={200} className="lg:col-span-5">
            <div className="flex h-full flex-col gap-5">
              <div className="img-zoom rounded-2xl shadow-lift">
                <img
                  src={MFG[1] ?? MFG[0]}
                  alt="洁雅智能车间"
                  loading="lazy"
                  className="aspect-[16/10] w-full rounded-2xl object-cover"
                />
              </div>
              <div className="img-zoom flex-1 rounded-2xl shadow-lift">
                <img
                  src={MFG[2] ?? MFG[0]}
                  alt="洁雅洁净产线"
                  loading="lazy"
                  className="aspect-[16/9] h-full w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={260}>
          <div className="mt-12">
            <Link
              to="/digital"
              className="group inline-flex items-center gap-2 rounded-full border border-joy-blue/40 bg-joy-blue/10 px-7 py-3 text-sm font-medium text-joy-blue backdrop-blur-sm transition-all hover:bg-joy-blue hover:text-white"
            >
              {t('sec.smart.cta')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
