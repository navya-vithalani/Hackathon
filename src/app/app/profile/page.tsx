import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  IdCard,
  Settings2,
  Sparkles,
  Trophy,
  UsersRound,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { ROUTES } from '@/lib/constants/routes';
import { MOCK_GATIK_INSTITUTION, MOCK_ORGANIZING_EVENTS, MOCK_PARTICIPATING_EVENTS } from '@/mocks';
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
  const participatingEvents = MOCK_PARTICIPATING_EVENTS;
  const organizingEvents = MOCK_ORGANIZING_EVENTS;
  const eventHistory = [
    ...participatingEvents.map((event) => ({ event, role: 'Participant' })),
    ...organizingEvents.map((event) => ({ event, role: 'Organizer' })),
  ].sort((a, b) => b.event.starts_at.localeCompare(a.event.starts_at));
  const badges = [
    { title: 'First steps', description: 'Joined a campus event', earned: participatingEvents.length > 0, icon: BadgeCheck },
    { title: 'Community builder', description: 'Helped bring an event to life', earned: organizingEvents.length > 0, icon: UsersRound },
    { title: 'Campus regular', description: 'Taken part in 3 or more events', earned: eventHistory.length >= 3, icon: Trophy },
  ];

  return (
    <div className="space-y-8">
      <header className="border-b border-[var(--color-border)] pb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">Your account</p>
        <h1 className="font-heading text-3xl font-semibold">Profile</h1>
      </header>

      <section aria-label="Profile introduction" className="profile-stage overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface-dark)] p-4 sm:p-7">
        <span aria-hidden="true" className="profile-orb absolute -right-20 -top-24 size-80 rounded-full" />
        <span aria-hidden="true" className="profile-orb profile-orb--secondary absolute -bottom-36 -left-20 size-96 rounded-full" />
        <div className="profile-glass relative grid gap-6 rounded-[var(--radius-card)] p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-8">
          <div className="relative mx-auto sm:mx-0">
            <Avatar
              src={typeof avatarUrl === 'string' ? avatarUrl : undefined}
              name={displayName}
              size="xl"
              className="!h-20 !w-20 !text-2xl ring-4 ring-[color-mix(in_srgb,var(--color-surface)_70%,transparent)] shadow-[var(--shadow-lg)]"
            />
            <span className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-success)] text-[var(--color-text-inverse)]">
              <Sparkles size={14} aria-hidden="true" />
            </span>
          </div>
          <div className="min-w-0 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="break-words font-heading text-2xl font-semibold text-[var(--color-text)] sm:text-3xl">{displayName}</h2>
              <Badge variant="outline">{accountType}</Badge>
            </div>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-[var(--color-text-muted)] sm:justify-start">
              <Building2 size={15} aria-hidden="true" />
              {MOCK_GATIK_INSTITUTION.name}
              <Badge variant="neutral">Demo campus</Badge>
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-subtle)]">A little more you, a lot more campus.</p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <Link href={ROUTES.APP_PROFILE_ID} className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-surface-dark)] px-4 py-2 text-sm font-semibold text-[var(--color-text-inverse)] no-underline transition-transform duration-[var(--duration-base)] hover:-translate-y-0.5">
              <IdCard size={17} aria-hidden="true" /> Campus ID
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Campus activity" className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Events joined', value: participatingEvents.length, icon: CalendarDays },
          { label: 'Events organized', value: organizingEvents.length, icon: UsersRound },
          { label: 'Community badges', value: badges.filter((badge) => badge.earned).length, icon: Trophy },
        ].map(({ label, value, icon: Icon }) => (
          <article key={label} className="flex items-center gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
            <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] text-[var(--color-secondary)]"><Icon size={20} aria-hidden="true" /></span>
            <span><strong className="block font-heading text-2xl">{value}</strong><span className="text-xs text-[var(--color-text-subtle)]">{label}</span></span>
          </article>
        ))}
      </section>

      <section aria-labelledby="profile-events-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">The good stuff</p>
            <h2 id="profile-events-title" className="font-heading text-xl font-semibold">Your campus story</h2>
          </div>
          <Badge variant="neutral">Demo activity</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {eventHistory.map(({ event, role }) => (
            <Link key={event.id} href={event.slug === 'xplorer-2026' ? ROUTES.EVENT_PUBLIC(event.slug) : ROUTES.APP_EVENT(event.slug)} className="group flex min-h-0 items-center gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-inherit no-underline shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-base)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
              <span className="grid size-12 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)]"><CalendarDays size={20} aria-hidden="true" /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold group-hover:text-[var(--color-secondary)]">{event.title}</span>
                <span className="mt-1 block text-xs text-[var(--color-text-subtle)]">{role} · {new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' }).format(new Date(event.starts_at))}</span>
              </span>
              <ArrowRight className="shrink-0 text-[var(--color-secondary)] transition-transform duration-[var(--duration-base)] group-hover:translate-x-1" size={17} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="profile-badges-title">
        <div className="mb-4 flex items-center gap-2">
          <Trophy size={19} className="text-[var(--color-secondary)]" aria-hidden="true" />
          <h2 id="profile-badges-title" className="font-heading text-xl font-semibold">Community badges</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {badges.map(({ title, description, earned, icon: Icon }) => (
            <article key={title} className={`flex items-start gap-3 rounded-[var(--radius-card)] border p-4 transition-transform duration-[var(--duration-base)] hover:-translate-y-0.5 ${earned ? 'border-[var(--color-accent-dark)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]' : 'border-[var(--color-border)] bg-[var(--color-surface-alt)] opacity-70'}`}>
              <span className={`grid size-10 shrink-0 place-items-center rounded-full ${earned ? 'bg-[var(--color-accent)] text-[var(--color-accent-contrast)]' : 'bg-[var(--color-surface)] text-[var(--color-text-subtle)]'}`}><Icon size={18} aria-hidden="true" /></span>
              <span><strong className="block text-sm">{title}</strong><span className="mt-1 block text-xs leading-relaxed text-[var(--color-text-subtle)]">{description}</span><span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)]">{earned ? 'Unlocked' : 'Keep exploring'}</span></span>
            </article>
          ))}
        </div>
        <p className="mt-3 text-xs text-[var(--color-text-subtle)]">Badges and event activity are sample data for this demo.</p>
      </section>

      <section aria-labelledby="profile-details-title" className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
        <h2 id="profile-details-title" className="mb-4 font-heading text-xl font-semibold">Account details</h2>
        <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          <div className="border-t border-[var(--color-border)] py-4"><dt className="text-xs text-[var(--color-text-subtle)]">Email address</dt><dd className="mt-1 break-all text-sm font-medium">{user.email ?? 'Not available'}</dd></div>
          <div className="border-t border-[var(--color-border)] py-4"><dt className="text-xs text-[var(--color-text-subtle)]">Account type</dt><dd className="mt-1 text-sm font-medium">{accountType}</dd></div>
          <div className="border-t border-[var(--color-border)] py-4"><dt className="text-xs text-[var(--color-text-subtle)]">Campus</dt><dd className="mt-1 text-sm font-medium">{MOCK_GATIK_INSTITUTION.name}</dd></div>
          <div className="border-t border-[var(--color-border)] py-4"><dt className="text-xs text-[var(--color-text-subtle)]">Member since</dt><dd className="mt-1 text-sm font-medium">{memberSince}</dd></div>
        </dl>
      </section>

      <InstallPrompt />
      <div className="flex items-center gap-3 text-sm text-[var(--color-text-subtle)]"><Settings2 size={17} aria-hidden="true" />Campus details can be added from your account settings.</div>
    </div>
  );
}
