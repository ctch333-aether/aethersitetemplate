/**
 * AETHER Assets Service Worker v2.0.0
 * Provides offline caching for all brand assets
 * 
 * Installation: Register in your main JS file:
 * if ('serviceWorker' in navigator) {
 *   navigator.serviceWorker.register('/assets/sw.js', { scope: '/assets/' });
 * }
 */

const CACHE_NAME = 'aether-assets-v2';
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

// Critical assets to precache immediately
const PRECACHE_ASSETS = [
  '/assets/webp/aether-brand-logo-main.webp',
  '/assets/webp/aether-brand-ctch-logotype.webp',
  '/assets/aether-assets.css',
  '/assets/aether-assets.js',
  '/assets/manifest/aether-website-assets-manifest.json'
];

// Asset patterns to cache on first request
const CACHE_PATTERNS = [
  /\/assets\/webp\/.+\.webp$/,
  /\/assets\/avif\/.+\.avif$/,
  /\/assets\/png-fallback\/.+\.png$/,
  /\/assets\/thumbnails\/.+\.(webp|png)$/,
  /\/assets\/lqip\/.+\.webp$/,
  /\/assets\/webp-medium\/.+\.webp$/
];

/**
 * Install event - precache critical assets
 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching critical assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
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
 * Fetch event - serve from cache, fallback to network
 */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Only handle asset requests
  if (!url.pathname.startsWith('/assets/')) {
    return;
  }
  
  // Check if this is a cacheable asset
  const shouldCache = CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
  
  if (shouldCache) {
    event.respondWith(
      cacheFirst(event.request)
    );
  } else {
    event.respondWith(
      networkFirst(event.request)
    );
  }
});

/**
 * Cache-first strategy for static assets
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  
  if (cached) {
    // Check if cache is still fresh
    const cachedDate = cached.headers.get('sw-cached-date');
    if (cachedDate) {
      const age = Date.now() - new Date(cachedDate).getTime();
      if (age < CACHE_DURATION) {
        return cached;
      }
    } else {
      return cached;
    }
  }
  
  // Fetch from network and cache
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      
      // Clone response and add cache date header
      const headers = new Headers(response.headers);
      headers.set('sw-cached-date', new Date().toISOString());
      
      const cachedResponse = new Response(response.clone().body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      });
      
      cache.put(request, cachedResponse);
    }
    
    return response;
  } catch (error) {
    // If network fails, try cache anyway (stale)
    const stale = await caches.match(request);
    if (stale) {
      return stale;
    }
    throw error;
  }
}

/**
 * Network-first strategy for dynamic content
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

/**
 * Message handler for cache management
 */
self.addEventListener('message', event => {
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.delete(CACHE_NAME)
        .then(() => {
          console.log('[SW] Cache cleared');
          event.ports[0].postMessage({ success: true });
        })
    );
  }
  
  if (event.data.action === 'getCacheSize') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.keys())
        .then(keys => {
          event.ports[0].postMessage({ 
            count: keys.length,
            items: keys.map(k => k.url)
          });
        })
    );
  }
  
  if (event.data.action === 'precacheAll') {
    event.waitUntil(
      precacheAllAssets()
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
    );
  }
});

/**
 * Precache all assets for offline use
 */
async function precacheAllAssets() {
  const cache = await caches.open(CACHE_NAME);
  
  // Fetch manifest to get all asset URLs
  const manifestResponse = await fetch('/assets/manifest/aether-website-assets-manifest.json');
  const manifest = await manifestResponse.json();
  
  const urls = [];
  
  // Add all assets from manifest
  if (manifest.assets) {
    Object.values(manifest.assets).flat().forEach(asset => {
      if (asset.files) {
        Object.values(asset.files).forEach(file => {
          urls.push(`/assets/${file}`);
        });
      }
    });
  }
  
  console.log(`[SW] Precaching ${urls.length} assets`);
  
  // Cache in batches to avoid overwhelming the browser
  const batchSize = 10;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    await Promise.all(
      batch.map(url => 
        fetch(url)
          .then(response => {
            if (response.ok) {
              return cache.put(url, response);
            }
          })
          .catch(err => console.warn(`[SW] Failed to cache: ${url}`))
      )
    );
  }
}
