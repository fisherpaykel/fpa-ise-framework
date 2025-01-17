// Import the Workbox libraries (if required by your setup)
import { precacheAndRoute } from 'workbox-precaching';

// Precache manifest will be injected here during build
precacheAndRoute(self.__WB_MANIFEST || []);


const DB_NAME = 'ProductDB';
const TABLE_NAME = 'Product';

// Custom sync and message listeners
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
    const mergedOptions = {
        next: { revalidate: 60 },
        headers: {
          "x-api-key": "sqJloNXnU03KJktputFLQ2T0icIGeZDn364lxSAA"
        },
    };
    // const response = await fetch('https://api.fisherpaykel.com/dev/v1/products?brandName=fpa', mergedOptions);
    const response = await fetch('https://firestore.googleapis.com/v1/projects/fpa-pwa/databases/(default)/documents/products/lqUhZdsMYF8FgUqH7aML', {});
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const db = await openDatabase();
    const transaction = db.transaction(TABLE_NAME, 'readwrite');
    const store = transaction.objectStore(TABLE_NAME);
    await store.put(data, 'latest');

    console.log('Data successfully updated in IndexedDB during background sync');
    console.log(data)
  } catch (error) {
    console.error('Error updating data during background sync:', error);
  }
};

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

self.addEventListener('message', async (event) => {
  const { action } = event.data;

  if (action === 'fetchUpdate') {
    console.log('Message received: Fetch update requested');
    await updateData();
  }

  if (action === 'getData') {
    console.log('Message received: Get data requested');
    const db = await openDatabase();
    const transaction = db.transaction(TABLE_NAME, 'readonly');
    const store = transaction.objectStore(TABLE_NAME);
    const request = store.get('latest');

    request.onsuccess = () => {
      event.source.postMessage({ action: 'sendData', payload: request.result });
    };

    request.onerror = () => {
      console.error('Failed to retrieve data from IndexedDB');
    };
  }
});

console.log('Custom service worker loaded');
