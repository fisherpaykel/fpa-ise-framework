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
      // Register the first sync immediately
      registerMinuteSync();
      // Set up interval for periodic registration
      const intervalId = setInterval(() => {
        registerMinuteSync();
      }, timerInterval);
      // Cleanup interval on component unmount
      return () => {
        clearInterval(intervalId);
      };
    } else {
      console.error('Background Sync is not supported in this environment.');
    }
  }, []);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'RELOAD_PAGE') {
        console.log('[SW] Reloading page for full control');
        window.location.reload();
      }
    });
  }

  return (
    <></>
  );
};

export default BackgroundFetchComponent;

