import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Download, FileText } from 'lucide-react'
import Reveal from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { useContent, visibleSorted } from '@/lib/contentStore'

export default function NoticeDetailPage() {
  const { id } = useParams()
  const { notices } = useContent()
  const visible = visibleSorted(notices)
  const item = visible.find((n) => n.id === id)

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-44 text-center">
        <h1 className="text-2xl font-semibold text-joy-navy">公告不存在或已删除</h1>
        <Link to="/notices" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-joy-blue">
          <ArrowLeft className="h-4 w-4" /> 返回公告列表
        </Link>
      </div>
    )
  }

  const idx = visible.findIndex((n) => n.id === item.id)
  const prev = idx > 0 ? visible[idx - 1] : null
  const next = idx < visible.length - 1 ? visible[idx + 1] : null

  return (
    <>
      <section className="page-hero pb-14 pt-36 md:pt-44">
        <div className="absolute inset-0 bg-grid-dark" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-6">
          <Reveal>
            <Link to="/notices" className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-joy-blue">
              <ArrowLeft className="h-4 w-4" /> 公示公告
            </Link>
            <h1 className="mt-6 text-3xl font-semibold leading-snug tracking-tight text-white md:text-4xl">
              {item.title}
            </h1>
            {item.date && (
              <div className="mt-5 font-num text-sm tracking-widest text-white/50">{item.date}</div>
            )}
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-14 md:py-16">
        {item.bodyHtml && (
          <Reveal>
            <article
              className="prose-joya mb-10 rounded-3xl border border-joy-line bg-white p-7 shadow-soft md:p-12"
              dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
            />
          </Reveal>
        )}

        {item.pdf && (
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-3xl border border-joy-line bg-white shadow-soft">
              <div className="flex items-center justify-between border-b border-joy-line bg-joy-mist/60 px-6 py-4">
                <span className="flex items-center gap-2.5 text-sm font-medium text-joy-navy">
                  <FileText className="h-4 w-4 text-joy-blue" />
                  公告附件（PDF）
                </span>
                <Button asChild variant="outline" size="sm" className="rounded-full border-joy-blue/30 text-joy-blue hover:bg-joy-blue hover:text-white">
                  <a href={item.pdf} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-1 h-3.5 w-3.5" />
                    打开 / 下载
                  </a>
                </Button>
              </div>
              <object data={item.pdf} type="application/pdf" className="h-[70vh] w-full bg-joy-mist">
                <p className="p-10 text-center text-sm text-joy-navy/50">
                  当前浏览器不支持内嵌 PDF 预览，请点击右上角「打开 / 下载」查看。
                </p>
              </object>
            </div>
          </Reveal>
        )}

        <div className="mt-12 grid gap-4 border-t border-joy-line pt-8 sm:grid-cols-2">
          {prev ? (
            <Link to={`/notices/${prev.id}`} className="group rounded-2xl border border-joy-line bg-white p-5 transition-all hover:border-joy-blue/40">
              <span className="flex items-center gap-1.5 text-xs text-joy-navy/40">
                <ArrowLeft className="h-3.5 w-3.5" /> 上一条
              </span>
              <p className="mt-2 line-clamp-1 text-sm font-medium text-joy-navy/75 group-hover:text-joy-blue">{prev.title}</p>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/notices/${next.id}`} className="group rounded-2xl border border-joy-line bg-white p-5 text-right transition-all hover:border-joy-blue/40">
              <span className="flex items-center justify-end gap-1.5 text-xs text-joy-navy/40">
                下一条 <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <p className="mt-2 line-clamp-1 text-sm font-medium text-joy-navy/75 group-hover:text-joy-blue">{next.title}</p>
            </Link>
          ) : <span />}
        </div>
      </div>
    </>
  )
}
