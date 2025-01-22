// Import Workbox libraries
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache static assets during the build
precacheAndRoute(self.__WB_MANIFEST || [
  { url: '/', revision: null },
  { url: '/offline.html', revision: null },
  { url: '/styles.css', revision: null },
  { url: '/app.js', revision: null },
]);

const DB_NAME = 'ProductDB';
const TABLE_NAME = 'Product';
const OFFLINE_PAGE = './offline.html'

self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    (async () => {
      const cache = await caches.open('static-cache');
      const resources = ['/', '/offline.html'];
      for (const resource of resources) {
        try {
          console.log(`[SW] Caching resource: ${resource}`);
          await cache.add(resource);
        } catch (error) {
          console.error(`[SW] Failed to cache resource: ${resource}`, error);
        }
      }
    })()
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    (async () => {
      await clients.claim();
      const clientList = await clients.matchAll();
      clientList.forEach((client) =>
        client.postMessage({ type: 'RELOAD_PAGE' })
      );
    })()
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Serving cached page:', event.request.url);
          return cachedResponse;
        }
        return fetch(event.request).catch(() => {
          console.warn('[SW] Fetch failed; serving offline page');
          return caches.match(OFFLINE_PAGE);
        });
      })
    );
  }
});

// Cache CSS, JS, and HTML
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'document',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }),
    ],
  })
);

// Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 24 * 60 * 60 }),
    ],
  })
);

// Cache CMS API requests
registerRoute(
  ({ url }) => url.origin === 'https://api.fisherpaykel.com' && url.pathname.startsWith('/uat/v4/cms'),
  new NetworkFirst({
    cacheName: 'cms-api-cache',
    networkTimeoutSeconds: 10, // Fallback to cache after 10 seconds
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache successful and opaque responses
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // Cache for 1 day
      }),
    ],
  })
);

// Cache other API responses
registerRoute(
  ({ url }) => url.origin === 'https://firestore.googleapis.com',
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // Cache for 1 day
      }),
    ],
  })
);

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'minute-sync') {
    console.log('Background sync triggered');
    event.waitUntil(updateData());
  } else {
    console.log(`Unknown sync tag: ${event.tag}`);
  }
});

const updateData = async () => {
  try {
    const response = await fetch('https://firestore.googleapis.com/v1/projects/fpa-pwa/databases/(default)/documents/products/lqUhZdsMYF8FgUqH7aML');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Save the data to IndexedDB
    const db = await openDatabase();
    const transaction = db.transaction(TABLE_NAME, 'readwrite');
    const store = transaction.objectStore(TABLE_NAME);
    await store.put(data, 'latest');

    console.log('Data successfully updated in IndexedDB');
    return data;
  } catch (error) {
    console.error('Error updating data during background sync:', error);
  }
};

// IndexedDB operations
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(TABLE_NAME)) {
        db.createObjectStore(TABLE_NAME);
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};


console.log('Custom service worker loaded');
