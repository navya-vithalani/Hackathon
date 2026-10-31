import Link from 'next/link';
import { ArrowRight, Bell, CalendarDays, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import HomeEventExplorer from '@/app/app/home/HomeEventExplorer';
import { ROUTES } from '@/lib/constants/routes';
import { MOCK_ANNOUNCEMENTS, MOCK_EVENTS, MOCK_REGISTRATIONS } from '@/mocks';
import { createClient } from '@/services/supabase/server';
import { redirect } from 'next/navigation';

export default async function AppHomePage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(`Could not verify the current user: ${error.message}`);
  if (!user) redirect('/login?redirectTo=%2Fapp%2Fhome');

  const fullName = user.user_metadata?.full_name;
  const firstName = typeof fullName === 'string' && fullName.trim()
    ? fullName.trim().split(/\s+/)[0]
    : user.email?.split('@')[0] ?? 'there';
  const events = MOCK_EVENTS.filter((event) => event.status === 'published');

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-5 border-b border-[var(--color-border)] pb-[var(--space-6)]">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">Campus dashboard</p>
          <h1 className="font-heading text-3xl font-semibold">Your campus, happening.</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">Welcome back, {firstName}.</p>
        </div>
        <Badge variant="outline">Sample events</Badge>
      </section>

      <section aria-label="Your activity" className="grid grid-cols-1 gap-3 py-[var(--space-5)] sm:grid-cols-3">
        <Link className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] py-3 text-inherit no-underline sm:border-b-0 sm:border-r sm:pr-5" href={ROUTES.APP_MY_EVENTS}>
          <span><span className="block text-xs text-[var(--color-text-subtle)]">My registrations</span><strong className="mt-1 block font-heading text-2xl">{MOCK_REGISTRATIONS.length}</strong></span>
          <CalendarDays className="text-[var(--color-secondary)]" size={20} />
        </Link>
        <Link className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] py-3 text-inherit no-underline sm:border-b-0 sm:border-r sm:px-5" href={ROUTES.APP_INBOX}>
          <span><span className="block text-xs text-[var(--color-text-subtle)]">Campus updates</span><strong className="mt-1 block font-heading text-2xl">{MOCK_ANNOUNCEMENTS.length}</strong></span>
          <Bell className="text-[var(--color-secondary)]" size={20} />
        </Link>
        <Link className="flex items-center justify-between gap-4 py-3 text-inherit no-underline sm:pl-5" href={ROUTES.APP_CREATE}>
          <span><span className="block text-xs text-[var(--color-text-subtle)]">Have an idea?</span><strong className="mt-1 block font-heading text-base">Start an event</strong></span>
          <Plus className="text-[var(--color-secondary)]" size={20} />
        </Link>
      </section>

      <HomeEventExplorer events={events} />

      <Link href={ROUTES.EVENTS_PUBLIC} className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[var(--color-secondary)]">
        Browse the public calendar <ArrowRight size={16} />
      </Link>
    </>
  );
}