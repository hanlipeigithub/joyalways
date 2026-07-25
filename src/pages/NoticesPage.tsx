import { Link } from 'react-router-dom'
import { ArrowUpRight, FileText } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { useContent, visibleSorted } from '@/lib/contentStore'

export default function NoticesPage() {
  const { notices } = useContent()
  const list = visibleSorted(notices)

  return (
    <>
      <PageHero
        eyebrow="PUBLIC ANNOUNCEMENTS"
        title="公示公告"
        desc="定期报告、临时公告与公司治理相关披露文件。"
      />

      <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        {list.length === 0 ? (
          <p className="py-20 text-center text-joy-navy/40">暂无公告</p>
        ) : (
          <div className="space-y-4">
            {list.map((n, i) => (
              <Reveal key={n.id} delay={i * 80}>
                <Link
                  to={`/notices/${n.id}`}
                  className="card-lift group flex items-center gap-5 rounded-2xl border border-joy-line bg-white p-6 shadow-soft"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-joy-blue/10 text-joy-blue transition-colors group-hover:bg-joy-blue group-hover:text-white">
                    <FileText className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium text-joy-navy transition-colors group-hover:text-joy-blue">
                      {n.title}
                    </span>
                    <span className="mt-1 block text-sm text-joy-navy/45">
                      {n.summary}
                      {n.date && <span className="font-num ml-3 text-xs text-joy-navy/35">{n.date}</span>}
                    </span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-joy-navy/25 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-joy-blue" />
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
