import { useI18n } from '@/lib/i18n'
import mediaJson from '@/data/media.json'

const LOGOS: string[] = (mediaJson as { partners: string[] }).partners ?? []

// 品牌名称映射（仅视觉展示）
const BRAND_NAMES: Record<string, string> = {
  'c03': 'Walmart',
  'c07': 'Costco',
  'c10': 'Target',
}

function getBrandName(src: string) {
  for (const [key, name] of Object.entries(BRAND_NAMES)) {
    if (src.includes(key)) return name
  }
  return 'Partner'
}

export default function Partners() {
  const { t } = useI18n()
  if (LOGOS.length === 0) return null

  // 双倍克隆用于无缝滚动
  const doubled = [...LOGOS, ...LOGOS, ...LOGOS]

  return (
    <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#0a0e1a' }}>
      {/* 背景装饰光晕 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-40 top-1/3 h-80 w-80 rounded-full opacity-[0.03]" style={{ backgroundColor: '#3b82f6' }} />
        <div className="absolute -right-40 top-1/2 h-80 w-80 rounded-full opacity-[0.03]" style={{ backgroundColor: '#3b82f6' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* 标题 */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-blue-400">
            {t('sec.partners')}
          </span>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            全球<span className="text-blue-400">合作伙伴</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500">
            与全球领先的零售与品牌客户建立了长期稳定的战略合作关系
          </p>
        </div>

        {/* logo 墙 */}
        <div className="relative">
          {/* 左右渐变遮罩 */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#0a0e1a] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#0a0e1a] to-transparent" />

          <div className="flex overflow-hidden py-4">
            <div className="flex shrink-0 items-center gap-10 pr-10" style={{ animation: 'partner-marquee 25s linear infinite' }}>
              {doubled.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="group flex h-24 w-40 shrink-0 items-center justify-center rounded-xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-1"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <img
                    src={src}
                    alt={getBrandName(src)}
                    loading="lazy"
                    className="h-10 w-auto opacity-40 transition-all duration-500 group-hover:opacity-90"
                    style={{ filter: 'grayscale(1) brightness(1.5)' }}
                    onMouseOver={e => { e.currentTarget.style.filter = 'grayscale(0) brightness(1)' }}
                    onMouseOut={e => { e.currentTarget.style.filter = 'grayscale(1) brightness(1.5)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 合作数据 */}
        <div className="mt-16 grid grid-cols-3 gap-6 border-t pt-10 text-center" style={{ borderColor: '#1e293b' }}>
          {[
            { num: '30+', label: '服务国家/地区' },
            { num: '10+', label: '全球合作伙伴' },
            { num: '20+', label: '合作年限（最长）' },
          ].map((item, i) => (
            <div key={i}>
              <span className="text-3xl font-bold text-white md:text-4xl">
                <span className="bg-gradient-to-b from-blue-400 to-blue-600 bg-clip-text text-transparent">{item.num}</span>
              </span>
              <p className="mt-1.5 text-xs text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
