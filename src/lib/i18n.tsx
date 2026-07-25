import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'zh' | 'en'
const LS_KEY = 'joya-lang'

/* ------------------------------------------------------------------ */
/* 字典                                                                */
/* ------------------------------------------------------------------ */

const zh = {
  'nav.home': '首页',
  'nav.about': '关于洁雅',
  'nav.products': '产品中心',
  'nav.rnd': '研发制造',
  'nav.news': '新闻资讯',
  'nav.investor': '投资者关系',
  'nav.contact': '联系我们',

  'hero.badge': '全球个人护理智能制造企业',
  'hero.title': '全球个人护理\n智能制造企业',
  'hero.sub': '洁雅，正在做改变人类生活方式的事业。以智能制造与全球视野，守护每一个日常的纯净。',
  'hero.cta1': '探索洁雅',
  'hero.cta2': '产品中心',

  'stats.founded': '公司创立',
  'stats.base': '制造基地面积',
  'stats.patents': '授权专利',
  'stats.countries': '服务国家',
  'stats.sales': '年销售额（近）',

  'sec.global.eyebrow': 'GLOBAL FOOTPRINT',
  'sec.global.title': '全球布局',
  'sec.global.desc': '从铜陵出发，产品与合作网络延伸至全球主要市场。',
  'sec.smart.eyebrow': 'SMART FACTORY',
  'sec.smart.title': '智能制造',
  'sec.smart.desc': 'SAP / MES / WMS 全流程数字化，AGV 与 AI 质检构建未来工厂。',
  'sec.smart.cta': '进入数字洁雅',
  'sec.rnd.eyebrow': 'R&D INNOVATION',
  'sec.rnd.title': '研发创新',
  'sec.rnd.desc': '二十多年的持续研发和技术积累，理化与微生物检验检测中心。',
  'sec.esg.eyebrow': 'SUSTAINABILITY',
  'sec.esg.title': 'ESG · 可持续发展',
  'sec.esg.desc': '绿色制造、节能减排、社会责任 —— 让洁净事业与环境共生。',
  'sec.partners': '全球合作伙伴',
  'sec.news.eyebrow': 'NEWS CENTER',
  'sec.news.title': '新闻中心',
  'sec.products.eyebrow': 'APPLICATION SCENES',
  'sec.products.title': '产品应用场景',
  'sec.products.desc': '以场景定义产品 —— 五大应用场景，覆盖家庭与个人的洁净所需。',

  'scene.baby-care': '婴童护理',
  'scene.medical-care': '医疗护理',
  'scene.home-care': '家庭清洁',
  'scene.pet-care': '宠物护理',
  'scene.beauty-care': '美妆护理',
  'scene.baby-care.desc': '专为婴幼儿娇嫩肌肤研制的温和配方，给宝宝最纯净的呵护。',
  'scene.medical-care.desc': '抗菌消毒与医用级护理产品，以严苛标准守护健康防线。',
  'scene.home-care.desc': '覆盖家居清洁全场景，为现代家庭精简每一份家务。',
  'scene.pet-care.desc': '宠物清洁护理方案，温和配方同样适用于家庭成员的毛发伙伴。',
  'scene.beauty-care.desc': '从卸妆到护肤的全链路美妆护理，美，源于洁净。',

  'cta.title1': '合作请填写，',
  'cta.title2': '我们会有专人和您联系',
  'cta.desc': '产品合作、OEM / ODM 代工咨询、投资者问询 —— 留下您的需求，洁雅团队将在第一时间响应。',
  'cta.button': '立即联系',

  'products.enter': '进入场景',
  'products.items': '款产品',
  'products.comingSoon': '敬请期待',
  'products.coop.title': 'OEM / ODM 合作模式',
  'products.coop.desc': '二十多年专注湿巾和化妆品生产制造，以全球客户资源与一站式采购能力，为品牌客户提供代工解决方案。',
  'products.coop.button': '了解合作模式',

  'common.viewAll': '查看全部',
  'common.learnMore': '了解更多',
  'common.readMore': '阅读全文',
  'common.back': '返回',

  'footer.about': '关于洁雅',
  'footer.products': '产品中心',
  'footer.rnd': '研发制造',
  'footer.news': '新闻资讯',
  'footer.investor': '投资者关系',
  'footer.contact': '联系我们',
  'footer.careers': '加入我们',
  'footer.digital': '数字洁雅',
  'footer.friend': '友情链接：',

  'about.timeline.eyebrow': 'MILESTONES',
  'about.timeline.title': '企业发展时间轴',
  'careers.eyebrow': 'JOIN US',
  'careers.title': '人才招聘',
  'careers.desc': '人人皆可成才、人人尽展其才。',
  'digital.eyebrow': 'DIGITAL JOYALWAYS',
  'digital.title': '数字洁雅 · AI 数字化专区',
  'digital.desc': 'AI、SAP、MES、工业互联网、数字工厂、数字孪生与 AI Agent 的能力全景。',
}

