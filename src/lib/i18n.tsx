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

  /* ---- 招聘页 Careers ---- */
  'careers.hero.badge': 'JOIN US · 加入洁雅',
  'careers.hero.title1': '与洁雅一起',
  'careers.hero.title2': '共创未来',
  'careers.hero.desc': '人人皆可成才、人人尽展其才。加入洁雅股份，在全球个人护理智能制造舞台上，成就你的职业梦想。',
  'careers.hero.cta1': '查看在招岗位',
  'careers.hero.cta2': '投递简历',

  'careers.why.eyebrow': 'WHY JOYALWAYS',
  'careers.why.title': '选择洁雅的',
  'careers.why.title.highlight': '理由',

  'careers.brand.growth': '员工成长',
  'careers.brand.growth.desc': '完善的培养体系与晋升通道，让每一位伙伴与企业共同成长。完善的培训机制，从入职引导到专业技能提升，助力职业发展每一步。',
  'careers.brand.rnd': '研发环境',
  'careers.brand.rnd.desc': '理化与微生物检验检测中心，配备一流实验仪器设备，为技术人才提供国际水平的研发平台。与国内外知名高校保持深度产学研合作。',
  'careers.brand.workplace': '办公环境',
  'careers.brand.workplace.desc': '220,000㎡+ 现代化制造基地，GMP 级洁净车间、智能仓储与舒适办公空间，美国与埃及海外工厂提供国际化工作机会。',
  'careers.brand.culture': '企业文化',
  'careers.brand.culture.desc': '"人人皆可成才、人人尽展其才"。开放、务实、长期主义的企业氛围，信任信心、关爱尊重、共创共赢的核心价值观。',

  'careers.positions.eyebrow': 'OPEN POSITIONS',
  'careers.positions.title': '在招',
  'careers.positions.title.highlight': '岗位',
  'careers.positions.desc': '以下为洁雅股份当前热招岗位，欢迎投递简历',

  'careers.job.equipment': '设备操作工',
  'careers.job.equipment.desc': '负责自动化生产线的日常操作与维护，确保设备高效稳定运行。具备机械/电气基础知识者优先。',
  'careers.job.english': '英语专员',
  'careers.job.english.desc': '负责海外客户沟通、英文文件翻译及国际业务对接。英语专业八级或同等水平，有外贸经验优先。',
  'careers.job.process': '工艺技术员',
  'careers.job.process.desc': '负责湿巾生产工艺的优化与改进，解决生产过程中的技术问题。化工/材料相关专业。',
  'careers.job.rnd': '研发工程师',
  'careers.job.rnd.desc': '负责新配方、新产品的研发工作，包括配方设计、稳定性测试及工艺放大。硕士及以上学历优先。',
  'careers.job.qc': 'QC主管',
  'careers.job.qc.desc': '负责质量管理体系的运行与维护，带领团队完成来料、过程及出货检验。熟悉ISO/GMP体系。',
  'careers.job.design': '产品设计总监',
  'careers.job.design.desc': '负责产品线规划与设计策略制定，领导设计团队完成从概念到量产的全流程。',
  'careers.job.finance': '财务经理',
  'careers.job.finance.desc': '负责公司财务核算、预算管理、税务筹划及财务分析。持有CPA或中级以上职称。',
  'careers.job.apply': '投递该岗位',

  'careers.benefits.eyebrow': 'BENEFITS',
  'careers.benefits.title': '公司',
  'careers.benefits.title.highlight': '福利',

  'careers.benefit.insurance': '五险一金',
  'careers.benefit.bonus': '绩效奖金',
  'careers.benefit.meal': '用餐补贴',
  'careers.benefit.phone': '通讯补贴',
  'careers.benefit.fuel': '油卡补贴',
  'careers.benefit.checkup': '年度体检',

  'careers.cta.title': '投递简历 / 咨询岗位',
  'careers.cta.hr': '人事热线：0562-2201781',
  'careers.cta.email': 'jieyahr@babywipes.com.cn',
  'careers.cta.footer': '铜陵洁雅生物科技股份有限公司 · 人力资源部',

  /* ---- 联系页 Contact ---- */
  'contact.hero.badge': 'CONTACT US',
  'contact.hero.title1': '联系',
  'contact.hero.title2': '洁雅',
  'contact.hero.desc': '产品合作、OEM / ODM 代工咨询、投资者问询、人才加盟 —— 洁雅期待听到您的声音。',
  'contact.hero.phone': '0562-2201781',
  'contact.hero.email': '发送邮件',

  'contact.company': '铜陵洁雅生物科技股份有限公司',
  'contact.company.en': 'TONGLING JOYALWAYS BIO-TECHNOLOGY CO., LTD.',

  'contact.address': '公司地址',
  'contact.address.detail': '安徽省铜陵市狮子山经济开发区地质大道528号',
  'contact.hotline': '热线电话',
  'contact.email': '邮箱',
  'contact.fax': '传真（证券事务）',
  'contact.fax.detail': '0562-6868001',

  'contact.dept.overseas': '海外业务',
  'contact.dept.overseas.desc': '国际市场拓展、OEM/ODM 海外代工合作',
  'contact.dept.domestic': '国内业务',
  'contact.dept.domestic.desc': '国内市场销售、品牌合作、渠道代理',
  'contact.dept.hr': '人力资源',
  'contact.dept.hr.desc': '人才招聘、岗位咨询、员工关系',
  'contact.dept.medical': '医疗器械',
  'contact.dept.medical.desc': '医疗器械业务合作、产品咨询',

  'contact.depts.eyebrow': 'DEPARTMENTS',
  'contact.depts.title': '业务',
  'contact.depts.title.highlight': '对接',
  'contact.depts.desc': '根据您的需求选择对应的业务部门直接联系',

  'contact.form.title': '在线留言',
  'contact.form.desc': '请填写以下表单，我们会尽快回复您',
  'contact.form.name': '姓名',
  'contact.form.phone': '电话',
  'contact.form.message': '留言',
  'contact.form.placeholder.name': '您的称呼',
  'contact.form.placeholder.phone': '便于我们与您联系',
  'contact.form.placeholder.message': '请简述您的需求，例如：产品合作 / OEM 代工 / 投资者问询…',
  'contact.form.privacy': '我们承诺对您提交的信息严格保密。',
  'contact.form.submit': '提交留言',

  /* ---- ESG 可持续发展 ---- */
  'esg.green.title': '绿色制造',
  'esg.green.desc': '以清洁能源与绿色工艺打造洁净产品，FSC 认证材料与可持续供应链并行。',
  'esg.energy.title': '节能减排',
  'esg.energy.desc': '持续优化产线能耗与废弃物管理，让每一分资源都物尽其用。',
  'esg.social.title': '社会责任',
  'esg.social.desc': '回馈社区、关爱员工，以企业公民的责任心践行长期主义。',

  /* ---- 服务国家/年销售额等 ---- */
  'stats.years': '年',
  'stats.sqm': '㎡+',
  'stats.items': '项+',
  'stats.billion': '亿',
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

  /* ---- 招聘页 Careers ---- */
  'careers.hero.badge': 'JOIN US',
  'careers.hero.title1': 'Shape the Future',
  'careers.hero.title2': 'with Joyalways',
  'careers.hero.desc': 'Everyone can grow. Everyone can shine. Join Joyalways and build your career on the global stage of personal care smart manufacturing.',
  'careers.hero.cta1': 'View Openings',
  'careers.hero.cta2': 'Submit Resume',

  'careers.why.eyebrow': 'WHY JOYALWAYS',
  'careers.why.title': 'Reasons to Choose',
  'careers.why.title.highlight': 'Joyalways',

  'careers.brand.growth': 'Growth',
  'careers.brand.growth.desc': 'A comprehensive training system and clear promotion pathways — every member grows together with the company.',
  'careers.brand.rnd': 'R&D Environment',
  'careers.brand.rnd.desc': 'State-of-the-art physicochemical & microbiological labs, providing world-class R&D platforms for technical talent.',
  'careers.brand.workplace': 'Workplace',
  'careers.brand.workplace.desc': '220,000㎡+ modern manufacturing base with GMP cleanrooms, smart warehouses, and overseas opportunities in the US and Egypt.',
  'careers.brand.culture': 'Culture',
  'careers.brand.culture.desc': '"Everyone can grow, everyone can shine." Open, pragmatic, long-term oriented — built on trust, respect and shared success.',

  'careers.positions.eyebrow': 'OPEN POSITIONS',
  'careers.positions.title': 'Open',
  'careers.positions.title.highlight': 'Positions',
  'careers.positions.desc': 'Current openings at Joyalways. We look forward to your application.',

  'careers.job.equipment': 'Equipment Operator',
  'careers.job.equipment.desc': 'Responsible for daily operation and maintenance of automated production lines. Mechanical/electrical knowledge preferred.',
  'careers.job.english': 'English Specialist',
  'careers.job.english.desc': 'Handles overseas client communication, document translation, and international business coordination. TEM-8 or equivalent required.',
  'careers.job.process': 'Process Technician',
  'careers.job.process.desc': 'Optimizes wet wipe production processes and resolves technical issues on the production floor. Chemistry/materials background preferred.',
  'careers.job.rnd': 'R&D Engineer',
  'careers.job.rnd.desc': 'Develops new formulations and products — from formula design and stability testing to process scale-up. Master\'s degree preferred.',
  'careers.job.qc': 'QC Supervisor',
  'careers.job.qc.desc': 'Manages the quality management system and leads the team in incoming, in-process and final inspections. Familiar with ISO/GMP systems.',
  'careers.job.design': 'Product Design Director',
  'careers.job.design.desc': 'Leads product line planning and design strategy, managing the team from concept through mass production.',
  'careers.job.finance': 'Finance Manager',
  'careers.job.finance.desc': 'Oversees financial accounting, budget management, tax planning and financial analysis. CPA or intermediate certification required.',
  'careers.job.apply': 'Apply for this position',

  'careers.benefits.eyebrow': 'BENEFITS',
  'careers.benefits.title': 'Benefits &',
  'careers.benefits.title.highlight': 'Perks',

  'careers.benefit.insurance': 'Social Insurance',
  'careers.benefit.bonus': 'Performance Bonus',
  'careers.benefit.meal': 'Meal Allowance',
  'careers.benefit.phone': 'Phone Subsidy',
  'careers.benefit.fuel': 'Fuel Allowance',
  'careers.benefit.checkup': 'Annual Checkup',

  'careers.cta.title': 'Submit Your Resume / Inquire About Positions',
  'careers.cta.hr': 'HR Hotline: 0562-2201781',
  'careers.cta.email': 'jieyahr@babywipes.com.cn',
  'careers.cta.footer': 'Tongling Joyalways Biologic Technology Co., Ltd. · HR Department',

  /* ---- 联系页 Contact ---- */
  'contact.hero.badge': 'CONTACT US',
  'contact.hero.title1': 'Contact',
  'contact.hero.title2': 'Joyalways',
  'contact.hero.desc': 'Product cooperation, OEM/ODM inquiries, investor relations, talent recruitment — we look forward to hearing from you.',
  'contact.hero.phone': '0562-2201781',
  'contact.hero.email': 'Send Email',

  'contact.company': 'Tongling Joyalways Biologic Technology Co., Ltd.',
  'contact.company.en': 'TONGLING JOYALWAYS BIO-TECHNOLOGY CO., LTD.',

  'contact.address': 'Company Address',
  'contact.address.detail': '528 Geological Avenue, Shizishan Economic Development Zone, Tongling, Anhui, China',
  'contact.hotline': 'Hotline',
  'contact.email': 'Email',
  'contact.fax': 'Fax (Securities Affairs)',
  'contact.fax.detail': '0562-6868001',

  'contact.dept.overseas': 'Overseas Business',
  'contact.dept.overseas.desc': 'International market expansion, OEM/ODM overseas cooperation',
  'contact.dept.domestic': 'Domestic Business',
  'contact.dept.domestic.desc': 'Domestic sales, brand partnerships, channel distribution',
  'contact.dept.hr': 'Human Resources',
  'contact.dept.hr.desc': 'Talent recruitment, career inquiries, employee relations',
  'contact.dept.medical': 'Medical Devices',
  'contact.dept.medical.desc': 'Medical device business cooperation, product inquiries',

  'contact.depts.eyebrow': 'DEPARTMENTS',
  'contact.depts.title': 'Contact by',
  'contact.depts.title.highlight': 'Department',
  'contact.depts.desc': 'Select the department that matches your needs and contact them directly.',

  'contact.form.title': 'Online Inquiry',
  'contact.form.desc': 'Fill out the form below and we will get back to you as soon as possible.',
  'contact.form.name': 'Name',
  'contact.form.phone': 'Phone',
  'contact.form.message': 'Message',
  'contact.form.placeholder.name': 'Your name',
  'contact.form.placeholder.phone': 'For us to reach you',
  'contact.form.placeholder.message': 'Briefly describe your needs, e.g. product cooperation, OEM, investor inquiry...',
  'contact.form.privacy': 'We keep your information strictly confidential.',
  'contact.form.submit': 'Submit',

  /* ---- ESG 可持续发展 ---- */
  'esg.green.title': 'Green Manufacturing',
  'esg.green.desc': 'Clean energy and green processes for premium products, with FSC-certified materials and sustainable supply chains.',
  'esg.energy.title': 'Energy & Emission',
  'esg.energy.desc': 'Continuously optimizing production energy consumption and waste management — making the most of every resource.',
  'esg.social.title': 'Social Responsibility',
  'esg.social.desc': 'Giving back to the community, caring for employees, and practicing long-termism with corporate citizenship.',

  /* ---- 服务国家/年销售额等 ---- */
  'stats.years': 'Years',
  'stats.sqm': 'm²+',
  'stats.items': '+',
  'stats.billion': 'Billion',
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
