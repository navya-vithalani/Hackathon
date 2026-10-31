/**
 * useInstallPrompt.ts — PWA install prompt hook.
 * Captures the browser's beforeinstallprompt event for Android/desktop.
 * Detects iOS standalone eligibility separately.
 */
'use client';
import { useState, useEffect } from 'react';

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

export function useInstallPrompt(): UseInstallPromptReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed,    setIsDismissed]    = useState(false);
  const [isIOS,          setIsIOS]          = useState(false);

  useEffect(() => {
    // Detect iOS Safari (not already installed)
    const ua  = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua) && !(window as unknown as Record<string, unknown>)['standalone'];
    setIsIOS(ios);

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
