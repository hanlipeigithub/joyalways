import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, X } from 'lucide-react'
import Robot3D from './Robot3D'

interface Message { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  '洁雅股份是什么公司？', '公司有哪些产品？', '公司什么时候上市的？',
  '公司有哪些研发能力？', '公司产品有哪些认证？', '公司的发展历程',
]

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是小雅🤗 洁雅股份的智能助手，很高兴为你服务！关于公司、产品、研发、新闻等问题都可以问我哦~' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [pulse, setPulse] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 脉冲光环动画
  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 1500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 400)
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function sendMessage(question: string) {
    if (!question.trim() || loading) return
    const q = question.trim()
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setInput('')
    setLoading(true)
    setSpeaking(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.error ? `抱歉，${data.error}😅` : data.answer }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '哎呀，网络好像有点问题，请稍后再试哦~😅' }])
    } finally {
      setLoading(false)
      setTimeout(() => setSpeaking(false), 500)
    }
  }

  function handleSubmit(e: React.FormEvent) { e.preventDefault(); sendMessage(input) }

  return (
    <>
      {/* ===== 浮动按钮：带脉冲光环 + 漂浮动画的3D机器人 ===== */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 transition-all duration-300 hover:scale-110 cursor-pointer"
          style={{
            width: 100,
            height: 100,
            background: 'none',
            border: 'none',
            padding: 0,
            animation: 'chatbot-float 3s ease-in-out infinite',
            filter: `drop-shadow(0 0 ${pulse ? 25 : 10}px rgba(59,130,246,${pulse ? 0.6 : 0.3}))`,
          }}
        >
          {/* 脉冲光环层 */}
          <div
            className="absolute inset-0 rounded-full transition-all duration-1000"
            style={{
              boxShadow: pulse
                ? `0 0 30px 8px rgba(59,130,246,0.3), 0 0 60px 16px rgba(59,130,246,0.1)`
                : `0 0 15px 4px rgba(59,130,246,0.15), 0 0 30px 8px rgba(59,130,246,0.05)`,
            }}
          />
          <Robot3D speaking={speaking} size={100} />
        </button>
      )}

      {/* ===== 聊天面板 ===== */}
      {open && (
        <div
          className="fixed bottom-0 right-0 z-50 flex flex-col shadow-2xl"
          style={{ width: 420, height: '100vh', backgroundColor: '#111827', borderLeft: '1px solid #374151' }}
        >
          {/* 顶部：大号3D机器人 + 呼吸光环 */}
          <div
            className="relative flex flex-col items-center justify-center overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #0f172a 0%, #0a0e1a 100%)',
              paddingTop: 24,
              paddingBottom: 12,
              minHeight: 220,
            }}
          >
            {/* 背景光晕 */}
            <div
              className="absolute rounded-full transition-all duration-2000"
              style={{
                width: 200,
                height: 200,
                background: `radial-gradient(circle, rgba(59,130,246,${pulse ? 0.15 : 0.06}) 0%, transparent 70%)`,
              }}
            />

            {/* 关闭 */}
            <button onClick={() => setOpen(false)} className="absolute top-3 right-3 z-10 flex items-center justify-center rounded-full transition-colors hover:bg-white/10" style={{ width: 32, height: 32 }}>
              <X size={18} color="#94a3b8" />
            </button>

            {/* 3D机器人 */}
            <div className="relative" style={{ width: 160, height: 170 }}>
              <Robot3D speaking={speaking} size={160} />
            </div>

            {/* 名称 */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-white">小雅</span>
              <span className="rounded-full bg-blue-600/30 px-2.5 py-0.5 text-xs text-blue-300 border border-blue-500/30">3D AI</span>
            </div>
            <span className="text-xs text-gray-400 mt-0.5">洁雅股份智能助理 · 问我任何问题</span>
          </div>

          {/* 消息列表 */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3" style={{ backgroundColor: '#0f172a' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`mb-4 flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'assistant' && (
                  <div className="mt-0.5 shrink-0" style={{ width: 36, height: 36 }}>
                    <Robot3D size={36} />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                  style={{
                    backgroundColor: msg.role === 'user' ? '#1d4ed8' : '#1e293b',
                    color: msg.role === 'user' ? 'white' : '#e2e8f0',
                  }}
                >
                  {msg.content.split('\n').map((line, j) => <p key={j} className="mb-1.5 last:mb-0">{line}</p>)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="mb-4 flex items-start gap-2.5">
                <div style={{ width: 36, height: 36 }}><Robot3D speaking size={36} /></div>
                <div className="rounded-2xl rounded-bl-sm px-4 py-3" style={{ backgroundColor: '#1e293b' }}>
                  <Loader2 size={18} className="animate-spin" style={{ color: '#60a5fa' }} />
                </div>
              </div>
            )}
          </div>

          {/* 快捷问题 */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 px-4 py-2 border-t" style={{ borderColor: '#374151', backgroundColor: '#0f172a' }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="rounded-full px-3 py-1.5 text-xs transition-colors hover:bg-slate-700"
                  style={{ backgroundColor: '#1e293b', color: '#93c5fd' }}
                >{s}</button>
              ))}
            </div>
          )}

          {/* 输入框 */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t px-4 py-3" style={{ borderColor: '#374151', backgroundColor: '#111827' }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              placeholder="问小雅一个问题..."
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #374151' }}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors disabled:opacity-40 hover:bg-blue-700"
              style={{ backgroundColor: '#1d4ed8' }}
            >
              <Send size={16} color="white" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
