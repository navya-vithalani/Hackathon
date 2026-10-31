import Link from 'next/link';
import { ArrowLeft, BadgeCheck, Building2, GraduationCap } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { PrintIdButton } from '@/components/profile/PrintIdButton';
import { MOCK_CURRENT_USER } from '@/mocks';

export default function ProfileIdPage() {
  const user = MOCK_CURRENT_USER;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link href="/app/profile" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[var(--color-secondary)]"><ArrowLeft size={16} /> Profile</Link>
      <header><p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">Campus identity</p><h1 className="font-heading text-3xl font-semibold">Digital ID</h1></header>
      <section id="student-id-card" className="overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-md)]">
        <div className="flex items-center justify-between bg-[var(--color-surface-dark)] p-5 text-[var(--color-text-inverse)]"><span className="font-heading text-lg font-bold">Evently</span><span className="text-xs uppercase tracking-widest">Student pass</span></div>
        <div className="flex flex-wrap items-center gap-5 p-6"><Avatar src={user.avatar_url} name={user.full_name} size="xl" /><div><h2 className="font-heading text-2xl font-semibold">{user.full_name}</h2><p className="mt-1 text-sm text-[var(--color-text-muted)]">Student · Grade {user.grade}</p></div></div>
        <div className="space-y-3 border-t border-[var(--color-border)] p-6"><p className="flex items-center gap-2 text-sm"><Building2 size={16} className="text-[var(--color-secondary)]" />{user.institution?.name}</p><p className="flex items-center gap-2 text-sm"><GraduationCap size={16} className="text-[var(--color-secondary)]" />{user.stream}</p><p className="flex items-center gap-2 text-xs text-[var(--color-success)]"><BadgeCheck size={15} />Institution verified</p><p className="border-t border-[var(--color-border)] pt-3 font-mono text-xs text-[var(--color-text-subtle)]">EVENTLY ID · {user.id.toUpperCase()}</p></div>
      </section>
      <PrintIdButton />
      <p className="text-xs leading-relaxed text-[var(--color-text-subtle)]">QR ticketing is not connected in this preview. Event check-in will use verified registration IDs once the backend is enabled.</p>
    </div>
  );
}