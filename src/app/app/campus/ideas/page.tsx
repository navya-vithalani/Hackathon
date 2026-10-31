import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import IdeasBoard from './IdeasBoard';
import { MOCK_IDEAS } from '@/mocks';

export default function CampusIdeasPage() {
  return (
    <div className="space-y-6">
      <Link href="/app/campus" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[var(--color-secondary)]"><ArrowLeft size={16} /> Campus</Link>
      <header className="border-b border-[var(--color-border)] pb-6"><p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">Community voice</p><h1 className="font-heading text-3xl font-semibold">Campus ideas</h1><p className="mt-2 max-w-2xl text-sm text-[var(--color-text-muted)]">Good changes start with someone saying what could be better.</p></header>
      <IdeasBoard initialIdeas={MOCK_IDEAS.filter((idea) => !idea.hidden)} />
    </div>
  );
}