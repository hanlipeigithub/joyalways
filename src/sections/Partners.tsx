import { useI18n } from '@/lib/i18n'
import mediaJson from '@/data/media.json'

const LOGOS: string[] = (mediaJson as { partners: string[] }).partners ?? []

export default function Partners() {
  const { t } = useI18n()
  if (LOGOS.length === 0) return null

  const doubled = [...LOGOS, ...LOGOS, ...LOGOS]

  return (
    <section className="relative overflow-hidden border-y py-20" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* 标题 */}
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: '#3b82f6' }}>
            {t('sec.partners')} · GLOBAL PARTNERS
          </span>
          <h2 className="text-3xl font-bold md:text-4xl" style={{ color: '#0f172a' }}>
            全球<span style={{ color: '#2563eb' }}>合作伙伴</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed" style={{ color: '#64748b' }}>
            与全球领先的零售与品牌客户建立了长期稳定的战略合作关系
          </p>
        </div>

        {/* logo 墙 */}
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#f8fafc] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#f8fafc] to-transparent" />

          <div className="flex overflow-hidden py-2">
            <div className="flex shrink-0 items-center gap-8 pr-8" style={{ animation: 'partner-marquee 25s linear infinite' }}>
              {doubled.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="flex h-20 w-36 shrink-0 items-center justify-center rounded-xl transition-all duration-300 hover:shadow-md"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-10 w-auto transition-all duration-300"
                    style={{ filter: 'none', opacity: 0.65 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 数据 */}
        <div className="mt-14 grid grid-cols-3 gap-6 border-t pt-8 text-center" style={{ borderColor: '#e2e8f0' }}>
          {[
            { num: '30+', label: '服务国家/地区' },
            { num: '10+', label: '全球合作伙伴' },
            { num: '20+', label: '合作年限（最长）' },
          ].map((item, i) => (
            <div key={i}>
              <span className="text-3xl font-bold md:text-4xl" style={{ color: '#2563eb' }}>{item.num}</span>
              <p className="mt-1 text-xs" style={{ color: '#64748b' }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
