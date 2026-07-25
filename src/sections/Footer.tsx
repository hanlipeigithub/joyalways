import { Link } from 'react-router-dom'
import { useI18n } from '@/lib/i18n'

const FRIEND_LINKS = ['深圳证券交易所', '巨潮资讯网', '中国纺织工业联合会']

export default function Footer() {
  const { t } = useI18n()

  const FOOTER_COLS = [
    {
      title: t('footer.about'),
      links: [
        { label: '公司介绍', to: '/about#pos1' },
        { label: '发展时间轴', to: '/about#timeline' },
        { label: '企业文化', to: '/about#pos2' },
        { label: '资质荣誉', to: '/about#pos3' },
        { label: '社会责任', to: '/about#pos4' },
      ],
    },
    {
      title: t('footer.products'),
      links: [
        { label: t('scene.baby-care'), to: '/products?scene=baby-care' },
        { label: t('scene.medical-care'), to: '/products?scene=medical-care' },
        { label: t('scene.home-care'), to: '/products?scene=home-care' },
        { label: t('scene.beauty-care'), to: '/products?scene=beauty-care' },
        { label: '合作模式', to: '/cooperation' },
      ],
    },
    {
      title: t('footer.rnd'),
      links: [
        { label: '研发能力', to: '/rnd#research' },
        { label: '制造能力', to: '/rnd#manufacturing' },
        { label: '质量体系', to: '/rnd#quality' },
        { label: '清真政策', to: '/rnd#halal' },
        { label: t('footer.digital'), to: '/digital' },
      ],
    },
    {
      title: t('footer.news'),
      links: [{ label: '公司资讯', to: '/news' }],
    },
    {
      title: t('footer.investor'),
      links: [
        { label: '股票信息', to: '/investor' },
        { label: '公示公告', to: '/notices' },
      ],
    },
    {
      title: t('footer.contact'),
      links: [
        { label: '联系方式', to: '/contact' },
        { label: t('footer.careers'), to: '/careers' },
      ],
    },
  ]

  return (
    <footer className="relative overflow-hidden bg-joy-navy text-white">
      <div className="absolute inset-0 bg-grid-dark opacity-60" aria-hidden />
      {/* 巨型品牌字装饰 */}
      <div
        className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-num text-[18vw] font-bold leading-none tracking-tight text-stroke-brand md:text-[200px]"
        aria-hidden
      >
        JOYALWAYS
      </div>
      <div className="hairline-shimmer relative h-px w-full" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 md:pt-20">
        {/* 上：品牌 + 六列链接 */}
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <img
              src="/joyalways-logo.png"
              alt="洁雅股份 Joyalways"
              className="h-8 w-auto"
            />
            <p className="mt-6 max-w-sm text-sm leading-[1.9] text-white/45">
              全球个人护理智能制造企业。
              <br />
              Global Personal Care Smart Manufacturer.
            </p>
            <p className="mt-6 font-num text-xs tracking-[0.3em] text-white/25">
              YOUR CLEAN LIFE GUARDIAN
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-medium text-white/85">{col.title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-[13px] text-white/40 transition-colors hover:text-joy-blue"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 中：友情链接 */}
        <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-xs text-white/35">
          <span className="text-white/50">{t('footer.friend')}</span>
          {FRIEND_LINKS.map((l) => (
            <span key={l} className="cursor-pointer transition-colors hover:text-joy-blue">
              {l}
            </span>
          ))}
        </div>

        {/* 下：版权 */}
        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6 text-[12px] leading-relaxed text-white/30 md:flex-row md:items-center md:justify-between">
          <p>Copyright ©铜陵洁雅生物科技股份有限公司 All Rights Reserved.</p>
          <p className="font-num tracking-wide">
            皖ICP备18020725号&nbsp;&nbsp;皖ICP备18020725号-2&nbsp;&nbsp;公安备案号：皖公网安备34070302000012号
          </p>
        </div>
      </div>
    </footer>
  )
}
