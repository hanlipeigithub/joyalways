import { useState } from 'react'
import { ArrowRight, Sprout, FlaskConical, Building2, Users, ChevronDown, MapPin, Phone, Mail, ShieldCheck, Gift, HeartHandshake, Coffee, GraduationCap } from 'lucide-react'
import Reveal from '@/components/Reveal'

const BRAND_CARDS = [
  {
    icon: Sprout,
    title: '员工成长',
    en: 'GROWTH',
    desc: '完善的培养体系与晋升通道，让每一位伙伴与企业共同成长。完善的培训机制，从入职引导到专业技能提升，助力职业发展每一步。',
    gradient: 'from-emerald-600/80 to-teal-800/80',
    accent: '#10b981',
  },
  {
    icon: FlaskConical,
    title: '研发环境',
    en: 'R&D ENVIRONMENT',
    desc: '理化与微生物检验检测中心，配备一流实验仪器设备，为技术人才提供国际水平的研发平台。与国内外知名高校保持深度产学研合作。',
    gradient: 'from-blue-600/80 to-indigo-800/80',
    accent: '#3b82f6',
  },
  {
    icon: Building2,
    title: '办公环境',
    en: 'WORKPLACE',
    desc: '220,000㎡+ 现代化制造基地，GMP 级洁净车间、智能仓储与舒适办公空间，美国与埃及海外工厂提供国际化工作机会。',
    gradient: 'from-violet-600/80 to-purple-800/80',
    accent: '#8b5cf6',
  },
  {
    icon: Users,
    title: '企业文化',
    en: 'CULTURE',
    desc: '"人人皆可成才、人人尽展其才"。开放、务实、长期主义的企业氛围，信任信心、关爱尊重、共创共赢的核心价值观。',
    gradient: 'from-rose-600/80 to-pink-800/80',
    accent: '#ec4899',
  },
]

const BENEFITS = [
  { icon: ShieldCheck, label: '五险一金' },
  { icon: Gift, label: '绩效奖金' },
  { icon: Coffee, label: '用餐补贴' },
  { icon: Phone, label: '通讯补贴' },
  { icon: HeartHandshake, label: '油卡补贴' },
  { icon: GraduationCap, label: '年度体检' },
]

const JOB_LIST = [
  { title: '设备操作工', type: '生产类', location: '铜陵', desc: '负责自动化生产线的日常操作与维护，确保设备高效稳定运行。具备机械/电气基础知识者优先。', tags: ['自动化', '机械', '三班'] },
  { title: '英语专员', type: '职能类', location: '铜陵', desc: '负责海外客户沟通、英文文件翻译及国际业务对接。英语专业八级或同等水平，有外贸经验优先。', tags: ['英语', '外贸', '国际'] },
  { title: '工艺技术员', type: '技术类', location: '铜陵', desc: '负责湿巾生产工艺的优化与改进，解决生产过程中的技术问题。化工/材料相关专业。', tags: ['工艺', '化工', '现场'] },
  { title: '研发工程师', type: '研发类', location: '铜陵/上海', desc: '负责新配方、新产品的研发工作，包括配方设计、稳定性测试及工艺放大。硕士及以上学历优先。', tags: ['研发', '配方', '实验'] },
  { title: 'QC主管', type: '质量类', location: '铜陵', desc: '负责质量管理体系的运行与维护，带领团队完成来料、过程及出货检验。熟悉ISO/GMP体系。', tags: ['质量', '体系', '管理'] },
  { title: '产品设计总监', type: '研发类', location: '上海', desc: '负责产品线规划与设计策略制定，领导设计团队完成从概念到量产的全流程。', tags: ['设计', '管理', '创新'] },
  { title: '财务经理', type: '职能类', location: '铜陵', desc: '负责公司财务核算、预算管理、税务筹划及财务分析。持有CPA或中级以上职称。', tags: ['财务', '管理', 'CPA'] },
]

