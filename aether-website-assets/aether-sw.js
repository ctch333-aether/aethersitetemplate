/**
 * AETHER Assets Service Worker v2.0.0
 * Intelligent offline caching for brand assets
 * 
 * Features:
 * - Cache-first strategy for images
 * - Stale-while-revalidate for thumbnails
 * - Network-first for manifests
 * - Automatic cache cleanup
 * - Precaching of critical assets
 */

const CACHE_VERSION = 'aether-assets-v2';
const CACHE_NAMES = {
  images: `${CACHE_VERSION}-images`,
  thumbs: `${CACHE_VERSION}-thumbs`,
  lqip: `${CACHE_VERSION}-lqip`,
  static: `${CACHE_VERSION}-static`
};

// Critical assets to precache
const PRECACHE_ASSETS = [
  '/assets/webp/aether-brand-logo-main.webp',
  '/assets/webp/aether-brand-ctch-logotype.webp',
  '/assets/lqip/aether-brand-logo-main-blur.webp',
  '/assets/lqip/aether-brand-ctch-logotype-blur.webp',
  '/assets/manifest/master-manifest.json'
];

// Cache size limits (in entries)
const CACHE_LIMITS = {
  images: 50,
  thumbs: 100,
  lqip: 50
};

/**
 * Install event - precache critical assets
 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAMES.static)
      .then(cache => {
        console.log('[SW] Precaching critical assets');
        return cache.addAll(PRECACHE_ASSETS.map(url => new Request(url, { mode: 'cors' })))
          .catch(err => {
            console.warn('[SW] Precache failed for some assets:', err);
          });
      })
      .then(() => self.skipWaiting())
  );
});

/**
 * Activate event - cleanup old caches
 */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('aether-assets-') && !Object.values(CACHE_NAMES).includes(name))
            .map(name => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

/**
 * Determine cache strategy based on request URL
 */
function getCacheStrategy(url) {
  const pathname = new URL(url).pathname;
  
  if (pathname.includes('/lqip/')) {
    return { cache: CACHE_NAMES.lqip, strategy: 'cache-first', limit: CACHE_LIMITS.lqip };
  }
  if (pathname.includes('/thumbnails/') || pathname.includes('-thumb')) {
    return { cache: CACHE_NAMES.thumbs, strategy: 'stale-while-revalidate', limit: CACHE_LIMITS.thumbs };
  }
  if (pathname.includes('/webp/') || pathname.includes('/avif/') || pathname.includes('/png-fallback/')) {
    return { cache: CACHE_NAMES.images, strategy: 'cache-first', limit: CACHE_LIMITS.images };
  }
  if (pathname.includes('/manifest/')) {
    return { cache: CACHE_NAMES.static, strategy: 'network-first', limit: 20 };
  }
  return null;
}

/**
 * Limit cache size by removing oldest entries
 */
async function limitCacheSize(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxEntries) {
    const toDelete = keys.slice(0, keys.length - maxEntries);
    await Promise.all(toDelete.map(key => cache.delete(key)));
    console.log(`[SW] Trimmed ${toDelete.length} entries from ${cacheName}`);
  }
}

/**
 * Cache-first strategy: prefer cached response
 */
async function cacheFirst(request, cacheName, limit) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      limitCacheSize(cacheName, limit);
    }
    return response;
  } catch (error) {
    console.warn('[SW] Fetch failed:', request.url, error);
    return new Response('Asset unavailable offline', { status: 503 });
  }
}

/**
 * Stale-while-revalidate: return cached, update in background
 */
async function staleWhileRevalidate(request, cacheName, limit) {
  const cached = await caches.match(request);
  
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        const cache = caches.open(cacheName);
        cache.then(c => {
          c.put(request, response.clone());
          limitCacheSize(cacheName, limit);
        });
      }
      return response;
    })
    .catch(() => null);
  
  return cached || fetchPromise;
}

/**
 * Network-first strategy: prefer fresh data
 */
async function networkFirst(request, cacheName, limit) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      limitCacheSize(cacheName, limit);
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return new Response('Network unavailable', { status: 503 });
  }
}

/**
 * Fetch event - apply caching strategies
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Only handle GET requests
  if (request.method !== 'GET') return;
  
  // Check if this is an asset request
  const strategy = getCacheStrategy(request.url);
  if (!strategy) return;
  
  let responsePromise;
  
  switch (strategy.strategy) {
    case 'cache-first':
      responsePromise = cacheFirst(request, strategy.cache, strategy.limit);
      break;
    case 'stale-while-revalidate':
      responsePromise = staleWhileRevalidate(request, strategy.cache, strategy.limit);
      break;
    case 'network-first':
      responsePromise = networkFirst(request, strategy.cache, strategy.limit);
      break;
    default:
      return;
  }
  
  event.respondWith(responsePromise);
});

/**
 * Message handler for cache management
 */
self.addEventListener('message', event => {
  const { type, payload } = event.data || {};
  
  switch (type) {
    case 'PRECACHE':
      // Precache specific assets
      if (Array.isArray(payload)) {
        caches.open(CACHE_NAMES.images)
          .then(cache => cache.addAll(payload))
          .then(() => event.ports[0]?.postMessage({ success: true }))
          .catch(err => event.ports[0]?.postMessage({ success: false, error: err.message }));
      }
      break;
      
    case 'CLEAR_CACHE':
      // Clear all caches
      Promise.all(Object.values(CACHE_NAMES).map(name => caches.delete(name)))
        .then(() => event.ports[0]?.postMessage({ success: true }));
      break;
      
    case 'GET_CACHE_SIZE':
      // Report cache sizes
      Promise.all(
        Object.entries(CACHE_NAMES).map(async ([key, name]) => {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          return [key, keys.length];
        })
      )
        .then(sizes => event.ports[0]?.postMessage({ sizes: Object.fromEntries(sizes) }));
      break;
  }
});

console.log('[SW] AETHER Assets Service Worker v2.0.0 loaded');
