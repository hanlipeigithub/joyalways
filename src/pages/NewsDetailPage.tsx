import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Reveal from '@/components/Reveal'
import { useContent, visibleSorted } from '@/lib/contentStore'

export default function NewsDetailPage() {
  const { id } = useParams()
  const { news } = useContent()
  const visible = visibleSorted(news)
  const item = visible.find((n) => n.id === id)

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-44 text-center">
        <h1 className="text-2xl font-semibold text-joy-navy">新闻不存在或已删除</h1>
        <Link to="/news" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-joy-blue">
          <ArrowLeft className="h-4 w-4" /> 返回新闻列表
        </Link>
      </div>
    )
  }

  const idx = visible.findIndex((n) => n.id === item.id)
  const prev = idx > 0 ? visible[idx - 1] : null
  const next = idx < visible.length - 1 ? visible[idx + 1] : null

  return (
    <>
      {/* 文章页头 */}
      <section className="page-hero pb-14 pt-36 md:pt-44">
        <div className="absolute inset-0 bg-grid-dark" aria-hidden />
        {item.cover && (
          <>
            <img src={item.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-r from-joy-navy via-joy-navy/75 to-joy-navy/40" aria-hidden />
          </>
        )}
        <div className="relative mx-auto max-w-4xl px-6">
          <Reveal>
            <Link to="/news" className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-joy-blue">
              <ArrowLeft className="h-4 w-4" /> 新闻资讯
            </Link>
            <h1 className="mt-6 text-3xl font-semibold leading-snug tracking-tight text-white md:text-4xl">
              {item.title}
            </h1>
            <div className="mt-5 flex items-center gap-4 text-sm text-white/50">
              <span className="font-num tracking-widest">{item.date}</span>
              <span className="h-3 w-px bg-white/20" aria-hidden />
              <span>洁雅股份</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 正文 */}
      <div className="mx-auto max-w-4xl px-6 py-14 md:py-16">
        <Reveal>
          <article
            className="prose-joya rounded-3xl border border-joy-line bg-white p-7 shadow-soft md:p-12"
            dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
          />
        </Reveal>

        {/* 上一篇 / 下一篇 */}
        <div className="mt-12 grid gap-4 border-t border-joy-line pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              to={`/news/${prev.id}`}
              className="group rounded-2xl border border-joy-line bg-white p-5 transition-all hover:border-joy-blue/40 hover:shadow-soft"
            >
              <span className="flex items-center gap-1.5 text-xs text-joy-navy/40">
                <ArrowLeft className="h-3.5 w-3.5" /> 上一篇
              </span>
              <p className="mt-2 line-clamp-1 text-sm font-medium text-joy-navy/75 group-hover:text-joy-blue">{prev.title}</p>
            </Link>
          ) : <span />}
          {next ? (
            <Link
              to={`/news/${next.id}`}
              className="group rounded-2xl border border-joy-line bg-white p-5 text-right transition-all hover:border-joy-blue/40 hover:shadow-soft"
            >
              <span className="flex items-center justify-end gap-1.5 text-xs text-joy-navy/40">
                下一篇 <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <p className="mt-2 line-clamp-1 text-sm font-medium text-joy-navy/75 group-hover:text-joy-blue">{next.title}</p>
            </Link>
          ) : <span />}
        </div>
      </div>
    </>
  )
}
