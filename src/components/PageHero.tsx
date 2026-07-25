import Reveal from '@/components/Reveal'

interface PageHeroProps {
  eyebrow: string
  title: string
  desc?: string
  /** 可选背景图（真实抓取素材） */
  bg?: string
}

/** 内页统一页头横幅：深蓝渐变 + 网格 + 可选背景图 */
export default function PageHero({ eyebrow, title, desc, bg }: PageHeroProps) {
  return (
    <section className="page-hero pb-16 pt-36 md:pb-20 md:pt-44">
      <div className="absolute inset-0 bg-grid-dark" aria-hidden />
      {bg && (
        <>
          <img src={bg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-r from-joy-navy via-joy-navy/70 to-joy-navy/30" aria-hidden />
        </>
      )}
      <div
        className="orb orb-a right-[5%] top-[-40%] h-[320px] w-[320px] bg-[radial-gradient(circle,rgba(56,198,244,0.3),transparent_70%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="hairline-shimmer h-px w-10" aria-hidden />
            <span className="font-num text-[11px] font-medium tracking-[0.4em] text-joy-blue">
              {eyebrow}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {title}
          </h1>
          {desc && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55">{desc}</p>}
        </Reveal>
      </div>
    </section>
  )
}
