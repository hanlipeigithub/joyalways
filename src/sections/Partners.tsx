import Reveal from '@/components/Reveal'
import { useI18n } from '@/lib/i18n'
import mediaJson from '@/data/media.json'

const PARTNERS: string[] = (mediaJson as { partners: string[] }).partners ?? []

/** 第七幕前奏：合作客户 logo 无缝 marquee 墙 */
export default function Partners() {
  const { t } = useI18n()
  if (PARTNERS.length === 0) return null
  const row = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS]
  return (
    <section className="relative overflow-hidden border-y border-joy-line/70 bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="text-center font-num text-[11px] tracking-[0.4em] text-joy-navy/35">
            {t('sec.partners')} · GLOBAL PARTNERS
          </p>
        </Reveal>
      </div>
      <div className="mt-8 flex overflow-hidden" aria-hidden>
        <div className="marquee-track flex shrink-0 items-center gap-16 pr-16">
          {row.map((src, i) => (
            <img
              key={`${src}-${i}`}
              src={src}
              alt=""
              loading="lazy"
              className="h-9 w-auto opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 md:h-11"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
