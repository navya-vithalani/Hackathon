/**
 * useOffline.ts — Tracks browser online/offline status.
 * Returns true while navigator.onLine is false.
 * Hydration-safe: initialises to false on the server.
 */
'use client';
import { useState, useEffect } from 'react';

export function useOffline(): boolean {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Sync with real browser state after mount
    setIsOffline(!navigator.onLine);

    const handleOnline  = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
}
