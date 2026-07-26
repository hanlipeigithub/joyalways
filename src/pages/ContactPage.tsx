import { useState, type FormEvent } from 'react'
import { MapPin, Phone, Mail, Printer, Send, Loader2, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

const CONTACT = {
  address: '安徽省铜陵市狮子山经济开发区地质大道528号',
  addressEn: '528 Geological Avenue, Shizishan Economic Development Zone, Tongling, Anhui',
  phone: [
    { label: '外销热线', number: '0562-2201781' },
    { label: '内销热线', number: '0562-2201989' },
    { label: '内销热线', number: '0562-2290789' },
    { label: '人力资源', number: '18555222899' },
  ],
  emails: [
    { label: '外销', addr: 'amanda@babywipes.com.cn' },
    { label: '内销', addr: 'alan@babywipes.com.cn' },
    { label: '人事', addr: 'jieyahr@babywipes.com.cn' },
    { label: '医疗器械', addr: 'xsq@babywipes.com.cn' },
  ],
  fax: '0562-6868001',
}

const DEPARTMENTS = [
  {
    title: '海外业务',
    desc: '国际市场拓展、OEM/ODM 海外代工合作',
    email: 'amanda@babywipes.com.cn',
    phone: '0562-2201781',
  },
  {
    title: '国内业务',
    desc: '国内市场销售、品牌合作、渠道代理',
    email: 'alan@babywipes.com.cn',
    phone: '0562-2290789',
  },
  {
    title: '人力资源',
    desc: '人才招聘、岗位咨询、员工关系',
    email: 'jieyahr@babywipes.com.cn',
    phone: '18555222899',
  },
  {
    title: '医疗器械',
    desc: '医疗器械业务合作、产品咨询',
    email: 'xsq@babywipes.com.cn',
    phone: '18555222899',
  },
]

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', message: '' })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error('请完整填写姓名、电话与留言内容')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setForm({ name: '', phone: '', message: '' })
      toast.success('留言已提交，我们会尽快与您联系')
    }, 900)
  }

  return (
    <>
      {/* ===== HERO ===== */}
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
            CONTACT US
          </span>
          <h1 className="text-4xl font-bold text-white md:text-6xl">
                联系<span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">洁雅</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-300">
            产品合作、OEM / ODM 代工咨询、投资者问询、人才加盟 —— 洁雅期待听到您的声音。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="tel:0562-2201781" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white/80 backdrop-blur-sm transition-all hover:border-white/40 hover:text-white">
              <Phone size={14} /> 0562-2201781
            </a>
            <a href="mailto:amanda@babywipes.com.cn" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700">
              <Mail size={14} /> 发送邮件
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden>
          <ChevronDown size={20} className="text-white/40" />
        </div>
      </section>

      {/* ===== 联系信息 + 部门卡片 ===== */}
      <section className="relative py-20" style={{ backgroundColor: '#0a0e1a' }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* 左侧：公司信息卡片 */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl p-6" style={{ backgroundColor: '#111827', border: '1px solid #1e293b' }}>
                <h3 className="text-lg font-semibold text-white">铜陵洁雅生物科技股份有限公司</h3>
                <p className="mt-1 text-[10px] tracking-[0.25em] text-gray-500">TONGLING JOYALWAYS BIO-TECHNOLOGY CO., LTD.</p>

                <div className="mt-8 space-y-5">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: '#1e293b' }}>
                      <MapPin size={16} style={{ color: '#60a5fa' }} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">公司地址</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-gray-300">{CONTACT.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: '#1e293b' }}>
                      <Phone size={16} style={{ color: '#60a5fa' }} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">热线电话</p>
                      <div className="mt-0.5 space-y-0.5">
                        {CONTACT.phone.map(p => (
                          <a key={p.number} href={`tel:${p.number}`} className="block text-sm text-gray-300 transition-colors hover:text-blue-400">
                            {p.label}：{p.number}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: '#1e293b' }}>
                      <Mail size={16} style={{ color: '#60a5fa' }} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">邮箱</p>
                      <div className="mt-0.5 space-y-0.5">
                        {CONTACT.emails.map(e => (
                          <a key={e.addr} href={`mailto:${e.addr}`} className="block text-sm text-gray-300 transition-colors hover:text-blue-400">
                            {e.label}：{e.addr}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: '#1e293b' }}>
                      <Printer size={16} style={{ color: '#60a5fa' }} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">传真（证券事务）</p>
                      <p className="mt-0.5 text-sm text-gray-300">{CONTACT.fax}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t pt-5" style={{ borderColor: '#1e293b' }}>
                  <p className="text-[10px] tracking-[0.3em] text-gray-600">YOUR CLEAN LIFE GUARDIAN</p>
                </div>
              </div>
            </div>

            {/* 右侧：部门卡片网格 */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-400">DEPARTMENTS</span>
                <h2 className="mt-1.5 text-2xl font-bold text-white">业务<span className="text-blue-400">对接</span></h2>
                <p className="mt-2 text-sm text-gray-400">根据您的需求选择对应的业务部门直接联系</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {DEPARTMENTS.map(dept => (
                  <div key={dept.title}
                    className="group rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    style={{ backgroundColor: '#111827', border: '1px solid #1e293b' }}
                  >
                    <div className="mb-3 inline-flex rounded-lg px-3 py-1 text-xs font-medium" style={{ backgroundColor: '#1e293b', color: '#60a5fa' }}>
                      {dept.title}
                    </div>
                    <p className="text-sm text-gray-400">{dept.desc}</p>
                    <div className="mt-4 flex flex-col gap-2 border-t pt-3" style={{ borderColor: '#1e293b' }}>
                      <a href={`tel:${dept.phone}`} className="inline-flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-blue-400">
                        <Phone size={12} style={{ color: '#60a5fa' }} />
                        {dept.phone}
                      </a>
                      <a href={`mailto:${dept.email}`} className="inline-flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-blue-400">
                        <Mail size={12} style={{ color: '#60a5fa' }} />
                        {dept.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* 留言表单 */}
              <div className="mt-8 rounded-2xl p-6 md:p-8" style={{ backgroundColor: '#111827', border: '1px solid #1e293b' }}>
                <h3 className="text-lg font-semibold text-white">在线留言</h3>
                <p className="mt-1 text-sm text-gray-400">请填写以下表单，我们会尽快回复您</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-400">
                        姓名 <span className="text-blue-400">*</span>
                      </label>
                      <input
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="您的称呼"
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                        style={{ backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #1e293b', caretColor: '#60a5fa' }}
                        onFocus={e => e.target.style.borderColor = '#3b82f6'}
                        onBlur={e => e.target.style.borderColor = '#1e293b'}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-400">
                        电话 <span className="text-blue-400">*</span>
                      </label>
                      <input
                        value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="便于我们与您联系"
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                        style={{ backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #1e293b', caretColor: '#60a5fa' }}
                        onFocus={e => e.target.style.borderColor = '#3b82f6'}
                        onBlur={e => e.target.style.borderColor = '#1e293b'}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-400">
                      留言 <span className="text-blue-400">*</span>
                    </label>
                    <textarea
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="请简述您的需求，例如：产品合作 / OEM 代工 / 投资者问询…"
                      rows={5}
                      className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                      style={{ backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #1e293b', caretColor: '#60a5fa' }}
                      onFocus={e => e.target.style.borderColor = '#3b82f6'}
                      onBlur={e => e.target.style.borderColor = '#1e293b'}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">我们承诺对您提交的信息严格保密。</p>
                    <button
                      type="submit" disabled={submitting}
                      className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
                      style={{ backgroundColor: '#2563eb' }}
                    >
                      {submitting ? <><Loader2 size={15} className="animate-spin" /> 提交中…</> : <><Send size={15} /> 提交留言</>}
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
