/**
 * useInstallPrompt.ts — PWA install prompt hook.
 * Captures the browser's beforeinstallprompt event for Android/desktop.
 * Detects iOS standalone eligibility separately.
 */
'use client';
import { useState, useEffect, useSyncExternalStore } from 'react';

/** Non-standard browser event — not yet in TypeScript's lib.dom. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface UseInstallPromptReturn {
  /** True when the app can be installed (Android prompt available or iOS eligible). */
  canInstall: boolean;
  /** True on iOS Safari where install requires the share sheet. */
  isIOS: boolean;
  /** True once the user has dismissed the prompt in this session. */
  isDismissed: boolean;
  /** Trigger the native install prompt (Android/desktop only). */
  prompt: () => Promise<void>;
  /** Dismiss without installing; hides the prompt UI. */
  dismiss: () => void;
}

function subscribeToInstallState(onStoreChange: () => void) {
  const displayMode = window.matchMedia('(display-mode: standalone)');
  displayMode.addEventListener('change', onStoreChange);
  window.addEventListener('appinstalled', onStoreChange);
  return () => {
    displayMode.removeEventListener('change', onStoreChange);
    window.removeEventListener('appinstalled', onStoreChange);
  };
}

function getIOSSnapshot() {
  const userAgent = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return ios && !isStandalone;
}

export function useInstallPrompt(): UseInstallPromptReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed,    setIsDismissed]    = useState(false);
  const isIOS = useSyncExternalStore(subscribeToInstallState, getIOSSnapshot, () => false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const prompt = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const dismiss = () => setIsDismissed(true);

  return {
    canInstall: !!deferredPrompt || isIOS,
    isIOS,
    isDismissed,
    prompt,
    dismiss,
  };
}
