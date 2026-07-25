import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import pagesJson from '@/data/pages.json'

interface Block {
  key: string
  html: string
}
const COOP = (pagesJson as { cooperation?: { blocks: Block[] } }).cooperation

export default function CooperationPage() {
  return (
    <>
      <PageHero
        eyebrow="COOPERATION PATTERN"
        title="合作模式"
        desc="ODM / OEM 一站式解决方案，从配方研发到量产交付，与全球品牌客户共创价值。"
      />

      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        {COOP?.blocks?.length ? (
          COOP.blocks.map((b, i) => (
            <Reveal key={b.key} delay={i * 120}>
              <div
                className={`prose-joya rounded-3xl border border-joy-line bg-white p-7 shadow-soft md:p-10 ${i > 0 ? 'mt-10' : ''}`}
                dangerouslySetInnerHTML={{ __html: b.html }}
              />
            </Reveal>
          ))
        ) : (
          <p className="py-20 text-center text-joy-navy/40">内容整理中</p>
        )}

        <Reveal delay={200}>
          <div className="mt-14 rounded-3xl bg-gradient-to-br from-joy-navy to-joy-blue-deep p-10 text-center text-white">
            <h2 className="text-2xl font-semibold">开启合作，只需一步</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
              留下您的需求，洁雅团队将在第一时间与您联系。
            </p>
            <Button asChild size="lg" className="group mt-7 rounded-full bg-white px-9 text-joy-navy hover:bg-joy-mist">
              <Link to="/contact">
                立即联系
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </>
  )
}
