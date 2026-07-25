import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Lock, Plus, Pencil, Trash2, Download, RotateCcw, LogOut,
  Newspaper, FileText, Package, Database, Eye, EyeOff, Pin,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { SCENES, sceneName, refreshContent, type NewsItem, type NoticeItem, type ProductItem } from '@/lib/contentStore'
import { cn } from '@/lib/utils'

const TOKEN_KEY = 'joya-admin-token'

type Kind = 'news' | 'notices' | 'products'
type AnyItem = NewsItem | NoticeItem | ProductItem

/* ------------------------------------------------------------------ */
/* API 层                                                              */
/* ------------------------------------------------------------------ */

class AuthError extends Error {}

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem(TOKEN_KEY)
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })
  if (res.status === 401) {
    sessionStorage.removeItem(TOKEN_KEY)
    throw new AuthError('登录已过期，请重新登录')
  }
  const json = (await res.json().catch(() => ({}))) as { error?: string }
  if (!res.ok) throw new Error(json.error || `请求失败（${res.status}）`)
  return json as T
}

/* ------------------------------------------------------------------ */
/* 编辑草稿                                                            */
/* ------------------------------------------------------------------ */

interface Draft {
  id: string
  title: string
  date: string
  summary: string
  bodyHtml: string
  cover: string
  pdf: string
  category: string
  desc: string
  categories: string
  hidden: boolean
  pinned: boolean
}

const EMPTY_DRAFT: Draft = {
  id: '', title: '', date: '', summary: '', bodyHtml: '', cover: '',
  pdf: '', category: SCENES[0].key, desc: '', categories: '', hidden: false, pinned: false,
}

function toDraft(kind: Kind, item: AnyItem): Draft {
  const d: Draft = { ...EMPTY_DRAFT, ...item }
  if (kind === 'notices') d.pdf = (item as NoticeItem).pdf ?? ''
  if (kind === 'products') {
    const p = item as ProductItem
    d.category = p.scene || SCENES[0].key
    d.desc = p.desc
    d.categories = p.categories
  }
  return d
}

function draftToPayload(kind: Kind, d: Draft): Record<string, unknown> {
  const base = {
    title: d.title, date: d.date, summary: d.summary, bodyHtml: d.bodyHtml,
    cover: d.cover, pinned: d.pinned, hidden: d.hidden,
  }
  if (kind === 'notices') return { ...base, pdf: d.pdf }
  if (kind === 'products') {
    return {
      title: d.title, category: 'wipes', scene: d.category, desc: d.desc,
      categories: d.categories, cover: d.cover, bodyHtml: d.bodyHtml,
      pinned: d.pinned, hidden: d.hidden,
    }
  }
  return base
}

/* ------------------------------------------------------------------ */
/* 列表表格                                                            */
/* ------------------------------------------------------------------ */

interface ListProps {
  kind: Kind
  items: AnyItem[]
  busy: boolean
  onEdit: (item: AnyItem) => void
  onDelete: (id: string) => void
  onToggle: (id: string, field: 'hidden' | 'pinned', value: boolean) => void
}

