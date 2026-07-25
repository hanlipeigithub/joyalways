import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Newspaper, Pin } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { useContent, visibleSorted, type NewsItem } from '@/lib/contentStore'
import { useI18n } from '@/lib/i18n'

const PAGE_SIZE = 6

/** 无封面新闻的品牌占位（深蓝渐变 + 网格纹理，用于网格小卡） */
function CoverPlaceholder() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-joy-navy via-joy-navy-light to-joy-blue-deep">
      <div className="absolute inset-0 bg-grid-dark opacity-80" aria-hidden />
      <span
        className="pointer-events-none absolute bottom-3 right-5 select-none font-num text-6xl font-semibold tracking-tight text-white/[0.07]"
        aria-hidden
      >
        JOYA
      </span>
      <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-joy-blue">
        <Newspaper className="h-5 w-5" />
      </span>
    </div>
  )
}

/** 置顶小徽章 */
function PinnedBadge() {
  return (
    <span className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-joy-green/90 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
      <Pin className="h-3 w-3" />
      置顶
    </span>
  )
}

export default function NewsPage() {
  const { news } = useContent()
  const { t } = useI18n()
  const all = visibleSorted(news)
  const [count, setCount] = useState(PAGE_SIZE)

  const headline: NewsItem | undefined = all[0]
  const grid = all.slice(1, 1 + count)
  const remaining = all.length - 1 - grid.length

  return (
    <>
      <PageHero
        eyebrow="NEWS & INFORMATION"
        title={t('nav.news')}
        desc="记录洁雅的每一次成长与突破。"
      />

      <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 md:pb-24 md:pt-24">
        {!headline ? (
          /* 空状态 */
          <div className="flex flex-col items-center py-24 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-joy-blue/10 text-joy-blue">
              <Newspaper className="h-7 w-7" />
            </span>
            <p className="mt-6 text-lg font-medium text-joy-navy/60">暂无新闻</p>
            <p className="mt-2 text-sm text-joy-navy/35">敬请期待洁雅的最新动态。</p>
          </div>
        ) : (
          <>
            {/* ===== 头条特写 ===== */}
            <Reveal>
              <Link to={`/news/${headline.id}`} className="group block">
                {headline.cover ? (
                  /* 有封面：大图 + 深蓝渐变遮罩 */
                  <article className="relative overflow-hidden rounded-3xl shadow-lift">
                    <div className="relative h-[380px] md:h-[460px]">
                      <div className="img-zoom h-full">
                        <img
                          src={headline.cover}
                          alt={headline.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-joy-navy/90 via-joy-navy/40 to-joy-navy/10"
                        aria-hidden
                      />
                      {headline.pinned && <PinnedBadge />}
                      <span className="font-num absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] tracking-widest text-white/85 backdrop-blur-md md:left-8 md:top-8">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-joy-green" />
                        {headline.date}
                      </span>

                      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                        <span className="font-num text-[10px] tracking-[0.35em] text-joy-green">
                          HEADLINE · 头条
                        </span>
                        <h2 className="mt-3 max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-white transition-colors group-hover:text-joy-blue md:text-4xl">
                          {headline.title}
                        </h2>
                        {headline.summary && (
                          <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/60 md:text-[15px]">
                            {headline.summary}
                          </p>
                        )}
                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/85 transition-colors group-hover:text-joy-green">
                          {t('common.readMore')}
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                ) : (
                  /* 无封面：浅色编辑级头条卡（避免与深色页头撞色） */
                  <article className="relative overflow-hidden rounded-3xl border border-joy-line bg-joy-mist/70 shadow-soft">
                    <div className="absolute inset-0 bg-grid-fine opacity-60" aria-hidden />
                    <div className="pointer-events-none absolute inset-4" aria-hidden>
                      <div className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-joy-blue/30" />
                      <div className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-joy-blue/30" />
                      <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-joy-blue/30" />
                      <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-joy-blue/30" />
                    </div>
                    <span
                      className="pointer-events-none absolute -right-4 bottom-0 select-none font-num text-[9rem] font-semibold leading-none tracking-tight text-joy-navy/[0.04]"
                      aria-hidden
                    >
                      JOYA
                    </span>
                    {headline.pinned && <PinnedBadge />}
                    <div className="relative flex min-h-[300px] flex-col justify-center p-8 md:min-h-[340px] md:p-14">
                      <div className="flex items-center gap-3">
                        <span className="font-num flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[11px] tracking-widest text-joy-navy/60 shadow-soft">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-joy-green" />
                          {headline.date}
                        </span>
                        <span className="font-num text-[10px] tracking-[0.35em] text-joy-blue">
                          HEADLINE · 头条
                        </span>
                      </div>
                      <h2 className="mt-5 max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-joy-navy transition-colors group-hover:text-joy-blue md:text-4xl">
                        {headline.title}
                      </h2>
                      {headline.summary && (
                        <p className="mt-4 line-clamp-2 max-w-2xl text-sm leading-relaxed text-joy-navy/55 md:text-[15px]">
                          {headline.summary}
                        </p>
                      )}
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-joy-blue transition-colors group-hover:text-joy-blue-deep">
                        {t('common.readMore')}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    </div>
                    {/* hover 底部渐变进度线 */}
                    <span
                      className="absolute inset-x-10 bottom-0 h-[3px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-joy-blue to-joy-green transition-transform duration-700 ease-out group-hover:scale-x-100"
                      aria-hidden
                    />
                  </article>
                )}
              </Link>
            </Reveal>

            {/* ===== 新闻网格 ===== */}
            {grid.length > 0 && (
              <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {grid.map((n, i) => (
                  <Reveal key={n.id} delay={(i % 3) * 110}>
                    <Link to={`/news/${n.id}`} className="block h-full">
                      <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-joy-line bg-white shadow-soft">
                        <div className="img-zoom relative aspect-[16/10]">
                          {n.cover ? (
                            <img
                              src={n.cover}
                              alt={n.title}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <CoverPlaceholder />
                          )}
                          <span className="font-num absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[11px] tracking-widest text-joy-navy/70 backdrop-blur-sm">
                            {n.date}
                          </span>
                          {n.pinned && <PinnedBadge />}
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-joy-navy transition-colors group-hover:text-joy-blue">
                            {n.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-joy-navy/55">
                            {n.summary}
                          </p>
                          <div className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-joy-blue opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                            {t('common.readMore')}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                        {/* hover 底部进度线 */}
                        <span
                          className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-joy-blue to-joy-green transition-transform duration-500 ease-out group-hover:scale-x-100"
                          aria-hidden
                        />
                      </article>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}

            {/* 加载更多 */}
            {remaining > 0 && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setCount((c) => c + PAGE_SIZE)}
                  className="rounded-full border border-joy-blue/30 bg-white/70 px-8 py-3 text-sm font-medium text-joy-blue transition-all hover:bg-joy-blue hover:text-white"
                >
                  加载更多（{remaining} 条）
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