const en: Record<keyof typeof zh, string> = {
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.products': 'Products',
  'nav.rnd': 'R&D & Mfg',
  'nav.news': 'News',
  'nav.investor': 'Investors',
  'nav.contact': 'Contact',

  'hero.badge': 'Global Personal Care Smart Manufacturer',
  'hero.title': 'Global Personal Care\nSmart Manufacturer',
  'hero.sub': 'Joyalways is committed to changing the way people live — guarding everyday cleanliness with smart manufacturing and a global vision.',
  'hero.cta1': 'Explore',
  'hero.cta2': 'Products',

  'stats.founded': 'Founded',
  'stats.base': 'Manufacturing Base',
  'stats.patents': 'Patents',
  'stats.countries': 'Countries Served',
  'stats.sales': 'Annual Sales (Approx.)',

  'sec.global.eyebrow': 'GLOBAL FOOTPRINT',
  'sec.global.title': 'Global Footprint',
  'sec.global.desc': 'From Tongling to the world — our products and partnerships reach major global markets.',
  'sec.smart.eyebrow': 'SMART FACTORY',
  'sec.smart.title': 'Smart Manufacturing',
  'sec.smart.desc': 'End-to-end digitalization with SAP / MES / WMS, AGV logistics and AI-powered quality inspection.',
  'sec.smart.cta': 'Enter Digital Joyalways',
  'sec.rnd.eyebrow': 'R&D INNOVATION',
  'sec.rnd.title': 'R&D Innovation',
  'sec.rnd.desc': 'Over two decades of continuous R&D, with physicochemical & microbiological testing centers.',
  'sec.esg.eyebrow': 'SUSTAINABILITY',
  'sec.esg.title': 'ESG · Sustainability',
  'sec.esg.desc': 'Green manufacturing, energy saving and social responsibility — cleanliness in harmony with the planet.',
  'sec.partners': 'Global Partners',
  'sec.news.eyebrow': 'NEWS CENTER',
  'sec.news.title': 'News Center',
  'sec.products.eyebrow': 'APPLICATION SCENES',
  'sec.products.title': 'Application Scenes',
  'sec.products.desc': 'Products defined by scenes — five application scenes covering every cleaning need.',

  'scene.baby-care': 'Baby Care',
  'scene.medical-care': 'Medical Care',
  'scene.home-care': 'Home Care',
  'scene.pet-care': 'Pet Care',
  'scene.beauty-care': 'Beauty Care',
  'scene.baby-care.desc': 'Gentle formulas designed for delicate baby skin — the purest care for little ones.',
  'scene.medical-care.desc': 'Antibacterial and medical-grade care products guarding the frontline of health.',
  'scene.home-care.desc': 'Whole-home cleaning solutions that simplify every household chore.',
  'scene.pet-care.desc': 'Pet cleaning & care solutions, gentle enough for every furry family member.',
  'scene.beauty-care.desc': 'A full beauty-care chain from cleansing to skincare — beauty originates from cleanness.',

  'cta.title1': 'Leave your inquiry,',
  'cta.title2': 'our team will reach out',
  'cta.desc': 'Product cooperation, OEM / ODM inquiries, investor relations — our team will respond promptly.',
  'cta.button': 'Contact Us',

  'products.enter': 'Enter Scene',
  'products.items': 'Products',
  'products.comingSoon': 'Coming Soon',
  'products.coop.title': 'OEM / ODM Partnership',
  'products.coop.desc': 'Over two decades focused on wipes & cosmetics manufacturing, offering one-stop OEM solutions for global brands.',
  'products.coop.button': 'Explore Partnership',

  'common.viewAll': 'View All',
  'common.learnMore': 'Learn More',
  'common.readMore': 'Read More',
  'common.back': 'Back',

  'footer.about': 'About',
  'footer.products': 'Products',
  'footer.rnd': 'R&D & Manufacturing',
  'footer.news': 'News',
  'footer.investor': 'Investor Relations',
  'footer.contact': 'Contact',
  'footer.careers': 'Careers',
  'footer.digital': 'Digital Joyalways',
  'footer.friend': 'Friendly Links: ',

  'about.timeline.eyebrow': 'MILESTONES',
  'about.timeline.title': 'Milestones',
  'careers.eyebrow': 'JOIN US',
  'careers.title': 'Careers',
  'careers.desc': 'Everyone can grow. Everyone can shine.',
  'digital.eyebrow': 'DIGITAL JOYALWAYS',
  'digital.title': 'Digital Joyalways · AI Zone',
  'digital.desc': 'AI, SAP, MES, Industrial Internet, digital factory, digital twin and AI Agent capabilities.',
}

export type I18nKey = keyof typeof zh

const dicts: Record<Lang, Record<string, string>> = { zh, en: en as Record<string, string> }

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

interface I18nCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: I18nKey | string) => string
}

const Ctx = createContext<I18nCtx>({
  lang: 'zh',
  setLang: () => {},
  t: (k) => k,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return (localStorage.getItem(LS_KEY) as Lang) || 'zh'
    } catch {
      return 'zh'
    }
  })

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [lang])

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(LS_KEY, l)
    } catch {
      /* ignore */
    }
  }

  const t = (key: string) => dicts[lang][key] ?? dicts.zh[key] ?? key

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>
}

export function useI18n() {
  return useContext(Ctx)
}
