import { useState } from 'react'
import { ArrowRight, Sprout, FlaskConical, Building2, Users, ChevronDown, MapPin, Phone, Mail, ShieldCheck, Gift, HeartHandshake, Coffee, GraduationCap } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

const BRAND_CARDS = [
  { key: 'growth', icon: Sprout, accent: '#10b981' },
  { key: 'rnd', icon: FlaskConical, accent: '#3b82f6' },
  { key: 'workplace', icon: Building2, accent: '#8b5cf6' },
  { key: 'culture', icon: Users, accent: '#ec4899' },
]

const BENEFITS = [
  { key: 'insurance', icon: ShieldCheck },
  { key: 'bonus', icon: Gift },
  { key: 'meal', icon: Coffee },
  { key: 'phone', icon: Phone },
  { key: 'fuel', icon: HeartHandshake },
  { key: 'checkup', icon: GraduationCap },
]

const JOB_LIST = [
  { key: 'equipment', type: 'production', location: 'Tongling', tags: ['Automation', 'Mechanical'] },
  { key: 'english', type: 'admin', location: 'Tongling', tags: ['English', 'Trade'] },
  { key: 'process', type: 'technical', location: 'Tongling', tags: ['Process', 'Chemical'] },
  { key: 'rnd', type: 'research', location: 'Tongling/Shanghai', tags: ['R&D', 'Formulation'] },
  { key: 'qc', type: 'quality', location: 'Tongling', tags: ['Quality', 'ISO/GMP'] },
  { key: 'design', type: 'research', location: 'Shanghai', tags: ['Design', 'Innovation'] },
  { key: 'finance', type: 'admin', location: 'Tongling', tags: ['Finance', 'CPA'] },
]

