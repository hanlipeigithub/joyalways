import { useState, type FormEvent } from 'react'
import { MapPin, Phone, Mail, Printer, Send, Loader2, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '@/lib/i18n'

const DEPARTMENTS = [
  { key: 'overseas', phone: '0562-2201781', email: 'amanda@joyalways.com' },
  { key: 'domestic', phone: '0562-2290789', email: 'alan@joyalways.com' },
  { key: 'hr', phone: '0562-2201781', email: 'jieyahr@joyalways.com' },
  { key: 'medical', phone: '18555222899', email: 'xsq@joyalways.com' },
]

export default function ContactPage() {
  const { t, lang } = useI18n()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', message: '' })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error(lang === 'en' ? 'Please fill in all required fields.' : '请完整填写姓名、电话与留言内容')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setForm({ name: '', phone: '', message: '' })
      toast.success(lang === 'en' ? 'Message submitted. We will contact you soon.' : '留言已提交，我们会尽快与您联系')
    }, 900)
  }

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover">
          <source src="/videos/production-line.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-slate-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-slate-900/30" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2" aria-hidden>
          <div className="h-72 w-72 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#3b82f6' }} />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-300 backdrop-blur-md">
            {t('contact.hero.badge')}
          </span>
          <h1 className="text-4xl font-bold text-white md:text-6xl">
            {t('contact.hero.title1')} <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{t('contact.hero.title2')}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-300">{t('contact.hero.desc')}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="tel:0562-2201781" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white/80 backdrop-blur-sm transition-all hover:border-white/40 hover:text-white">
              <Phone size={14} /> {t('contact.hero.phone')}
            </a>
            <a href="mailto:amanda@joyalways.com" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700">
              <Mail size={14} /> {t('contact.hero.email')}
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden><ChevronDown size={20} className="text-white/40" /></div>
      </section>

      {/* MAIN */}
      <section className="relative py-20" style={{ backgroundColor: '#0a0e1a' }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* COMPANY INFO CARD */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl p-6" style={{ backgroundColor: '#111827', border: '1px solid #1e293b' }}>
                <h3 className="text-lg font-semibold text-white">{t('contact.company')}</h3>
                <p className="mt-1 text-[10px] tracking-[0.25em] text-gray-500">{t('contact.company.en')}</p>
                <div className="mt-8 space-y-5">
                  {[
                    { icon: MapPin, label: t('contact.address'), content: <p className="text-sm text-gray-300">{t('contact.address.detail')}</p> },
                    { icon: Phone, label: t('contact.hotline'), content: (
                      <div className="space-y-0.5">
                        {[['0562-2201781', lang === 'en' ? 'Export: ' : '外销：'], ['0562-2201989', lang === 'en' ? 'Domestic: ' : '内销：'], ['0562-2290789', lang === 'en' ? 'Domestic: ' : '内销：'], ['0562-2201781', lang === 'en' ? 'HR: ' : '人力资源：']].map(([num, label]) => (
                          <a key={num} href={`tel:${num}`} className="block text-sm text-gray-300 transition-colors hover:text-blue-400">{label}{num}</a>
                        ))}
                      </div>
                    )},
                    { icon: Mail, label: t('contact.email'), content: (
                      <div className="space-y-0.5">
                        {[['amanda@joyalways.com', lang === 'en' ? 'Export: ' : '外销：'], ['alan@joyalways.com', lang === 'en' ? 'Domestic: ' : '内销：'], ['jieyahr@joyalways.com', lang === 'en' ? 'HR: ' : '人事：'], ['xsq@joyalways.com', lang === 'en' ? 'Medical: ' : '医疗器械：']].map(([addr, label]) => (
                          <a key={addr} href={`mailto:${addr}`} className="block text-sm text-gray-300 transition-colors hover:text-blue-400">{label}{addr}</a>
                        ))}
                      </div>
                    )},
                    { icon: Printer, label: t('contact.fax'), content: <p className="text-sm text-gray-300">{t('contact.fax.detail')}</p> },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: '#1e293b' }}>
                        <item.icon size={16} style={{ color: '#60a5fa' }} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">{item.label}</p>
                        <div className="mt-0.5">{item.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 border-t pt-5" style={{ borderColor: '#1e293b' }}>
                  <p className="text-[10px] tracking-[0.3em] text-gray-600">YOUR CLEAN LIFE GUARDIAN</p>
                </div>
              </div>
            </div>

            {/* DEPARTMENTS + FORM */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-400">{t('contact.depts.eyebrow')}</span>
                <h2 className="mt-1.5 text-2xl font-bold text-white">{t('contact.depts.title')}<span className="text-blue-400"> {t('contact.depts.title.highlight')}</span></h2>
                <p className="mt-2 text-sm text-gray-400">{t('contact.depts.desc')}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {DEPARTMENTS.map(dept => (
                  <div key={dept.key} className="group rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ backgroundColor: '#111827', border: '1px solid #1e293b' }}>
                    <div className="mb-3 inline-flex rounded-lg px-3 py-1 text-xs font-medium" style={{ backgroundColor: '#1e293b', color: '#60a5fa' }}>{t(`contact.dept.${dept.key}`)}</div>
                    <p className="text-sm text-gray-400">{t(`contact.dept.${dept.key}.desc`)}</p>
                    <div className="mt-4 flex flex-col gap-2 border-t pt-3" style={{ borderColor: '#1e293b' }}>
                      <a href={`tel:${dept.phone}`} className="inline-flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-blue-400">
                        <Phone size={12} style={{ color: '#60a5fa' }} />{dept.phone}
                      </a>
                      <a href={`mailto:${dept.email}`} className="inline-flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-blue-400">
                        <Mail size={12} style={{ color: '#60a5fa' }} />{dept.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* FORM */}
              <div className="mt-8 rounded-2xl p-6 md:p-8" style={{ backgroundColor: '#111827', border: '1px solid #1e293b' }}>
                <h3 className="text-lg font-semibold text-white">{t('contact.form.title')}</h3>
                <p className="mt-1 text-sm text-gray-400">{t('contact.form.desc')}</p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {['name', 'phone'].map(field => (
                      <div key={field}>
                        <label className="mb-1.5 block text-xs font-medium text-gray-400">{t(`contact.form.${field}`)} <span className="text-blue-400">*</span></label>
                        <input value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                          placeholder={t(`contact.form.placeholder.${field}`)}
                          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                          style={{ backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #1e293b', caretColor: '#60a5fa' }}
                          onFocus={e => e.target.style.borderColor = '#3b82f6'}
                          onBlur={e => e.target.style.borderColor = '#1e293b'}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-400">{t('contact.form.message')} <span className="text-blue-400">*</span></label>
                    <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder={t('contact.form.placeholder.message')} rows={5}
                      className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                      style={{ backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #1e293b', caretColor: '#60a5fa' }}
                      onFocus={e => e.target.style.borderColor = '#3b82f6'}
                      onBlur={e => e.target.style.borderColor = '#1e293b'}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{t('contact.form.privacy')}</p>
                    <button type="submit" disabled={submitting}
                      className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
                      style={{ backgroundColor: '#2563eb' }}
                    >
                      {submitting ? <><Loader2 size={15} className="animate-spin" /> {lang === 'en' ? 'Sending...' : '提交中…'}</> : <><Send size={15} /> {t('contact.form.submit')}</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
