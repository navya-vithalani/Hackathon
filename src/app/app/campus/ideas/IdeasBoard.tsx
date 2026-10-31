'use client';

import { useState } from 'react';
import { ChevronUp, Flag, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IDEA_STATUSES } from '@/lib/constants/eventTypes';
import type { Idea } from '@/types';

const statusVariants = { new: 'neutral', under_review: 'warning', done: 'success' } as const;

/** Anonymous campus idea board with local-only submit, vote, and report interactions. */
export default function IdeasBoard({ initialIdeas }: { initialIdeas: Idea[] }) {
  const [ideas, setIdeas] = useState(initialIdeas);
  const [draft, setDraft] = useState('');
  const [reported, setReported] = useState<string[]>([]);

  function submitIdea(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setIdeas((current) => [{ id: `idea-${Date.now()}`, institution_id: 'inst-1', body, status: 'new', upvote_count: 0, hidden: false, has_voted: false, created_at: new Date().toISOString() }, ...current]);
    setDraft('');
  }

  function toggleVote(ideaId: string) {
    setIdeas((current) => current.map((idea) => idea.id === ideaId ? { ...idea, has_voted: !idea.has_voted, upvote_count: idea.upvote_count + (idea.has_voted ? -1 : 1) } : idea));
  }

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
      <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {ideas.map((idea) => {
          const status = IDEA_STATUSES.find(({ value }) => value === idea.status);
          return (
            <article key={idea.id} className="flex gap-4 py-5">
              <button type="button" onClick={() => toggleVote(idea.id)} aria-label={`${idea.has_voted ? 'Remove vote from' : 'Upvote'} idea`} aria-pressed={idea.has_voted} className={`flex h-[54px] w-[48px] shrink-0 flex-col items-center justify-center border ${idea.has_voted ? 'border-[var(--color-accent-dark)] bg-[var(--color-surface-alt)] text-[var(--color-secondary)]' : 'border-[var(--color-border)] text-[var(--color-text-subtle)]'}`}><ChevronUp size={18} /><span className="text-xs font-bold">{idea.upvote_count}</span></button>
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><Badge variant={statusVariants[idea.status]}>{status?.label}</Badge><span className="text-xs text-[var(--color-text-subtle)]">Anonymous · {new Date(idea.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span></div><p className="mt-3 text-sm leading-relaxed">{idea.body}</p><button type="button" onClick={() => setReported((current) => current.includes(idea.id) ? current : [...current, idea.id])} disabled={reported.includes(idea.id)} className="mt-3 inline-flex min-h-[36px] items-center gap-1.5 text-xs text-[var(--color-text-subtle)]"><Flag size={13} />{reported.includes(idea.id) ? 'Reported' : 'Report'}</button></div>
            </article>
          );
        })}
      </div>

      <form onSubmit={submitIdea} className="h-fit border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h2 className="font-heading text-xl font-semibold">Add an idea</h2>
        <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">Your name is never shown with an idea. Keep it constructive and specific.</p>
        <label className="mt-5 block text-sm font-semibold">What would make campus better?
          <textarea required maxLength={500} rows={5} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Share one thing you would improve..." className="mt-2 w-full resize-y rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-3 font-normal" />
        </label>
        <div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-[var(--color-text-subtle)]">{draft.length}/500 · Anonymous</span><Button type="submit"><Plus size={16} /> Post idea</Button></div>
        <p className="mt-4 text-xs text-[var(--color-text-subtle)]">Posts and votes in this preview are temporary and stay in this page session.</p>
      </form>
    </div>
  );
}