export default function CareersPage() {
  const { t, lang } = useI18n()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  function jobTitle(key: string) { return t(`careers.job.${key}`) }
  function jobDesc(key: string) { return t(`careers.job.${key}.desc`) }
  function jobTypeStyle(type: string) {
    const styles: Record<string, { bg: string; label: string }> = {
      production: { bg: '#065f46', label: lang === 'en' ? 'PR' : '生产' },
      research: { bg: '#1e40af', label: lang === 'en' ? 'RD' : '研发' },
      quality: { bg: '#7c3aed', label: lang === 'en' ? 'QC' : '质量' },
      technical: { bg: '#b45309', label: lang === 'en' ? 'TE' : '技术' },
      admin: { bg: '#0f766e', label: lang === 'en' ? 'AD' : '职能' },
    }
    return styles[type] || { bg: '#0f766e', label: type }
  }
  function benefitLabel(key: string) { return t(`careers.benefit.${key}`) }

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover">
          <source src="/videos/production-line.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-slate-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-slate-900/30" />
        <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2" aria-hidden>
          <div className="h-72 w-72 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#3b82f6' }} />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-300 backdrop-blur-md">
            {t('careers.hero.badge')}
          </span>
          <h1 className="text-4xl font-bold text-white md:text-6xl lg:text-7xl">
            {t('careers.hero.title1')}<br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{t('careers.hero.title2')}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">{t('careers.hero.desc')}</p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="#positions" className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-xl">
              {t('careers.hero.cta1')} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href="mailto:jieyahr@babywipes.com.cn" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/15">
              <Mail size={15} /> {t('careers.hero.cta2')}
            </a>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden><ChevronDown size={20} className="text-white/40" /></div>
      </section>

      {/* BRAND CARDS */}
      <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#0a0e1a' }}>
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full opacity-[0.02]" style={{ backgroundColor: '#3b82f6' }} />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full opacity-[0.02]" style={{ backgroundColor: '#3b82f6' }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-blue-400">{t('careers.why.eyebrow')}</span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">{t('careers.why.title')}<span className="text-blue-400"> {t('careers.why.title.highlight')}</span></h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BRAND_CARDS.map(c => (
              <div key={c.key} className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl" style={{ backgroundColor: '#111827', border: '1px solid #1e293b' }}>
                <div className="absolute left-0 top-0 h-1 w-full transition-all duration-500 group-hover:h-1.5" style={{ backgroundColor: c.accent }} />
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: `${c.accent}20` }}>
                  <c.icon className="h-6 w-6" style={{ color: c.accent }} />
                </div>
                <h3 className="text-lg font-semibold text-white">{t(`careers.brand.${c.key}`)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{t(`careers.brand.${c.key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POSITIONS */}
      <section id="positions" className="relative py-24" style={{ backgroundColor: '#0f172a' }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-blue-400">{t('careers.positions.eyebrow')}</span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">{t('careers.positions.title')}<span className="text-blue-400"> {t('careers.positions.title.highlight')}</span></h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-gray-400">{t('careers.positions.desc')}</p>
          </div>
          <div className="space-y-4">
            {JOB_LIST.map((job, i) => {
              const style = jobTypeStyle(job.type)
              return (
                <div key={job.key} className="group cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg" style={{ backgroundColor: '#1a2332', border: '1px solid #1e293b' }} onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}>
                  <div className="flex items-center justify-between p-5">
                    <div className="flex flex-1 items-center gap-4">
                      <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white sm:flex" style={{ backgroundColor: style.bg }}>{style.label}</div>
                      <div>
                        <h3 className="text-base font-semibold text-white">{jobTitle(job.key)}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span><MapPin size={11} className="inline mr-0.5" />{job.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden gap-1.5 md:flex">{job.tags.map(tag => <span key={tag} className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ backgroundColor: '#0f172a', color: '#64748b' }}>{tag}</span>)}</div>
                      <ChevronDown size={16} className="text-gray-500 transition-transform duration-300" style={{ transform: expandedIndex === i ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </div>
                  </div>
                  <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: expandedIndex === i ? '200px' : '0px', opacity: expandedIndex === i ? 1 : 0 }}>
                    <div className="border-t px-5 py-4" style={{ borderColor: '#1e293b' }}>
                      <p className="text-sm leading-relaxed text-gray-400">{jobDesc(job.key)}</p>
                      <a href={`mailto:jieyahr@babywipes.com.cn?subject=${lang === 'en' ? 'Application for ' : '应聘'}${jobTitle(job.key)}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: '#60a5fa' }}>{t('careers.job.apply')}</a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="relative overflow-hidden py-20" style={{ backgroundColor: '#0a0e1a' }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-blue-400">{t('careers.benefits.eyebrow')}</span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">{t('careers.benefits.title')}<span className="text-blue-400"> {t('careers.benefits.title.highlight')}</span></h2>
          </div>
          <div className="mb-14 grid grid-cols-3 gap-4 md:grid-cols-6">
            {BENEFITS.map(({ icon: Icon, key }) => (
              <div key={key} className="group flex flex-col items-center gap-3 rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: '#111827', border: '1px solid #1e293b' }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: '#1e293b' }}>
                  <Icon size={22} style={{ color: '#60a5fa' }} />
                </div>
                <span className="text-xs font-medium text-gray-300">{benefitLabel(key)}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', border: '1px solid #1e40af30' }}>
            <h3 className="text-xl font-bold text-white">{t('careers.cta.title')}</h3>
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a href="tel:0562-2201781" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition-all hover:border-white/40 hover:text-white" style={{ backgroundColor: '#1e293b' }}>
                <Phone size={14} /> {t('careers.cta.hr')}
              </a>
              <a href="mailto:jieyahr@babywipes.com.cn" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl" style={{ backgroundColor: '#2563eb' }}>
                <Mail size={14} /> {t('careers.cta.email')}
              </a>
            </div>
            <p className="mt-4 text-xs text-gray-500">{t('careers.cta.footer')}</p>
          </div>
        </div>
      </section>
    </>
  )
}
