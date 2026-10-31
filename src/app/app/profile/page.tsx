import Link from 'next/link';
import { ArrowRight, Building2, IdCard, Settings2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { ROUTES } from '@/lib/constants/routes';
import { createClient } from '@/services/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(`Could not verify the current user: ${error.message}`);
  if (!user) redirect('/login?redirectTo=%2Fapp%2Fprofile');

  const fullName = user.user_metadata?.full_name;
  const avatarUrl = user.user_metadata?.avatar_url;
  const accountType = user.user_metadata?.account_type === 'staff' ? 'Staff' : 'Student';
  const memberSince = new Date(user.created_at).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
  const displayName = typeof fullName === 'string' && fullName.trim()
    ? fullName
    : user.email ?? 'hivai member';

  return (
    <div className="space-y-8">
      <header className="border-b border-[var(--color-border)] pb-6"><p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">Your account</p><h1 className="font-heading text-3xl font-semibold">Profile</h1></header>
      <section className="flex flex-wrap items-center gap-5 border-b border-[var(--color-border)] pb-7">
        <Avatar src={typeof avatarUrl === 'string' ? avatarUrl : undefined} name={displayName} size="xl" />
        <div className="min-w-[220px] flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-heading text-2xl font-semibold">{displayName}</h2><Badge variant="outline">{accountType}</Badge></div><p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]"><Building2 size={15} />Campus details not added yet</p></div>
      </section>

      <section aria-labelledby="profile-details-title"><h2 id="profile-details-title" className="mb-4 font-heading text-xl font-semibold">Account details</h2><dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2"><div className="border-t border-[var(--color-border)] py-4"><dt className="text-xs text-[var(--color-text-subtle)]">Email address</dt><dd className="mt-1 break-all text-sm font-medium">{user.email ?? 'Not available'}</dd></div><div className="border-t border-[var(--color-border)] py-4"><dt className="text-xs text-[var(--color-text-subtle)]">Account type</dt><dd className="mt-1 text-sm font-medium">{accountType}</dd></div><div className="border-t border-[var(--color-border)] py-4"><dt className="text-xs text-[var(--color-text-subtle)]">Campus</dt><dd className="mt-1 text-sm font-medium">Not added yet</dd></div><div className="border-t border-[var(--color-border)] py-4"><dt className="text-xs text-[var(--color-text-subtle)]">Member since</dt><dd className="mt-1 text-sm font-medium">{memberSince}</dd></div></dl></section>

      <Link href={ROUTES.APP_PROFILE_ID} className="flex min-h-[76px] items-center justify-between gap-4 border-y border-[var(--color-border)] py-4 text-inherit no-underline"><span className="flex items-center gap-3"><IdCard size={22} className="text-[var(--color-secondary)]" /><span><strong className="block text-sm">Digital campus ID</strong><span className="mt-1 block text-xs text-[var(--color-text-subtle)]">View or print your hivai pass.</span></span></span><ArrowRight size={18} /></Link>
      <InstallPrompt />
      <div className="flex items-center gap-3 text-sm text-[var(--color-text-subtle)]"><Settings2 size={17} />Campus details and event activity will appear here as you use hivai.</div>
    </div>
  );
}