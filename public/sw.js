const CACHE = 'drm-v1'
const SHELL = ['/', '/dash', '/manifest.json', '/favicon.ico']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))))
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)
  if (url.pathname.startsWith('/api/') || url.hostname.includes('googleapis') || url.hostname.includes('firebase')) {
    e.respondWith(fetch(e.request).catch(() => new Response('Offline', { status: 503 })))
    return
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached
      return fetch(e.request).then(response => {
        if (response.status === 200 && e.request.method === 'GET') {
          const copy = response.clone()
          caches.open(CACHE).then(c => c.put(e.request, copy))
        }
        return response
      }).catch(() => caches.match('/dash') || new Response('Offline', { status: 503 }))
    })
  )
})
