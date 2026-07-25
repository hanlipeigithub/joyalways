import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { key: 'nav.home', en: 'HOME', to: '/' },
  { key: 'nav.about', en: 'ABOUT', to: '/about' },
  { key: 'nav.products', en: 'PRODUCTS', to: '/products' },
  { key: 'nav.rnd', en: 'R&D', to: '/rnd' },
  { key: 'nav.news', en: 'NEWS', to: '/news' },
  { key: 'nav.investor', en: 'INVESTOR', to: '/investor' },
  { key: 'nav.contact', en: 'CONTACT', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { lang, setLang, t } = useI18n()

  useEffect(() => {
    // 首页：越过 Hero 后变玻璃白底；内页：滚动一点即切换
    const threshold = isHome ? window.innerHeight * 0.72 : 24
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled || !isHome
          ? 'border-b border-joy-line/80 bg-white/75 shadow-[0_8px_30px_-18px_rgba(11,37,69,0.25)] backdrop-blur-xl'
          : 'border-b border-transparent bg-gradient-to-b from-black/25 to-transparent',
      )}
    >
      {/* 股票代码细条 */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-500',
          scrolled || !isHome ? 'max-h-0' : 'max-h-8',
        )}
      >
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-6 text-[11px] tracking-wider text-white/70">
          <span className="font-num">TONGLING JOYALWAYS BIO-TECHNOLOGY CO., LTD.</span>
          <span className="font-num">
            深交所创业板 · 股票代码 <span className="font-semibold text-white">301108</span>
          </span>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/joyalways-logo.png"
            alt="洁雅股份 Joyalways"
            className="h-7 w-auto transition-all md:h-8"
          />
        </Link>

        {/* 桌面菜单 */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'group relative text-[13px] font-medium tracking-wide transition-colors',
                  scrolled || !isHome
                    ? isActive
                      ? 'text-joy-blue'
                      : 'text-joy-navy/75 hover:text-joy-blue'
                    : isActive
                      ? 'text-white'
                      : 'text-white/80 hover:text-white',
                )
              }
            >
              {t(item.key)}
              <span
                className={cn(
                  'absolute -bottom-1.5 left-0 h-px w-0 bg-gradient-to-r from-joy-blue to-joy-green transition-all duration-300 group-hover:w-full',
                )}
              />
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <span
            className={cn(
              'rounded-full border px-3 py-1 text-[11px] font-medium tracking-widest',
              scrolled || !isHome
                ? 'border-joy-blue/25 bg-joy-blue/5 text-joy-blue'
                : 'border-white/30 bg-white/10 text-white backdrop-blur-sm',
            )}
          >
            股票代码 <span className="font-num font-semibold">301108</span>
          </span>
          <button
            type="button"
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2 py-1 text-[12px] transition-colors',
              scrolled || !isHome ? 'text-joy-navy/60 hover:text-joy-blue' : 'text-white/70 hover:text-white',
            )}
            aria-label="切换语言 / Switch language"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className={lang === 'zh' ? 'font-semibold' : 'opacity-50'}>中</span>
            <span className={scrolled || !isHome ? 'text-joy-navy/25' : 'text-white/40'}>/</span>
            <span className={lang === 'en' ? 'font-semibold' : 'opacity-50'}>EN</span>
          </button>
        </div>

        {/* 移动端汉堡 */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" aria-label="打开菜单">
              <Menu className={cn('h-5 w-5', scrolled || !isHome ? 'text-joy-navy' : 'text-white')} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-white/95 backdrop-blur-xl">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <img src="/joyalways-logo.png" alt="洁雅股份" className="h-6 w-auto" />
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-joy-navy/80 transition-colors hover:bg-joy-blue/5 hover:text-joy-blue"
                >
                  {t(item.key)}
                  <span className="font-num text-[10px] tracking-widest text-joy-navy/30 group-hover:text-joy-blue/60">
                    {item.en}
                  </span>
                </Link>
              ))}
              <div className="mt-6 border-t border-joy-line pt-4 text-center text-xs text-joy-navy/50">
                股票代码 <span className="font-num font-semibold text-joy-blue">301108</span>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
