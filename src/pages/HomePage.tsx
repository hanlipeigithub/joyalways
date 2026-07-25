import Hero from '@/sections/Hero'
import StatsBand from '@/sections/StatsBand'
import GlobalMap from '@/sections/GlobalMap'
import SmartFactory from '@/sections/SmartFactory'
import RndInnovation from '@/sections/RndInnovation'
import EsgSection from '@/sections/EsgSection'
import Partners from '@/sections/Partners'
import HomeNews from '@/sections/HomeNews'
import CtaBanner from '@/sections/CtaBanner'

/** 首页七幕滚动叙事 */
export default function HomePage() {
  return (
    <>
      {/* 1. Hero 视频感轮播 */}
      <Hero />
      {/* 2. 企业实力数字带 */}
      <StatsBand />
      {/* 3. 全球布局交互地图 */}
      <GlobalMap />
      {/* 4. 智能制造 */}
      <SmartFactory />
      {/* 5. 研发创新 */}
      <RndInnovation />
      {/* 6. ESG 可持续 */}
      <EsgSection />
      {/* 7. 合作客户动态墙 */}
      <Partners />
      {/* 8. 新闻中心 */}
      <HomeNews />
      {/* 合作 CTA */}
      <CtaBanner />
    </>
  )
}