function ContentTable({ kind, items, busy, onEdit, onDelete, onToggle }: ListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-joy-line bg-white shadow-soft">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-joy-line bg-joy-mist/70 text-left text-xs text-joy-navy/50">
            <th className="px-5 py-3.5 font-medium">标题</th>
            {kind !== 'products' && <th className="w-28 px-4 py-3.5 font-medium">日期</th>}
            {kind === 'products' && <th className="w-28 px-4 py-3.5 font-medium">应用场景</th>}
            <th className="w-20 px-4 py-3.5 text-center font-medium">置顶</th>
            <th className="w-20 px-4 py-3.5 text-center font-medium">隐藏</th>
            <th className="w-32 px-4 py-3.5 text-right font-medium">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-joy-line/60">
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="px-5 py-14 text-center text-joy-navy/40">
                {busy ? '加载中…' : '暂无内容，点击右上角「新建」添加'}
              </td>
            </tr>
          )}
          {items.map((it) => (
            <tr key={it.id} className={cn('transition-colors hover:bg-joy-mist/50', it.hidden && 'opacity-50')}>
              <td className="max-w-[320px] px-5 py-3.5">
                <span className="line-clamp-1 font-medium text-joy-navy/85">{it.title || '（无标题）'}</span>
                <span className="font-num mt-0.5 block text-[11px] text-joy-navy/30">{it.id}</span>
              </td>
              {kind !== 'products' && (
                <td className="font-num px-4 py-3.5 text-xs text-joy-navy/55">{(it as NewsItem).date || '—'}</td>
              )}
              {kind === 'products' && (
                <td className="px-4 py-3.5 text-xs text-joy-navy/55">
                  {sceneName((it as ProductItem).scene)}
                </td>
              )}
              <td className="px-4 py-3.5 text-center">
                <Switch checked={it.pinned} onCheckedChange={(v) => onToggle(it.id, 'pinned', v)} aria-label="置顶" />
              </td>
              <td className="px-4 py-3.5 text-center">
                <Switch checked={it.hidden} onCheckedChange={(v) => onToggle(it.id, 'hidden', v)} aria-label="隐藏" />
              </td>
              <td className="px-4 py-3.5 text-right">
                <div className="flex justify-end gap-1.5">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(it)} aria-label="编辑" className="h-8 w-8 text-joy-navy/60 hover:text-joy-blue">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost" size="icon" aria-label="删除" className="h-8 w-8 text-joy-navy/60 hover:text-red-500"
                    onClick={() => { if (window.confirm(`确定删除「${it.title}」吗？此操作不可恢复。`)) onDelete(it.id) }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------------- 主组件 ---------------- */

const TABS: { key: Kind | 'data'; label: string; icon: typeof Newspaper }[] = [
  { key: 'news', label: '新闻管理', icon: Newspaper },
  { key: 'notices', label: '公告管理', icon: FileText },
  { key: 'products', label: '产品管理', icon: Package },
  { key: 'data', label: '数据管理', icon: Database },
]

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null) // null = 校验中
  const [username, setUsername] = useState('')
  const [pwd, setPwd] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [tab, setTab] = useState<Kind | 'data'>('news')
  const [lists, setLists] = useState<Record<Kind, AnyItem[]>>({ news: [], notices: [], products: [] })
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)

  const handleAuthError = useCallback((e: unknown) => {
    if (e instanceof AuthError) {
      setAuthed(false)
      toast.error(e.message)
      return true
    }
    return false
  }, [])

  /* ------- 会话校验 ------- */
  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY)
    if (!token) {
      setAuthed(false)
      return
    }
    api<{ username: string }>('/api/auth/me')
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false))
  }, [])

  /* ------- 数据加载 ------- */
  const loadAll = useCallback(async () => {
    setBusy(true)
    try {
      const [news, notices, products] = await Promise.all([
        api<{ items: NewsItem[] }>('/api/admin/news'),
        api<{ items: NoticeItem[] }>('/api/admin/notices'),
        api<{ items: ProductItem[] }>('/api/admin/products'),
      ])
      setLists({ news: news.items, notices: notices.items, products: products.items })
    } catch (e) {
      if (!handleAuthError(e)) toast.error(e instanceof Error ? e.message : '加载失败')
    } finally {
      setBusy(false)
    }
  }, [handleAuthError])

  useEffect(() => {
    if (authed) loadAll()
  }, [authed, loadAll])

  /* ------- 登录页 ------- */
  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-joy-navy">
        <p className="text-sm text-white/40">正在校验登录状态…</p>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-joy-navy px-6">
        <div className="absolute inset-0 bg-grid-dark" aria-hidden />
        <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.05] p-9 backdrop-blur-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-joy-blue/15 text-joy-blue">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="mt-5 text-xl font-semibold text-white">后台管理</h1>
          <p className="mt-2 text-sm text-white/45">
            登录后管理新闻、公告与产品内容（数据保存在服务端 SQLite 数据库）。
            <br />
            演示账号：<code className="font-num rounded bg-white/10 px-1.5 py-0.5 text-joy-green">admin</code>
            {' / '}
            <code className="font-num rounded bg-white/10 px-1.5 py-0.5 text-joy-green">joya2024</code>
          </p>
          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault()
              if (!username.trim() || !pwd) {
                toast.error('请输入用户名和密码')
                return
              }
              setLoggingIn(true)
              try {
                const res = await api<{ token: string }>('/api/auth/login', {
                  method: 'POST',
                  body: JSON.stringify({ username: username.trim(), password: pwd }),
                })
                sessionStorage.setItem(TOKEN_KEY, res.token)
                setAuthed(true)
                toast.success('已进入后台管理')
              } catch (err) {
                if (!handleAuthError(err)) toast.error(err instanceof Error ? err.message : '登录失败')
              } finally {
                setLoggingIn(false)
              }
            }}
          >
            <Input
              placeholder="用户名"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 border-white/15 bg-white/10 text-white placeholder:text-white/30 focus-visible:ring-joy-blue/50"
            />
            <Input
              type="password"
              placeholder="密码"
              value={pwd}
              autoComplete="current-password"
              onChange={(e) => setPwd(e.target.value)}
              className="h-11 border-white/15 bg-white/10 text-white placeholder:text-white/30 focus-visible:ring-joy-blue/50"
            />
            <Button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded-full bg-joy-blue text-white hover:bg-joy-blue-deep"
            >
              {loggingIn ? '登录中…' : '登录'}
            </Button>
          </form>
          <Link to="/" className="mt-5 block text-center text-xs text-white/35 hover:text-joy-blue">
            返回网站首页
          </Link>
        </div>
      </div>
    )
  }

  /* ------- 数据操作 ------- */
  const currentItems = (): AnyItem[] => (tab === 'data' ? [] : lists[tab])

  const afterMutation = () => {
    refreshContent() // 同步前台缓存
  }

  const handleToggle = async (id: string, field: 'hidden' | 'pinned', value: boolean) => {
    if (tab === 'data') return
    const item = currentItems().find((it) => it.id === id)
    if (!item) return
    try {
      const payload = { ...item, [field]: value }
      const res = await api<{ item: AnyItem }>(`/api/admin/${tab}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
      setLists((l) => ({
        ...l,
        [tab]: (l[tab] as AnyItem[]).map((it) => (it.id === id ? res.item : it)),
      }))
      afterMutation()
      toast.success(value ? (field === 'pinned' ? '已置顶' : '已隐藏') : (field === 'pinned' ? '已取消置顶' : '已恢复显示'))
    } catch (e) {
      if (!handleAuthError(e)) toast.error(e instanceof Error ? e.message : '操作失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (tab === 'data') return
    try {
      await api(`/api/admin/${tab}/${id}`, { method: 'DELETE' })
      setLists((l) => ({ ...l, [tab]: (l[tab] as AnyItem[]).filter((it) => it.id !== id) }))
      afterMutation()
      toast.success('已删除')
    } catch (e) {
      if (!handleAuthError(e)) toast.error(e instanceof Error ? e.message : '删除失败')
    }
  }

  const handleSaveDraft = async () => {
    if (!editing || tab === 'data') return
    if (!editing.title.trim()) {
      toast.error('标题不能为空')
      return
    }
    const exists = currentItems().some((it) => it.id === editing.id)
    setSaving(true)
    try {
      const payload = draftToPayload(tab, editing)
      const res = exists
        ? await api<{ item: AnyItem }>(`/api/admin/${tab}/${editing.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          })
        : await api<{ item: AnyItem }>(`/api/admin/${tab}`, {
            method: 'POST',
            body: JSON.stringify(payload),
          })
      setLists((l) => ({
        ...l,
        [tab]: exists
          ? (l[tab] as AnyItem[]).map((it) => (it.id === editing.id ? res.item : it))
          : [res.item, ...(l[tab] as AnyItem[])],
      }))
      afterMutation()
      setEditing(null)
      toast.success(exists ? '已保存修改' : '已新建内容')
    } catch (e) {
      if (!handleAuthError(e)) toast.error(e instanceof Error ? e.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleExport = () => {
    const payload = { news: lists.news, notices: lists.notices, products: lists.products }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `joya-cms-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('已导出 JSON')
  }

  const handleReset = async () => {
    try {
      await api('/api/admin/reset', { method: 'POST' })
      await loadAll()
      afterMutation()
      toast.success('已恢复默认内容')
    } catch (e) {
      if (!handleAuthError(e)) toast.error(e instanceof Error ? e.message : '重置失败')
    }
  }

  const handleLogout = async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' })
    } catch {
      /* ignore */
    }
    sessionStorage.removeItem(TOKEN_KEY)
    setAuthed(false)
  }

  /* ------- 后台界面 ------- */
  return (
    <div className="min-h-screen bg-joy-mist pt-24">
      <div className="mx-auto max-w-7xl px-6 pb-20">
        {/* 顶栏 */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-joy-navy">内容管理后台</h1>
            <p className="mt-1 text-sm text-joy-navy/45">
              数据保存在服务端 SQLite 数据库（server/data/cms.db），前台页面实时读取。
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="rounded-full border-joy-line text-joy-navy/70">
              <Link to="/">
                <Eye className="mr-1.5 h-4 w-4" /> 查看前台
              </Link>
            </Button>
            <Button variant="outline" className="rounded-full border-joy-line text-joy-navy/70" onClick={handleLogout}>
              <LogOut className="mr-1.5 h-4 w-4" /> 退出
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* 左侧导航 */}
          <nav className="flex gap-2 overflow-x-auto lg:flex-col">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  'flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                  tab === t.key
                    ? 'bg-joy-blue text-white shadow-[0_10px_24px_-10px_rgba(15,163,227,0.6)]'
                    : 'bg-white text-joy-navy/65 hover:bg-joy-blue/5 hover:text-joy-blue',
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.key !== 'data' && (
                  <span className={cn('font-num ml-auto text-xs', tab === t.key ? 'text-white/70' : 'text-joy-navy/30')}>
                    {lists[t.key].length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* 主区域 */}
          <div>
            {tab !== 'data' ? (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-joy-navy/50">
                    共 {currentItems().length} 条 ·
                    <Pin className="mx-1 inline h-3.5 w-3.5 text-joy-blue" /> 置顶优先展示 ·
                    <EyeOff className="mx-1 inline h-3.5 w-3.5 text-joy-navy/40" /> 隐藏后前台不可见
                  </p>
                  <Button
                    className="rounded-full bg-joy-blue text-white hover:bg-joy-blue-deep"
                    onClick={() => setEditing({ ...EMPTY_DRAFT, id: `new-${Date.now().toString(36)}` })}
                  >
                    <Plus className="mr-1 h-4 w-4" /> 新建
                  </Button>
                </div>
                <ContentTable
                  kind={tab}
                  items={currentItems()}
                  busy={busy}
                  onEdit={(it) => setEditing(toDraft(tab, it))}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              </>
            ) : (
              /* 数据管理 */
              <div className="space-y-6">
                <div className="rounded-2xl border border-joy-line bg-white p-7 shadow-soft">
                  <h3 className="font-semibold text-joy-navy">导出全部内容</h3>
                  <p className="mt-1.5 text-sm text-joy-navy/50">将当前数据库中的全部新闻 / 公告 / 产品数据导出为 JSON 文件备份。</p>
                  <Button onClick={handleExport} className="mt-4 rounded-full bg-joy-blue text-white hover:bg-joy-blue-deep">
                    <Download className="mr-1.5 h-4 w-4" /> 导出 JSON
                  </Button>
                </div>
                <div className="rounded-2xl border border-red-100 bg-white p-7 shadow-soft">
                  <h3 className="font-semibold text-red-500">恢复默认</h3>
                  <p className="mt-1.5 text-sm text-joy-navy/50">
                    从网站抓取的种子数据重建全部内容（覆盖数据库当前内容），此操作不可撤销。
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 rounded-full border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => {
                      if (window.confirm('确定恢复默认内容吗？数据库中的全部改动将丢失。')) handleReset()
                    }}
                  >
                    <RotateCcw className="mr-1.5 h-4 w-4" /> 恢复默认
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 编辑对话框 */}
      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing && currentItems().some((it) => it.id === editing.id) ? '编辑内容' : '新建内容'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-5 py-2">
              <div className="space-y-2">
                <Label>标题 *</Label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>

              {tab !== 'products' && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>日期（YYYY-MM-DD）</Label>
                    <Input value={editing.date} placeholder="2025-01-01"
                      onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>封面图路径</Label>
                    <Input value={editing.cover} placeholder="/assets/site/..."
                      onChange={(e) => setEditing({ ...editing, cover: e.target.value })} />
                  </div>
                </div>
              )}

              {tab === 'products' && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>应用场景</Label>
                    <select
                      value={editing.category}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                      className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                    >
                      {SCENES.map((s) => (
                        <option key={s.key} value={s.key}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>封面图路径</Label>
                    <Input value={editing.cover} placeholder="/assets/site/..."
                      onChange={(e) => setEditing({ ...editing, cover: e.target.value })} />
                  </div>
                </div>
              )}

              {tab === 'products' && (
                <>
                  <div className="space-y-2">
                    <Label>产品简述</Label>
                    <Textarea rows={2} value={editing.desc}
                      onChange={(e) => setEditing({ ...editing, desc: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>产品类目</Label>
                    <Input value={editing.categories} placeholder="如：婴儿手口湿巾 / 婴儿卫生湿巾等"
                      onChange={(e) => setEditing({ ...editing, categories: e.target.value })} />
                  </div>
                </>
              )}

              {tab === 'notices' && (
                <div className="space-y-2">
                  <Label>PDF 附件路径 / 链接</Label>
                  <Input value={editing.pdf} placeholder="/assets/site/couch/uploads/file/xxx.pdf"
                    onChange={(e) => setEditing({ ...editing, pdf: e.target.value })} />
                </div>
              )}

              {tab !== 'products' && (
                <div className="space-y-2">
                  <Label>摘要</Label>
                  <Textarea rows={2} value={editing.summary}
                    onChange={(e) => setEditing({ ...editing, summary: e.target.value })} />
                </div>
              )}

              <div className="space-y-2">
                <Label>正文 HTML</Label>
                <Textarea rows={8} value={editing.bodyHtml} placeholder="<p>正文内容…</p>"
                  className="font-num text-[13px]"
                  onChange={(e) => setEditing({ ...editing, bodyHtml: e.target.value })} />
              </div>

              <div className="flex items-center gap-8">
                <label className="flex items-center gap-2.5 text-sm text-joy-navy/70">
                  <Switch checked={editing.pinned} onCheckedChange={(v) => setEditing({ ...editing, pinned: v })} />
                  置顶
                </label>
                <label className="flex items-center gap-2.5 text-sm text-joy-navy/70">
                  <Switch checked={editing.hidden} onCheckedChange={(v) => setEditing({ ...editing, hidden: v })} />
                  隐藏（前台不可见）
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>取消</Button>
            <Button onClick={handleSaveDraft} disabled={saving} className="bg-joy-blue text-white hover:bg-joy-blue-deep">
              {saving ? '保存中…' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
