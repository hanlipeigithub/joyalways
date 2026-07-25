import { useState } from 'react'
import Reveal from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import mediaJson from '@/data/media.json'

const MAP: string = (mediaJson as { map: string }).map ?? ''

interface Hotspot {
  key: string
  region: string
  desc: string
  x: number // %
  y: number // %
  home?: boolean
}

const HOTSPOTS: Hotspot[] = [
  { key: 'hq', region: '中国 · 铜陵总部', desc: '220,000㎡+ 智能制造基地，全球交付中枢', x: 73, y: 36, home: true },
  { key: 'na', region: '北美市场', desc: '个人护理产品稳定出口，深化品牌合作', x: 18, y: 30 },
  { key: 'eu', region: '欧洲市场', desc: '以国际质量体系服务欧洲品牌客户', x: 48, y: 22 },
  { key: 'sea', region: '东南亚市场', desc: '区域合作网络持续拓展', x: 74, y: 52 },
  { key: 'sa', region: '南美市场', desc: '新兴市场布局稳步推进', x: 29, y: 66 },
  { key: 'oc', region: '大洋洲市场', desc: '洁净护理产品覆盖大洋洲渠道', x: 83, y: 72 },
]

/** 第三幕：全球布局交互式地图（真实 business_map + 可交互热点） */
export default function GlobalMap() {
  const { t } = useI18n()
  const [active, setActive] = useState<string>('hq')

  return (
    <section id="global" className="relative overflow-hidden bg-joy-navy py-24 md:py-32">
      <div className="absolute inset-0 bg-grid-dark" aria-hidden />
      <div
        className="orb orb-a left-[-8%] top-[-15%] h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(15,163,227,0.2),transparent_70%)]"
        aria-hidden
      />
      <div
        className="orb orb-b right-[-10%] bottom-[-15%] h-[400px] w-[400px] bg-[radial-gradient(circle,rgba(154,205,50,0.1),transparent_70%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={t('sec.global.eyebrow')}
          title={t('sec.global.title')}
          description={t('sec.global.desc')}
          dark
        />

        <Reveal delay={150}>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-joy-navy-light/40 p-4 backdrop-blur-sm md:p-8">
            <div className="relative">
              <img
                src={MAP}
                alt="洁雅全球布局"
                loading="lazy"
                className="h-auto w-full object-contain opacity-90"
              />
              {/* 交互热点 */}
              {HOTSPOTS.map((h) => (
                <div
                  key={h.key}
                  className="group absolute"
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                >
                  <button
                    type="button"
                    onClick={() => setActive(h.key)}
                    aria-label={h.region}
                    className="relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                  >
                    <span
                      className={cn(
                        'absolute h-5 w-5 rounded-full',
                        h.home ? 'bg-joy-green/30' : 'bg-joy-blue/30',
                        'ping-soft',
                      )}
                    />
                    <span
                      className={cn(
                        'relative h-2.5 w-2.5 rounded-full ring-2 transition-all duration-300',
                        h.home ? 'bg-joy-green ring-joy-green/40' : 'bg-joy-blue ring-joy-blue/40',
                        active === h.key && 'scale-150',
                      )}
                    />
                  </button>
                  {/* tooltip */}
                  <div
                    className={cn(
                      'pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 w-48 -translate-x-1/2 rounded-xl border border-white/15 bg-joy-navy/90 p-3.5 opacity-0 shadow-lift backdrop-blur-md transition-all duration-300 group-hover:opacity-100',
                      active === h.key && 'opacity-100',
                    )}
                  >
                    <p className={cn('text-sm font-semibold', h.home ? 'text-joy-green' : 'text-joy-blue')}>
                      {h.region}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-white/60">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t border-white/10 pt-4 text-xs text-white/45">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-joy-green" /> 总部基地
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-joy-blue" /> 海外市场
              </span>
              <span className="font-num tracking-widest">30+ COUNTRIES & REGIONS</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
