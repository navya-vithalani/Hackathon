import CreateEventForm from './CreateEventForm';

export default function CreateEventPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--color-border)] pb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">Organizer studio</p>
        <h1 className="font-heading text-3xl font-semibold">Make a gathering happen.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">Start with a few details. Shape the rest into an event people can understand and join.</p>
      </header>
      <CreateEventForm />
    </div>
  );
}