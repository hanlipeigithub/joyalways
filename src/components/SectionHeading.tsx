import Reveal from '@/components/Reveal'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  /** 英文小标，如 ABOUT JOYALWAYS */
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  dark?: boolean
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  dark = false,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'mb-14 md:mb-20',
        align === 'center' ? 'text-center' : 'text-left',
      )}
    >
      <div
        className={cn(
          'mb-5 flex items-center gap-3',
          align === 'center' && 'justify-center',
        )}
      >
        <span className="hairline-shimmer h-px w-10" aria-hidden />
        <span
          className={cn(
            'font-num text-[11px] font-medium tracking-[0.4em]',
            dark ? 'text-joy-blue' : 'text-joy-blue/80',
          )}
        >
          {eyebrow}
        </span>
        <span className="hairline-shimmer h-px w-10" aria-hidden />
      </div>
      <h2
        className={cn(
          'text-[clamp(2rem,4.2vw,3rem)] font-semibold leading-[1.15] tracking-tight',
          dark ? 'text-white' : 'text-joy-navy',
        )}
      >
        <span className="title-underline">{title}</span>
      </h2>
      {description && (
        <p
          className={cn(
            'mt-5 max-w-2xl text-[15px] leading-relaxed',
            align === 'center' && 'mx-auto',
            dark ? 'text-white/50' : 'text-joy-navy/50',
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  )
}
