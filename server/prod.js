// 生产环境服务器：静态文件 + CMS API + cninfo 代理
import { createServer, request as httpRequest } from 'node:http'
import { readFileSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { networkInterfaces } from 'node:os'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = join(ROOT, 'dist')
const PORT = parseInt(process.env.PORT || '3000', 10)
const HOST = '0.0.0.0'

// 加载 index.html 模板（SPA fallback）
let indexHtml = ''
try {
  indexHtml = readFileSync(join(DIST, 'index.html'), 'utf-8')
} catch {
  console.error('⚠  未找到 dist/index.html，请先运行 npm run build')
  process.exit(1)
}

// 导入 CMS API 处理函数（从 dev server 中间件中复用）
let apiHandle
try {
  const apiModule = await import('./api.js')
  apiHandle = apiModule.handle
  console.log('✅ API 模块加载成功')
} catch (e) {
  console.error('⚠  加载 API 模块失败:', e.message)
  apiHandle = null
}

// MIME 类型映射
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.map':  'application/json',
}

// 静态文件服务 + SPA fallback
function serveStatic(urlPath, res) {
  const clean = urlPath.split('?')[0]
  if (clean.startsWith('/api/')) return false

  let filePath = join(DIST, clean === '/' ? 'index.html' : clean)

  try {
    if (!statSync(filePath).isFile()) return false
  } catch {
    const ext = extname(clean)
    if (ext && ext !== '.html') return false
    filePath = join(DIST, 'index.html')
  }

  try {
    const ext = extname(filePath)
    const content = readFileSync(filePath)
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    res.end(content)
    return true
  } catch {
    return false
  }
}

// cninfo 代理
function proxyCninfo(req, res) {
  const proxyReq = httpRequest({
    hostname: 'www.cninfo.com.cn',
    port: 80,
    path: req.url.replace(/^\/api\/cninfo/, '/new'),
    method: req.method,
    headers: { ...req.headers, host: 'www.cninfo.com.cn' },
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers)
    proxyRes.pipe(res)
  })
  proxyReq.on('error', () => {
    res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ error: '无法连接 cninfo 服务器' }))
  })
  req.pipe(proxyReq)
}

// 获取内网 IP
function getLocalIP() {
  for (const iface of Object.values(networkInterfaces())) {
    if (!iface) continue
    for (const addr of iface) {
      if (addr.family === 'IPv4' && !addr.internal) return addr.address
    }
  }
  return '0.0.0.0'
}

// 创建 HTTP 服务器
const server = createServer(async (req, res) => {
  const url = req.url || '/'

  try {
    // 1) CMS API 路由（排除 /api/cninfo，留给 proxy）
    if (url.startsWith('/api/') && !url.startsWith('/api/cninfo') && apiHandle) {
      const handled = await apiHandle(req, res)
      if (handled !== false) return
      // handled === false: 没有匹配的 API 路由
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ error: 'API 路由未匹配' }))
      return
    }

    // 2) cninfo 代理
    if (url.startsWith('/api/cninfo')) {
      return proxyCninfo(req, res)
    }

    // 3) 静态文件（含 SPA fallback）
    if (serveStatic(url, res)) return

    // 4) 兜底 404
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end('<h1>404 Not Found</h1>')
  } catch (e) {
    console.error('❌ 请求处理出错:', url, e)
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ error: e?.message || '服务器内部错误' }))
    }
  }
})

const localIP = getLocalIP()
server.listen(PORT, HOST, () => {
  // 使用 stderr 确保日志立即输出
  process.stderr.write(`\n  ✅  洁雅股份网站已启动\n`)
  process.stderr.write(`  🌐  本地访问:   http://localhost:${PORT}\n`)
  process.stderr.write(`  🌐  内网访问:   http://${localIP}:${PORT}\n`)
  process.stderr.write(`  🔐  管理后台:   /admin  (admin / joya2024)\n`)
  process.stderr.write(`  ⏹  停止:       Ctrl+C\n\n`)
})
