import { useState, type FormEvent } from 'react'
import { MapPin, Phone, Mail, Printer, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import pagesJson from '@/data/pages.json'

interface ContactInfo {
  address: string
  hotlines: string[]
  emails: string[]
  fax: string
}
const CONTACT = (pagesJson as { _contact?: ContactInfo })._contact ?? {
  address: '安徽省铜陵市狮子山经济开发区地质大道528号',
  hotlines: ['0562-2201989', '0562-2201781'],
  emails: ['amanda@babywipes.com.cn'],
  fax: '0562-6868001',
}

const HOTLINE_LABELS = ['外销热线', '内销热线', '内销热线', '人力资源热线']

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
    window.setTimeout(() => {
      setSubmitting(false)
      setForm({ name: '', phone: '', message: '' })
      toast.success('留言已提交，我们会尽快与您联系', {
        description: '感谢您的信任 —— Your Clean Life Guardian',
      })
    }, 900)
  }

  return (
    <>
      <PageHero
        eyebrow="CONTACT US"
        title="联系我们"
        desc="产品合作、OEM / ODM 代工咨询、投资者问询 —— 洁雅期待听到您的声音。"
      />

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* 真实联系信息 */}
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-3xl border border-joy-line bg-white p-9 shadow-soft">
              <h3 className="text-xl font-semibold text-joy-navy">铜陵洁雅生物科技股份有限公司</h3>
              <p className="mt-1 font-num text-[11px] tracking-[0.25em] text-joy-navy/35">
                TONGLING JOYALWAYS BIO-TECHNOLOGY CO., LTD.
              </p>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-joy-blue/10 text-joy-blue">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-joy-navy">公司地址</p>
                    <p className="mt-1 text-sm leading-relaxed text-joy-navy/60">{CONTACT.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-joy-blue/10 text-joy-blue">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-joy-navy">热线电话</p>
                    <div className="mt-1 space-y-1">
                      {CONTACT.hotlines.map((h, i) => (
                        <p key={h} className="text-sm text-joy-navy/60">
                          {HOTLINE_LABELS[i] ?? '热线'}：<span className="font-num">{h}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-joy-blue/10 text-joy-blue">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-joy-navy">邮箱</p>
                    <div className="mt-1 space-y-1">
                      {CONTACT.emails.map((m) => (
                        <p key={m} className="font-num text-sm text-joy-navy/60">{m}</p>
                      ))}
                    </div>
                  </div>
                </div>
                {CONTACT.fax && (
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-joy-blue/10 text-joy-blue">
                      <Printer className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-joy-navy">传真（证券事务）</p>
                      <p className="font-num mt-1 text-sm text-joy-navy/60">{CONTACT.fax}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-10 border-t border-joy-line pt-6">
                <p className="font-num text-xs tracking-[0.3em] text-joy-navy/30">YOUR CLEAN LIFE GUARDIAN</p>
              </div>
            </div>
          </Reveal>

          {/* 留言表单 */}
          <Reveal delay={150} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="rounded-3xl border border-joy-line bg-white p-9 shadow-soft">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="text-joy-navy/70">
                    姓名 <span className="text-joy-blue">*</span>
                  </Label>
                  <Input
                    id="contact-name"
                    placeholder="您的称呼"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-11 border-joy-line bg-joy-mist/60 focus-visible:ring-joy-blue/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone" className="text-joy-navy/70">
                    电话 <span className="text-joy-blue">*</span>
                  </Label>
                  <Input
                    id="contact-phone"
                    placeholder="便于我们与您联系"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="h-11 border-joy-line bg-joy-mist/60 focus-visible:ring-joy-blue/40"
                  />
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <Label htmlFor="contact-message" className="text-joy-navy/70">
                  留言 <span className="text-joy-blue">*</span>
                </Label>
                <Textarea
                  id="contact-message"
                  placeholder="请简述您的需求，例如：产品合作 / OEM 代工 / 投资者问询…"
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="resize-none border-joy-line bg-joy-mist/60 focus-visible:ring-joy-blue/40"
                />
              </div>
              <div className="mt-8 flex items-center justify-between">
                <p className="text-xs text-joy-navy/40">我们承诺对您提交的信息严格保密。</p>
                <Button type="submit" disabled={submitting} className="rounded-full bg-joy-blue px-7 text-white hover:bg-joy-blue-deep">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      提交中…
                    </>
                  ) : (
                    <>
                      提交留言
                      <Send className="ml-1.5 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </>
  )
}
