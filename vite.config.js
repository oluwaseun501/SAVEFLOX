import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

const audioProxyPlugin = {
  name: 'audio-proxy',
  configureServer(server) {
    server.middlewares.use('/proxy-audio', async (req, res) => {
      const params = new URLSearchParams(req.url.replace(/^.*\?/, ''))
      const targetUrl = params.get('url')

      if (!targetUrl) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ error: 'url param is required' }))
      }

      let parsed
      try { parsed = new URL(targetUrl) }
      catch {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ error: 'Invalid URL' }))
      }

      if (!['http:', 'https:'].includes(parsed.protocol)) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ error: 'Only http/https allowed' }))
      }

      try {
        const upstream = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'audio/*,*/*;q=0.9',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': `${parsed.protocol}//${parsed.hostname}/`,
            'Range': req.headers['range'] || '',
          },
        })

        const contentType = upstream.headers.get('content-type') || 'audio/mpeg'
        const contentLength = upstream.headers.get('content-length')
        const contentRange = upstream.headers.get('content-range')

        const headers = {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': contentType,
          'Cache-Control': 'no-store',
          'Accept-Ranges': 'bytes',
        }
        if (contentLength) headers['Content-Length'] = contentLength
        if (contentRange) headers['Content-Range'] = contentRange

        res.writeHead(upstream.status, headers)

        const { Readable } = await import('stream')
        const nodeStream = Readable.fromWeb(upstream.body)
        nodeStream.pipe(res)
        nodeStream.on('error', () => res.end())
        req.on('close', () => nodeStream.destroy())
      } catch (err) {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Proxy failed: ' + err.message }))
        }
      }
    })
  },
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    audioProxyPlugin,
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { lossless: false, quality: 80 },
    }),
  ],
  server: {
    port: 5173,
    open: true,
  }
})