import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import mediaJson from '@/data/media.json'

const MEDIA = mediaJson as { banners: string[]; manufacturing: string[] }

const SLIDES = [
  ...[...MEDIA.banners].sort(),
  '/images/hero-slide4.jpg',
  '/images/hero-slide5.jpg',
]

export default function Hero() {
  const { t } = useI18n()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden bg-joy-navy">
      {/* 背景视频 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        poster={SLIDES[0]}
      >
        <source src="/videos/production-line.mp4" type="video/mp4" />
      </video>

      {/* Ken Burns 多层轮播 */}
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className={cn(
            'absolute inset-0 transition-opacity ease-out',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
          style={{ transitionDuration: '1800ms' }}
          aria-hidden={i !== index}
        >
          <img
            src={src}
            alt=""
            className={cn('h-full w-full object-cover', i === index && 'ken-burns')}
            fetchPriority={i === 0 ? 'high' : 'auto'}
          />
        </div>
      ))}
      {/* 压暗渐变，保证文字可读 */}
      <div className="absolute inset-0 bg-gradient-to-r from-joy-navy/70 via-joy-navy/30 to-joy-navy/5" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-joy-navy/60 to-transparent" aria-hidden />

      {/* HUD 元素：扫描线 + 角标 */}
      <div className="absolute inset-0" aria-hidden>
        <div className="scanline" />
        <div className="absolute left-6 top-28 h-10 w-10 border-l-2 border-t-2 border-joy-blue/50" />
        <div className="absolute right-6 top-28 h-10 w-10 border-r-2 border-t-2 border-joy-blue/50" />
        <div className="absolute bottom-40 left-6 h-10 w-10 border-b-2 border-l-2 border-joy-blue/50" />
        <div className="absolute bottom-40 right-6 h-10 w-10 border-b-2 border-r-2 border-joy-blue/50" />
        <span className="font-num absolute bottom-44 left-8 hidden text-[10px] tracking-[0.3em] text-white/40 md:block">
          31.0°N 117.8°E · TONGLING SMART FACTORY
        </span>
      </div>

      {/* 主内容 */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-40 pt-36">
        <div className="hero-line" style={{ '--hero-delay': '100ms' } as CSSProperties}>
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-joy-green" />
            <span className="text-[11px] font-medium tracking-[0.35em] text-white/80">
              {t('hero.badge')} · EST. 1999
            </span>
          </div>
        </div>

        <h1>
          <span
            className="hero-line block whitespace-pre-line text-[clamp(2.4rem,6.2vw,4.8rem)] font-semibold leading-[1.12] tracking-tight text-white"
            style={{ '--hero-delay': '260ms' } as CSSProperties}
          >
            {t('hero.title')}
          </span>
          <span
            className="hero-line mt-5 block font-num text-[clamp(0.9rem,1.8vw,1.3rem)] font-light tracking-[0.3em] text-joy-blue"
            style={{ '--hero-delay': '420ms' } as CSSProperties}
          >
            GLOBAL PERSONAL CARE SMART MANUFACTURER
          </span>
        </h1>

        <p
          className="hero-line mt-8 max-w-xl text-base leading-[2] text-white/70 md:text-lg"
          style={{ '--hero-delay': '560ms' } as CSSProperties}
        >
          {t('hero.sub')}
        </p>

        <div
          className="hero-line mt-11 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          style={{ '--hero-delay': '700ms' } as CSSProperties}
        >
          <Button
            asChild
            size="lg"
            className="group rounded-full bg-joy-blue px-9 text-[15px] text-white shadow-[0_18px_44px_-12px_rgba(15,163,227,0.6)] transition-all hover:bg-joy-blue-deep"
          >
            <Link to="/about">
              {t('hero.cta1')}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-white/35 bg-white/10 px-9 text-[15px] text-white backdrop-blur-md hover:border-white/60 hover:bg-white/15 hover:text-white"
          >
            <Link to="/products">{t('hero.cta2')}</Link>
          </Button>
        </div>

        {/* 轮播指示点 */}
        <div className="hero-line mt-12 flex items-center gap-2.5" style={{ '--hero-delay': '820ms' } as CSSProperties}>
          {SLIDES.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`slide ${i + 1}`}
              className={cn(
                'h-1 rounded-full transition-all duration-500',
                i === index ? 'w-9 bg-white' : 'w-4 bg-white/35 hover:bg-white/60',
              )}
            />
          ))}
        </div>
      </div>

      {/* 右下角滚动指示器 */}
      <div
        className="hero-line absolute bottom-14 right-8 hidden flex-col items-center gap-3 md:flex lg:right-12"
        style={{ '--hero-delay': '940ms' } as CSSProperties}
        aria-hidden
      >
        <span className="font-num text-[10px] tracking-[0.45em] text-white/50 [writing-mode:vertical-lr]">SCROLL</span>
        <div className="relative h-14 w-px overflow-hidden bg-white/25">
          <div className="scroll-hint-dot absolute left-0 top-0 h-5 w-px bg-joy-blue" />
        </div>
      </div>
    </section>
  )
}
