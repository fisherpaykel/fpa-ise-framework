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
  }

  // Register background sync on mount
  useEffect(() => {
    const timerInterval = parseInt(process.env.REACT_APP_TIMER_INTERVAL || '120000', 10); // Default to 2 minutes
    
    // Function to register background sync
    const registerMinuteSync = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        if ('sync' in registration) {
          await (registration as ServiceWorkerRegistration & { sync: SyncManager }).sync.register('minute-sync');
          console.log('Background sync registered successfully with tag: minute-sync');
        } else {
          console.error('SyncManager is not supported in this ServiceWorker registration.');
        }
      } catch (error) {
        console.error('Failed to register background sync:', error);
      }
    };
  
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      console.log('Background Sync is supported');
      
      // Register the first sync immediately
      registerMinuteSync();
  
      // Set up interval for periodic registration
      const intervalId = setInterval(() => {
        console.log('Re-registering background sync');
        registerMinuteSync();
      }, timerInterval);
  
      // Cleanup interval on component unmount
      return () => {
        console.log('Cleaning up interval');
        clearInterval(intervalId);
      };
    } else {
      console.error('Background Sync is not supported in this environment.');
    }
  }, []);

  return (
    <></>
  );
};

export default BackgroundFetchComponent;

