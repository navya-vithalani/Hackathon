'use client';

import { useInstallPrompt } from '@/lib/hooks/useInstallPrompt';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Download, Share } from 'lucide-react';

/** Displays installation actions only when the current browser supports them. */
export function InstallPrompt() {
  const { canInstall, isIOS, isDismissed, prompt, dismiss } = useInstallPrompt();
  if (!canInstall || isDismissed) return null;

  return (
    <Card variant="flat" className="gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div><h2 className="font-semibold">Take hivai with you</h2><p className="mt-1 text-sm text-[var(--color-text-muted)]">{isIOS ? 'Tap Share, then Add to Home Screen.' : 'Install the campus events app on this device.'}</p></div>
      {isIOS ? <Share size={19} aria-hidden="true" /> : <Button onClick={prompt}><Download size={16} /> Install app</Button>}
      <button type="button" onClick={dismiss} aria-label="Dismiss install prompt" className="min-h-[44px] px-3 text-sm text-[var(--color-text-subtle)]">Dismiss</button>
    </Card>
  );
}