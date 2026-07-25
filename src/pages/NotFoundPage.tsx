import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center">
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <div className="relative">
        <p className="font-num text-[100px] font-extralight leading-none text-joy-blue/25 md:text-[160px]">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-joy-navy">页面不存在</h1>
        <p className="mt-3 text-sm text-joy-navy/50">您访问的页面可能已被移动或删除。</p>
        <Button asChild className="mt-8 rounded-full bg-joy-blue px-8 text-white hover:bg-joy-blue-deep">
          <Link to="/">返回首页</Link>
        </Button>
      </div>
    </div>
  )
}
