import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  '洁雅股份是什么公司？',
  '公司有哪些产品？',
  '公司什么时候上市的？',
  '公司有哪些研发能力？',
  '公司产品有哪些认证？',
  '公司的发展历程',
]

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是洁雅智能助手，可以回答关于洁雅股份的任何问题。请问有什么可以帮你的？😊' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
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

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      })
      const data = await res.json()
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `❌ ${data.error}` }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，网络连接失败，请稍后再试。' }])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  function formatMessage(text: string) {
    return text.split('\n').map((line, i) => (
      <p key={i} className={line.startsWith('  ') ? 'mb-1 text-sm text-gray-300' : 'mb-2'}>
        {line.startsWith('**') && line.endsWith('**')
          ? <strong>{line.slice(2, -2)}</strong>
          : line
        }
      </p>
    ))
  }

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        style={{ backgroundColor: '#1d4ed8' }}
      >
        {open ? <X size={24} color="white" /> : <MessageCircle size={24} color="white" />}
      </button>

      {/* 聊天面板 */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-[380px] flex-col overflow-hidden rounded-2xl shadow-2xl border"
          style={{
            height: '560px',
            backgroundColor: '#111827',
            borderColor: '#374151',
          }}
        >
          {/* 标题栏 */}
          <div className="flex items-center gap-2 px-5 py-4" style={{ backgroundColor: '#1d4ed8' }}>
            <Bot size={20} color="white" />
            <span className="text-base font-semibold text-white">洁雅智能助手</span>
          </div>

          {/* 消息列表 */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3" style={{ backgroundColor: '#0f172a' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-br-sm'
                      : 'rounded-bl-sm'
                  }`}
                  style={{
                    backgroundColor: msg.role === 'user' ? '#1d4ed8' : '#1e293b',
                    color: msg.role === 'user' ? 'white' : '#e2e8f0',
                  }}
                >
                  {formatMessage(msg.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-3">
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
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="rounded-full px-3 py-1 text-xs transition-colors"
                  style={{ backgroundColor: '#1e293b', color: '#93c5fd' }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = '#334155')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = '#1e293b')}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* 输入框 */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t px-4 py-3" style={{ borderColor: '#374151', backgroundColor: '#111827' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="输入问题..."
              className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{ backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #374151' }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors disabled:opacity-40"
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
