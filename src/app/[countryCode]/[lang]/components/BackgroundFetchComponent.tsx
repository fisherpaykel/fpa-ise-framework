"use client";
import React, { useState, useEffect, useCallback } from 'react';

interface ServiceWorkerRegistration {
    periodicSync?: {
      register(tag: string, options: { minInterval: number }): Promise<void>;
      getTags(): Promise<string[]>;
      unregister(tag: string): Promise<void>;
    };
  }

const BackgroundFetchComponent = () => {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [progress, setProgress] = useState('');
  const [loading, setLoading] = useState(false);

  // Post a message to the service worker
  const postMessageToServiceWorker = useCallback((message: any) => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message);
    } else {
      console.warn('No active service worker to send message to');
    }
  }, []);

  // Fetch data from the service worker
  const fetchDataFromServiceWorker = useCallback(async () => {
    try {
      setLoading(true);
      setProgress('Requesting data from service worker...');

      const storedData: any = await new Promise((resolve, reject) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.data && event.data.action === 'sendData') {
            resolve(event.data.payload);
            navigator.serviceWorker.removeEventListener('message', handleMessage);
          }
        };

        navigator.serviceWorker.addEventListener('message', handleMessage);
        postMessageToServiceWorker({ action: 'getData' });
      });

      if (storedData) {
        setData(storedData);
        console.log(storedData)
        setProgress('Data fetched successfully from service worker.');
      } else {
        setProgress('No data available.');
      }
    } catch (error) {
      console.error('Failed to fetch data from service worker:', error);
      setProgress('Error fetching data.');
    } finally {
      setLoading(false);
    }
  }, [postMessageToServiceWorker]);

  // Trigger data fetch and update through the service worker
  const triggerFetchUpdate = useCallback(() => {
    setProgress('Triggering service worker to fetch and update data...');
    postMessageToServiceWorker({ action: 'fetchUpdate' });
  }, [postMessageToServiceWorker]);

  // Register background sync
  const registerMinuteSync = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration) {
        await (registration as ServiceWorkerRegistration & { sync: SyncManager }).sync.register('minute-sync');
        console.log('Minute sync registered');
      } else {
        console.warn('Background Sync not supported');
      }
    } catch (error) {
      console.error('Failed to register background sync:', error);
    }
  };

  const registerPeriodicSync = async () => {
    if ('serviceWorker' in navigator && 'periodicSync' in navigator.serviceWorker) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration.periodicSync) {
          await registration.periodicSync.register('product-sync', {
            minInterval: 24 * 60 * 60 * 1000, // 24 hours
          });
          console.log('Periodic sync registered');
        } else {
          console.warn('Periodic Background Sync is not supported in this browser');
        }
      } catch (error) {
        console.error('Failed to register periodic sync:', error);
      }
    } else {
      console.warn('Periodic Background Sync is not supported in this browser');
    }
  };
  
  
  useEffect(() => {
    registerPeriodicSync();
  }, []);
  
  // Fetch initial data on mount
  useEffect(() => {
    fetchDataFromServiceWorker();
  }, [fetchDataFromServiceWorker]);

  // Register background sync on mount
  useEffect(() => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      registerMinuteSync();
    }
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      <h1>Background Fetch Component</h1>
      <p>{progress}</p>
      <button onClick={fetchDataFromServiceWorker} id="bgFetchButton" disabled={loading}>
        Fetch Data
      </button>
    </div>
  );
};

export default BackgroundFetchComponent;

