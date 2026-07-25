import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Reveal from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
import { useContent, visibleSorted } from '@/lib/contentStore'
import { useI18n } from '@/lib/i18n'

const FALLBACK_COVERS = [
  '/assets/site/couch/uploads/image/6_1_.jpg',
  '/assets/site/couch/uploads/image/10.jpg',
]

export default function HomeNews() {
  const { news } = useContent()
  const { t } = useI18n()
  const items = visibleSorted(news).slice(0, 3)
  if (items.length === 0) return null
  const [featured, ...rest] = items

  return (
    <section id="news" className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={t('sec.news.eyebrow')} title={t('sec.news.title')} />

        <div className="grid gap-6 lg:grid-cols-5">
          {/* 头条 */}
          <Reveal className="lg:col-span-3">
            <Link to={`/news/${featured.id}`} className="block h-full">
              <article className="card-lift group relative flex h-full min-h-[380px] cursor-pointer flex-col justify-between overflow-hidden rounded-3xl p-8 md:p-12">
                <div className="img-zoom absolute inset-0" aria-hidden>
                  <img
                    src={featured.cover || FALLBACK_COVERS[0]}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-joy-navy/95 via-joy-navy/55 to-joy-navy/20" aria-hidden />
                <div className="relative">
                  <span className="font-num rounded-full bg-white/10 px-3 py-1 text-xs tracking-widest text-white/70 backdrop-blur-sm">
                    {featured.date}
                  </span>
                </div>
                <div className="relative mt-24">
                  <h3 className="max-w-xl text-2xl font-semibold leading-snug text-white md:text-[28px]">
                    {featured.title}
                  </h3>
                  <p className="mt-4 line-clamp-2 max-w-lg text-sm leading-relaxed text-white/60">
                    {featured.summary}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-sm font-medium text-joy-blue">
                    阅读全文
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </article>
            </Link>
          </Reveal>

          {/* 次要两条 */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {rest.map((n, i) => (
              <Reveal key={n.id} delay={(i + 1) * 130} className="flex-1">
                <Link to={`/news/${n.id}`} className="block h-full">
                  <article className="card-lift group flex h-full cursor-pointer gap-5 rounded-3xl border border-joy-line bg-joy-mist/60 p-6">
                    <div className="img-zoom hidden w-32 shrink-0 rounded-xl sm:block">
                      <img
                        src={n.cover || FALLBACK_COVERS[1]}
                        alt={n.title}
                        loading="lazy"
                        className="h-full w-full rounded-xl object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="font-num text-xs tracking-widest text-joy-navy/35">{n.date}</span>
                      <h3 className="mt-2 line-clamp-2 font-semibold leading-snug text-joy-navy transition-colors group-hover:text-joy-blue">
                        {n.title}
                      </h3>
                      <div className="mt-auto flex items-center gap-1.5 pt-4 text-[13px] font-medium text-joy-navy/40 transition-colors group-hover:text-joy-blue">
                        阅读全文
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
            <Reveal delay={300}>
              <Link
                to="/news"
                className="group flex items-center justify-center gap-2 rounded-3xl border border-dashed border-joy-blue/30 bg-white/60 py-5 text-sm font-medium text-joy-blue transition-all hover:border-joy-blue/60 hover:bg-joy-blue/5"
              >
                查看全部新闻
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
