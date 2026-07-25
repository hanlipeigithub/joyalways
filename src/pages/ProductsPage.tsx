import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Handshake } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { SCENES, useContent, visibleSorted, type ProductItem } from '@/lib/contentStore'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* 场景列表视图（?scene=x，保持既有筛选逻辑）                             */
/* ------------------------------------------------------------------ */

function SceneListView({ scene, visible }: { scene: string; visible: ProductItem[] }) {
  const { t } = useI18n()
  const meta = SCENES.find((s) => s.key === scene)
  const items = visible.filter((p) => p.scene === scene)
  const cover = items.find((p) => p.cover)?.cover ?? ''
  return (
    <>
      <PageHero
        eyebrow={`SCENES · ${meta?.en ?? scene}`}
        title={t(`scene.${scene}`)}
        desc={t(`scene.${scene}.desc`)}
        bg={cover || undefined}
      />
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <Reveal>
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-joy-navy/50 transition-colors hover:text-joy-blue">
            <ArrowLeft className="h-4 w-4" /> {t('common.back')} · {t('sec.products.title')}
          </Link>
        </Reveal>

        {items.length === 0 ? (
          <div className="mt-14 rounded-3xl border border-dashed border-joy-blue/30 bg-white/70 py-20 text-center">
            <p className="text-joy-navy/50">该场景产品即将上线，敬请期待</p>
            <Link to="/contact" className="mt-4 inline-block text-sm font-medium text-joy-blue">
              联系我们了解定制合作 →
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 110}>
                <Link to={`/products/${p.id}`} className="block h-full">
                  <article className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-joy-line bg-white shadow-soft">
                    <div className="img-zoom relative aspect-[4/3]">
                      {p.cover ? (
                        <img src={p.cover} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-joy-blue/80 to-joy-navy" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-semibold text-joy-navy transition-colors group-hover:text-joy-blue">
                        {p.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-joy-navy/55">{p.desc}</p>
                      <div className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-joy-blue opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        {t('common.learnMore')}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 编辑级场景横幅                                                       */
/* ------------------------------------------------------------------ */

/** 行主题：白 / 雾灰 / 深蓝 / 雾灰 / 白 —— 一条深色形成明暗节奏 */
const ROW_THEMES = [
  { bg: 'bg-white', dark: false },
  { bg: 'bg-joy-mist/70', dark: false },
  { bg: 'bg-joy-navy', dark: true },
  { bg: 'bg-joy-mist/70', dark: false },
  { bg: 'bg-white', dark: false },
] as const

function SceneBanner({
  index,
  sceneKey,
  en,
  items,
}: {
  index: number
  sceneKey: string
  en: string
  items: ProductItem[]
}) {
  const { t } = useI18n()
  const theme = ROW_THEMES[index % ROW_THEMES.length]
  const dark = theme.dark
  const cover = items.find((p) => p.cover)?.cover ?? ''
  const reps = items.filter((p) => p.cover).slice(0, 3)
  const flip = index % 2 === 1

  return (
    <section className={cn('relative overflow-hidden', theme.bg)}>
      {dark && (
        <>
          <div className="absolute inset-0 bg-grid-dark opacity-70" aria-hidden />
          <div className="scanline" />
        </>
      )}
      {!dark && <div className="absolute inset-0 bg-grid-fine opacity-50" aria-hidden />}

      {/* 超大字距英文背景装饰字 */}
      <span
        className={cn(
          'pointer-events-none absolute top-6 select-none font-num text-[15vw] font-semibold uppercase leading-none tracking-[0.08em] lg:text-[10rem]',
          flip ? 'left-4' : 'right-4',
          dark ? 'text-stroke-brand' : 'text-joy-navy/[0.04]',
        )}
        aria-hidden
      >
        {en}
      </span>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:py-20 lg:grid-cols-12 lg:gap-14">
        {/* 大图侧 */}
        <Reveal className={cn('lg:col-span-7', flip && 'lg:order-2')}>
          <div className="group relative">
            <div className="img-zoom rounded-3xl shadow-lift">
              {cover ? (
                <img
                  src={cover}
                  alt={t(`scene.${sceneKey}`)}
                  loading="lazy"
                  className="aspect-[16/11] w-full rounded-3xl object-cover"
                />
              ) : (
                <div className="relative flex aspect-[16/11] w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-joy-navy-light via-joy-navy to-joy-blue-deep">
                  <div className="absolute inset-0 bg-grid-dark opacity-70" aria-hidden />
                  <span className="font-num select-none text-6xl font-semibold uppercase tracking-[0.2em] text-white/10" aria-hidden>
                    {en}
                  </span>
                </div>
              )}
            </div>

            {/* 场景编号悬浮徽章 */}
            <span className="font-num absolute left-5 top-5 rounded-lg border border-white/25 bg-joy-navy/55 px-3 py-1.5 text-sm tracking-[0.2em] text-white backdrop-blur-md">
              0{index + 1}
            </span>

            {/* hover HUD 角标 */}
            <div className="pointer-events-none absolute inset-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden>
              <div className="absolute left-0 top-0 h-7 w-7 border-l-2 border-t-2 border-joy-blue/70" />
              <div className="absolute right-0 top-0 h-7 w-7 border-r-2 border-t-2 border-joy-blue/70" />
              <div className="absolute bottom-0 left-0 h-7 w-7 border-b-2 border-l-2 border-joy-blue/70" />
              <div className="absolute bottom-0 right-0 h-7 w-7 border-b-2 border-r-2 border-joy-blue/70" />
            </div>

            {/* hover 底部渐变进度线 */}
            <span
              className="absolute inset-x-8 bottom-0 h-[3px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-joy-blue to-joy-green transition-transform duration-700 ease-out group-hover:scale-x-100"
              aria-hidden
            />
          </div>
        </Reveal>

        {/* 文案侧 */}
        <Reveal delay={120} className={cn('lg:col-span-5', flip && 'lg:order-1')}>
          <div>
            <div className="flex items-center gap-3">
              <span className="hairline-shimmer h-px w-10" aria-hidden />
              <span className={cn('font-num text-[11px] font-medium tracking-[0.4em]', dark ? 'text-joy-blue' : 'text-joy-blue/80')}>
                SCENE 0{index + 1} · {en}
              </span>
            </div>
            <h2 className={cn('mt-4 text-3xl font-semibold tracking-tight md:text-4xl', dark ? 'text-white' : 'text-joy-navy')}>
              {t(`scene.${sceneKey}`)}
            </h2>
            <p className={cn('mt-4 max-w-md text-[15px] leading-[1.9]', dark ? 'text-white/55' : 'text-joy-navy/55')}>
              {t(`scene.${sceneKey}.desc`)}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span
                className={cn(
                  'font-num rounded-full px-4 py-1.5 text-xs tracking-widest',
                  items.length > 0
                    ? dark
                      ? 'bg-white/10 text-white/75'
                      : 'bg-joy-blue/10 text-joy-navy/65'
                    : dark
                      ? 'bg-joy-green/15 text-joy-green'
                      : 'bg-joy-green/10 text-joy-green',
                )}
              >
                {items.length > 0 ? `${items.length} ${t('products.items')}` : t('products.comingSoon')}
              </span>
            </div>

            {/* 代表产品缩略图链条 */}
            {reps.length > 0 && (
              <div className="mt-7 flex items-center gap-3">
                {reps.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    title={p.title}
                    className="group/thumb relative overflow-hidden rounded-xl shadow-soft transition-transform duration-300 hover:-translate-y-1"
                  >
                    <img
                      src={p.cover}
                      alt={p.title}
                      loading="lazy"
                      className="h-16 w-16 object-cover md:h-[72px] md:w-[72px]"
                    />
                    <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-joy-navy/10 transition group-hover/thumb:ring-2 group-hover/thumb:ring-joy-blue" aria-hidden />
                  </Link>
                ))}
                <span className={cn('ml-1 max-w-[110px] text-[11px] leading-snug', dark ? 'text-white/35' : 'text-joy-navy/35')}>
                  点击缩略图直达产品详情
                </span>
              </div>
            )}

            <Link
              to={`/products?scene=${sceneKey}`}
              className={cn(
                'group mt-8 inline-flex items-center gap-2 text-[15px] font-medium',
                dark ? 'text-joy-blue hover:text-white' : 'text-joy-blue hover:text-joy-blue-deep',
              )}
            >
              {t('products.enter')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* 页面                                                                */
/* ------------------------------------------------------------------ */

export default function ProductsPage() {
  const { products } = useContent()
  const { t } = useI18n()
  const [params] = useSearchParams()
  const scene = params.get('scene')
  const visible = visibleSorted(products)

  if (scene) return <SceneListView scene={scene} visible={visible} />

  return (
    <>
      <PageHero
        eyebrow={t('sec.products.eyebrow')}
        title={t('sec.products.title')}
        desc={t('sec.products.desc')}
        bg="/assets/site/couch/uploads/image/index/banner1.jpg"
      />

      <div>
        {SCENES.map((s, i) => (
          <SceneBanner
            key={s.key}
            index={i}
            sceneKey={s.key}
            en={s.en}
            items={visible.filter((p) => p.scene === s.key)}
          />
        ))}
      </div>

      {/* 合作模式 CTA */}
      <section className="relative overflow-hidden bg-joy-navy">
        <div className="absolute inset-0 bg-grid-dark opacity-70" aria-hidden />
        <div className="scanline" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <Reveal>
            <div>
              <div className="flex items-center gap-3">
                <Handshake className="h-5 w-5 text-joy-green" />
                <span className="font-num text-[11px] tracking-[0.35em] text-white/40">COOPERATION</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">{t('products.coop.title')}</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55 md:text-[15px]">
                {t('products.coop.desc')}
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <Link
              to="/cooperation"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[15px] font-medium text-joy-navy shadow-lift transition-all hover:bg-joy-mist"
            >
              {t('products.coop.button')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
