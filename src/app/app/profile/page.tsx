import Link from 'next/link';
import { ArrowRight, BadgeCheck, Building2, GraduationCap, IdCard, Settings2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { ROUTES } from '@/lib/constants/routes';
import { MOCK_CURRENT_USER } from '@/mocks';

export default function ProfilePage() {
  const user = MOCK_CURRENT_USER;

  return (
    <div className="space-y-8">
      <header className="border-b border-[var(--color-border)] pb-6"><p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">Your account</p><h1 className="font-heading text-3xl font-semibold">Profile</h1></header>
      <section className="flex flex-wrap items-center gap-5 border-b border-[var(--color-border)] pb-7">
        <Avatar src={user.avatar_url} name={user.full_name} size="xl" />
        <div className="min-w-[220px] flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-heading text-2xl font-semibold">{user.full_name}</h2><Badge variant="outline">Student</Badge></div><p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]"><Building2 size={15} />{user.institution?.name}</p><p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]"><GraduationCap size={15} />Grade {user.grade} · {user.stream}</p></div>
        <Badge variant="success"><BadgeCheck size={14} className="mr-1" /> Institution verified</Badge>
      </section>

      <section aria-labelledby="profile-details-title"><h2 id="profile-details-title" className="mb-4 font-heading text-xl font-semibold">Account details</h2><dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2"><div className="border-t border-[var(--color-border)] py-4"><dt className="text-xs text-[var(--color-text-subtle)]">Account type</dt><dd className="mt-1 text-sm font-medium">Student</dd></div><div className="border-t border-[var(--color-border)] py-4"><dt className="text-xs text-[var(--color-text-subtle)]">Institution</dt><dd className="mt-1 text-sm font-medium">{user.institution?.name}</dd></div><div className="border-t border-[var(--color-border)] py-4"><dt className="text-xs text-[var(--color-text-subtle)]">Grade and stream</dt><dd className="mt-1 text-sm font-medium">{user.grade} · {user.stream}</dd></div><div className="border-t border-[var(--color-border)] py-4"><dt className="text-xs text-[var(--color-text-subtle)]">Member since</dt><dd className="mt-1 text-sm font-medium">August 2024</dd></div></dl></section>

      <Link href={ROUTES.APP_PROFILE_ID} className="flex min-h-[76px] items-center justify-between gap-4 border-y border-[var(--color-border)] py-4 text-inherit no-underline"><span className="flex items-center gap-3"><IdCard size={22} className="text-[var(--color-secondary)]" /><span><strong className="block text-sm">Digital campus ID</strong><span className="mt-1 block text-xs text-[var(--color-text-subtle)]">View or print your student ID card.</span></span></span><ArrowRight size={18} /></Link>
      <InstallPrompt />
      <div className="flex items-center gap-3 text-sm text-[var(--color-text-subtle)]"><Settings2 size={17} />Settings and authentication are preview-only until an account provider is connected.</div>
    </div>
  );
}