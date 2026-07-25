import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Reveal from '@/components/Reveal'
import { useI18n } from '@/lib/i18n'

/** 联系表单前的深蓝渐变 CTA 横幅（水波 + 网格背景） */
export default function CtaBanner() {
  const { t } = useI18n()
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-joy-navy via-joy-navy-light to-joy-blue-deep py-20 md:py-28">
      <div className="absolute inset-0 bg-grid-dark opacity-80" aria-hidden />
      <div
        className="orb orb-a right-[10%] top-[-40%] h-[360px] w-[360px] bg-[radial-gradient(circle,rgba(56,198,244,0.3),transparent_70%)]"
        aria-hidden
      />

      {/* 水波纹装饰 */}
      <svg
        viewBox="0 0 1600 120"
        preserveAspectRatio="none"
        className="wave-drift absolute bottom-0 left-0 h-20 w-[200%] opacity-20"
        aria-hidden
      >
        <path
          d="M0 60 C 130 20, 270 100, 400 60 C 530 20, 670 100, 800 60 C 930 20, 1070 100, 1200 60 C 1330 20, 1470 100, 1600 60 L1600 120 L0 120 Z M1600 60 C 1730 20, 1870 100, 2000 60 C 2130 20, 2270 100, 2400 60 C 2530 20, 2670 100, 2800 60 C 2930 20, 3070 100, 3200 60 L3200 120 L1600 120 Z"
          fill="rgba(56,198,244,0.6)"
        />
      </svg>
      <svg
        viewBox="0 0 1600 120"
        preserveAspectRatio="none"
        className="wave-drift-rev absolute bottom-0 left-0 h-14 w-[200%] opacity-15"
        aria-hidden
      >
        <path
          d="M0 70 C 160 110, 320 30, 480 70 C 640 110, 800 30, 960 70 C 1120 110, 1280 30, 1440 70 C 1600 110, 1600 110, 1600 70 L1600 120 L0 120 Z M1600 70 C 1760 110, 1920 30, 2080 70 C 2240 110, 2400 30, 2560 70 C 2720 110, 2880 30, 3040 70 C 3200 110, 3200 110, 3200 70 L3200 120 L1600 120 Z"
          fill="rgba(154,205,50,0.5)"
        />
      </svg>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 text-center md:flex-row md:justify-between md:text-left">
        <Reveal>
          <div>
            <span className="font-num text-[11px] tracking-[0.4em] text-white/40">
              COOPERATION INQUIRY
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-snug tracking-tight text-white md:text-4xl">
              {t('cta.title1')}
              <span className="text-joy-green">{t('cta.title2')}</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
              {t('cta.desc')}
            </p>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <Button
            asChild
            size="lg"
            className="group shrink-0 rounded-full bg-white px-9 text-[15px] font-medium text-joy-navy shadow-[0_18px_44px_-12px_rgba(0,0,0,0.4)] transition-all hover:bg-joy-mist hover:shadow-[0_22px_54px_-12px_rgba(0,0,0,0.5)]"
          >
            <Link to="/contact">
              {t('cta.button')}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
