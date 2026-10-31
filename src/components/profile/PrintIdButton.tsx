'use client';

import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/** Invokes the browser print dialog for the digital ID page. */
export function PrintIdButton() {
  return <Button variant="outline" onClick={() => window.print()} className="print:hidden"><Printer size={16} /> Print ID card</Button>;
}