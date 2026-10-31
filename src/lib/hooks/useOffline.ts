/**
 * useOffline.ts — Tracks browser online/offline status.
 * Returns true while navigator.onLine is false.
 * Hydration-safe: initialises to false on the server.
 */
'use client';
import { useSyncExternalStore } from 'react';

function subscribe(onStoreChange: () => void) {
  window.addEventListener('online', onStoreChange);
  window.addEventListener('offline', onStoreChange);
  return () => {
    window.removeEventListener('online', onStoreChange);
    window.removeEventListener('offline', onStoreChange);
  };
}

function getSnapshot() {
  return !navigator.onLine;
}

export function useOffline(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
