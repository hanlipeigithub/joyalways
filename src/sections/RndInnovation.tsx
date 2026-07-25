import { Link } from 'react-router-dom'
import { ArrowRight, FlaskConical, Microscope, BadgeCheck } from 'lucide-react'
import Reveal from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
import { useI18n } from '@/lib/i18n'

const POINTS = [
  { icon: FlaskConical, text: '「消」字证产品、配方、工艺全维度开发' },
  { icon: Microscope, text: '理化 & 微生物检验、测试、分析中心' },
  { icon: BadgeCheck, text: 'FDA / GMPC / ISO 等多项检测认证' },
]

/** 第五幕：研发创新（实验室真实图 + 认证要点） */
export default function RndInnovation() {
  const { t } = useI18n()
  return (
    <section id="rnd-home" className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={t('sec.rnd.eyebrow')}
          title={t('sec.rnd.title')}
          description={t('sec.rnd.desc')}
        />

        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* 实验室实拍组合 */}
          <Reveal className="lg:col-span-7">
            <div className="grid grid-cols-5 gap-4">
              <div className="img-zoom col-span-3 rounded-2xl shadow-soft">
                <img
                  src="/assets/site/couch/uploads/image/research/07.jpg"
                  alt="洁雅研发实验室"
                  loading="lazy"
                  className="aspect-[4/3] h-full w-full rounded-2xl object-cover"
                />
              </div>
              <div className="col-span-2 flex flex-col gap-4">
                <div className="img-zoom flex-1 rounded-2xl shadow-soft">
                  <img
                    src="/assets/site/couch/uploads/image/research/fenxi.jpg"
                    alt="理化分析"
                    loading="lazy"
                    className="h-full w-full rounded-2xl object-cover"
                  />
                </div>
                <div className="img-zoom flex-1 rounded-2xl shadow-soft">
                  <img
                    src="/assets/site/couch/uploads/image/muslim/fda-zheng-shu.jpg"
                    alt="FDA 证书"
                    loading="lazy"
                    className="h-full w-full rounded-2xl object-cover"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          {/* 要点 */}
          <Reveal delay={150} className="lg:col-span-5">
            <div>
              <h3 className="text-3xl font-semibold tracking-tight text-joy-navy md:text-4xl">
                研发筑梦，引领创新
              </h3>
              <p className="mt-5 text-[15px] leading-[1.95] text-joy-navy/60">
                洁雅以技术为驱动力，二十多年的持续研发和技术积累，
                建成理化与微生物检验检测中心，以 59 项专利（6 项发明、51 项实用新型、2 项外观设计）构筑技术护城河。
              </p>
              <ul className="mt-8 space-y-4">
                {POINTS.map((p) => (
                  <li key={p.text} className="flex items-center gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-joy-blue/15 bg-joy-blue/5 text-joy-blue">
                      <p.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-joy-navy/70">{p.text}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/rnd"
                className="group mt-9 inline-flex items-center gap-2 text-sm font-medium text-joy-blue"
              >
                {t('common.learnMore')}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
