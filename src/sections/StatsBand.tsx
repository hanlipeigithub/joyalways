import { useCountUp, formatNumber } from '@/hooks/use-count-up'
import { useI18n } from '@/lib/i18n'
import Reveal from '@/components/Reveal'

function Stat({ value, suffix, label, format, delay }: {
  value: number
  suffix: string
  label: string
  format?: boolean
  delay: number
}) {
  const { ref, value: v } = useCountUp(value, 2000)
  return (
    <Reveal delay={delay}>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-baseline gap-1">
          <span ref={ref} className="font-num text-4xl font-semibold tracking-tight text-joy-navy md:text-5xl">
            {format ? formatNumber(v) : v}
          </span>
          <span className="text-lg font-medium text-joy-blue">{suffix}</span>
        </div>
        <span className="text-sm tracking-wide text-joy-navy/50">{label}</span>
      </div>
    </Reveal>
  )
}

/** 第二幕：企业实力数字带 */
export default function StatsBand() {
  const { t } = useI18n()
  return (
    <section className="relative overflow-hidden border-b border-joy-line/70 bg-white py-16 md:py-24">
      <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-5">
          <Stat value={1999} suffix="年" label={t('stats.founded')} delay={0} />
          <Stat value={220000} suffix="㎡+" label={t('stats.base')} format delay={90} />
          <Stat value={57} suffix="项+" label={t('stats.patents')} delay={180} />
          <Stat value={30} suffix="+" label={t('stats.countries')} delay={270} />
          <Stat value={10} suffix="亿" label={t('stats.sales')} delay={360} />
        </div>
      </div>
    </section>
  )
}
