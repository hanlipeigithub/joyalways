import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { useContent, visibleSorted } from '@/lib/contentStore'
import { useI18n } from '@/lib/i18n'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { products } = useContent()
  const { t } = useI18n()
  const visible = visibleSorted(products)
  const item = visible.find((p) => p.id === id)

  if (!item) {
    return (
      <>
        <PageHero eyebrow="PRODUCTS" title="产品未找到" />
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-joy-navy/50">该产品不存在或已下架。</p>
          <Link to="/products" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-joy-blue">
            <ArrowLeft className="h-4 w-4" /> 返回产品中心
          </Link>
        </div>
      </>
    )
  }

  const catName = t(`scene.${item.scene}`)
  const idx = visible.findIndex((p) => p.id === item.id)
  const prev = idx > 0 ? visible[idx - 1] : null
  const next = idx < visible.length - 1 ? visible[idx + 1] : null

  return (
    <>
      <PageHero
        eyebrow={`PRODUCTS · ${catName}`}
        title={item.title}
        desc={item.desc}
        bg={item.cover || undefined}
      />

      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <Reveal>
          <Link to={`/products?scene=${item.scene}`} className="inline-flex items-center gap-2 text-sm text-joy-navy/50 transition-colors hover:text-joy-blue">
            <ArrowLeft className="h-4 w-4" /> 返回{catName}
          </Link>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            {item.cover && (
              <div className="img-zoom rounded-3xl shadow-lift">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="aspect-[4/3] w-full rounded-3xl object-cover"
                />
              </div>
            )}
            <div>
              <span className="rounded-full bg-joy-blue/10 px-4 py-1.5 text-[13px] font-medium text-joy-blue">
                {catName}
              </span>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-joy-navy">{item.title}</h2>
              <p className="mt-5 text-[15px] leading-[2] text-joy-navy/65">{item.desc}</p>
              {item.categories && (
                <div className="mt-7 rounded-2xl border border-joy-line bg-joy-mist/70 p-5">
                  <p className="text-xs font-medium tracking-widest text-joy-navy/40">产品类目</p>
                  <p className="mt-2 text-sm leading-relaxed text-joy-navy/70">{item.categories}</p>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {item.bodyHtml && (
          <Reveal delay={160}>
            <div
              className="prose-joya mt-12 rounded-3xl border border-joy-line bg-white p-7 shadow-soft md:p-10"
              dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
            />
          </Reveal>
        )}

        {/* 上一款 / 下一款 */}
        <div className="mt-14 flex items-center justify-between border-t border-joy-line pt-8">
          {prev ? (
            <Link to={`/products/${prev.id}`} className="group flex items-center gap-2 text-sm text-joy-navy/55 hover:text-joy-blue">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              上一款：{prev.title}
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/products/${next.id}`} className="group flex items-center gap-2 text-sm text-joy-navy/55 hover:text-joy-blue">
              下一款：{next.title}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : <span />}
        </div>
      </div>
    </>
  )
}