export default function CareersPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <>
      {/* ============ HERO: 视频背景 ============ */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        {/* 背景视频 */}
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover">
          <source src="/videos/production-line.mp4" type="video/mp4" />
        </video>
        {/* 渐变叠加 */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-slate-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-slate-900/30" />

        {/* 装饰光效 */}
        <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2" aria-hidden>
          <div className="h-72 w-72 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#3b82f6' }} />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <Reveal>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-300 backdrop-blur-md">
              JOIN US · 加入洁雅
            </span>
            <h1 className="text-4xl font-bold text-white md:text-6xl lg:text-7xl">
              与洁雅一起
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">共创未来</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
              人人皆可成才、人人尽展其才。加入洁雅股份，在全球个人护理智能制造舞台上，成就你的职业梦想。
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a href="#positions" className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/40">
                查看在招岗位
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a href="mailto:jieyahr@babywipes.com.cn" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/15">
                <Mail size={15} />
                投递简历
              </a>
            </div>
          </Reveal>
        </div>

        {/* 滚动指示 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden>
          <ChevronDown size={20} className="text-white/40" />
        </div>
      </section>

      {/* ============ 雇主品牌四卡 ============ */}
      <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#0a0e1a' }}>
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full opacity-[0.02]" style={{ backgroundColor: '#3b82f6' }} />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full opacity-[0.02]" style={{ backgroundColor: '#3b82f6' }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-blue-400">WHY JOYALWAYS</span>
              <h2 className="text-3xl font-bold text-white md:text-4xl">选择洁雅的<span className="text-blue-400">理由</span></h2>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BRAND_CARDS.map((c, i) => (
              <Reveal key={c.title} delay={i * 100}>
                <div
                  className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  style={{ backgroundColor: '#111827', border: '1px solid #1e293b' }}
                >
                  {/* 顶部装饰条 */}
                  <div className="absolute left-0 top-0 h-1 w-full transition-all duration-500 group-hover:h-1.5" style={{ backgroundColor: c.accent }} />

                  {/* 图标 */}
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                    style={{ backgroundColor: `${c.accent}20` }}
                  >
                    <c.icon className="h-6 w-6" style={{ color: c.accent }} />
                  </div>

                  <h3 className="text-lg font-semibold text-white">{c.title}</h3>
                  <span className="font-mono text-[10px] tracking-[0.3em]" style={{ color: `${c.accent}99` }}>{c.en}</span>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 在招岗位 ============ */}
      <section id="positions" className="relative py-24" style={{ backgroundColor: '#0f172a' }}>
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-blue-400">OPEN POSITIONS</span>
              <h2 className="text-3xl font-bold text-white md:text-4xl">在招<span className="text-blue-400">岗位</span></h2>
              <p className="mx-auto mt-4 max-w-xl text-sm text-gray-400">以下为洁雅股份当前热招岗位，欢迎投递简历</p>
            </div>
          </Reveal>

          <div className="space-y-4">
            {JOB_LIST.map((job, i) => (
              <Reveal key={job.title} delay={i * 60}>
                <div
                  className="group cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ backgroundColor: '#1a2332', border: '1px solid #1e293b' }}
                  onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                >
                  <div className="flex items-center justify-between p-5">
                    <div className="flex flex-1 items-center gap-4">
                      {/* 岗位类型指示器 */}
                      <div
                        className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white sm:flex"
                        style={{
                          backgroundColor:
                            job.type === '生产类' ? '#065f46' :
                            job.type === '研发类' ? '#1e40af' :
                            job.type === '质量类' ? '#7c3aed' :
                            job.type === '技术类' ? '#b45309' : '#0f766e',
                        }}
                      >
                        {job.type.slice(0, 2)}
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-white">{job.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={11} />
                            {job.location}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            {job.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 标签 + 展开按钮 */}
                    <div className="flex items-center gap-3">
                      <div className="hidden gap-1.5 md:flex">
                        {job.tags.map(tag => (
                          <span key={tag} className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ backgroundColor: '#0f172a', color: '#64748b' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <ChevronDown
                        size={16}
                        className="text-gray-500 transition-transform duration-300"
                        style={{ transform: expandedIndex === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </div>
                  </div>

                  {/* 展开详情 */}
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: expandedIndex === i ? '200px' : '0px',
                      opacity: expandedIndex === i ? 1 : 0,
                    }}
                  >
                    <div className="border-t px-5 py-4" style={{ borderColor: '#1e293b' }}>
                      <p className="text-sm leading-relaxed text-gray-400">{job.desc}</p>
                      <a
                        href={`mailto:jieyahr@babywipes.com.cn?subject=应聘${job.title}`}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                        style={{ color: '#60a5fa' }}
                        onMouseOver={e => e.currentTarget.style.color = '#93c5fd'}
                        onMouseOut={e => e.currentTarget.style.color = '#60a5fa'}
                      >
                        <Mail size={13} />
                        投递该岗位
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 公司福利 ============ */}
      <section className="relative overflow-hidden py-20" style={{ backgroundColor: '#0a0e1a' }}>
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-blue-400">BENEFITS</span>
              <h2 className="text-3xl font-bold text-white md:text-4xl">公司<span className="text-blue-400">福利</span></h2>
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-14 grid grid-cols-3 gap-4 md:grid-cols-6">
              {BENEFITS.map(({ icon: Icon, label }) => (
                <div key={label} className="group flex flex-col items-center gap-3 rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: '#111827', border: '1px solid #1e293b' }}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: '#1e293b' }}>
                    <Icon size={22} style={{ color: '#60a5fa' }} />
                  </div>
                  <span className="text-xs font-medium text-gray-300">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* 联系CTA */}
          <Reveal>
            <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', border: '1px solid #1e40af30' }}>
              <h3 className="text-xl font-bold text-white">投递简历 / 咨询岗位</h3>
              <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a href="tel:0562-2201781" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition-all hover:border-white/40 hover:text-white" style={{ backgroundColor: '#1e293b' }}>
                  <Phone size={14} />
                  人事热线：0562-2201781
                </a>
                <a href="mailto:jieyahr@babywipes.com.cn" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl" style={{ backgroundColor: '#2563eb' }}>
                  <Mail size={14} />
                  jieyahr@babywipes.com.cn
                </a>
              </div>
              <p className="mt-4 text-xs text-gray-500">铜陵洁雅生物科技股份有限公司 · 人力资源部</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
