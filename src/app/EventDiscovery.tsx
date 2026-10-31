'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, Bookmark, CalendarDays, Hexagon, MapPin, Search, Sparkles } from 'lucide-react';
import { EVENT_TYPE_LABELS, EVENT_TYPES } from '@/lib/constants/eventTypes';
import { MOCK_EVENTS } from '@/mocks';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import type { EventType } from '@/types';
import styles from './discovery.module.css';

const SAVE_KEY = 'hivai:saved-events';
const LEGACY_SAVE_KEY = 'evently:saved-events';
const SAVE_EVENT = 'hivai:saved-events-change';

function subscribeToSavedEvents(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(SAVE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(SAVE_EVENT, onChange);
  };
}

function getSavedEventsSnapshot() {
  try {
    const saved = window.localStorage.getItem(SAVE_KEY) ?? window.localStorage.getItem(LEGACY_SAVE_KEY);
    if (!saved) return '[]';
    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.every((slug) => typeof slug === 'string') ? saved : '[]';
  } catch {
    return '[]';
  }
}

function displayDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
}

export default function EventDiscovery() {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<EventType | 'all'>('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const savedSnapshot = useSyncExternalStore(subscribeToSavedEvents, getSavedEventsSnapshot, () => '[]');
  const savedEvents = JSON.parse(savedSnapshot) as string[];

  const publishedEvents = MOCK_EVENTS.filter((event) => event.status === 'published');
  const featuredEvent = publishedEvents[0];
  const filteredEvents = publishedEvents.filter((event) => {
    const matchesType = activeType === 'all' || event.type === activeType;
    const searchableText = `${event.title} ${event.venue ?? ''} ${event.description_structured?.summary ?? ''}`;
    const matchesQuery = searchableText.toLowerCase().includes(query.trim().toLowerCase());
    const matchesSaved = !savedOnly || savedEvents.includes(event.slug);
    return matchesType && matchesQuery && matchesSaved;
  });

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.target instanceof HTMLElement &&
        (event.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName))) {
        return;
      }
      event.preventDefault();
      searchRef.current?.focus();
    }

    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  function toggleSaved(slug: string) {
    const nextSaved = savedEvents.includes(slug)
      ? savedEvents.filter((savedSlug) => savedSlug !== slug)
      : [...savedEvents, slug];
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(nextSaved));
    window.dispatchEvent(new Event(SAVE_EVENT));
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="hivai home">
          <span className={styles.brandMark}><Hexagon size={20} aria-hidden="true" /></span>
          <span>hivai</span>
        </Link>
        <nav className={styles.nav} aria-label="Main navigation">
          <a className={styles.navActive} href="#events">Discover</a>
          <a href="#how-it-works">How it works</a>
          <button
            className={savedOnly ? styles.navSavedActive : styles.navSaved}
            type="button"
            onClick={() => setSavedOnly((current) => !current)}
            aria-pressed={savedOnly}
            aria-label={savedOnly ? 'Show all events' : 'Show saved events'}
          >
            <Bookmark size={15} aria-hidden="true" />
            <span className={styles.savedLabel}>Saved</span>
            <span className={styles.savedCount}>{savedEvents.length}</span>
          </button>
        </nav>
        <div className={styles.headerActions}>
          <Link className={styles.headerLink} href="/login">Sign in</Link>
          <Link className={styles.headerAction} href="/signup">Join hivai <ArrowRight size={15} /></Link>
        </div>
      </header>

      <section className={styles.hero} aria-labelledby="hero-title">
        <ScrollReveal className={styles.heroCopy}>
          <p className={styles.eyebrow}><Sparkles size={14} /> FIND YOUR CAMPUS HIVE</p>
          <h1 id="hero-title">Good things<br />happen <em>together.</em></h1>
          <p className={styles.heroDescription}>
            Find your people, your next big idea, and the events worth showing up for.
          </p>
          <a className={styles.heroAction} href="#events">Explore events <ArrowDown size={16} /></a>
        </ScrollReveal>
        <ScrollReveal className={styles.featured} delay={120}>
          <div data-type={featuredEvent.type}>
          <div className={styles.featuredTop}>
            <span className={styles.featuredLabel}>UP NEXT</span>
            <span className={styles.featuredIndex}>01 / {String(publishedEvents.length).padStart(2, '0')}</span>
          </div>
          <div
            className={styles.featuredArtwork}
            aria-hidden="true"
            style={featuredEvent.cover_url ? {
              backgroundImage: `linear-gradient(180deg, rgba(46, 11, 10, .2), rgba(46, 11, 10, .72)), url("${featuredEvent.cover_url}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            } : undefined}
          >
            <span className={styles.artworkOrbit} />
            <svg className={styles.artworkHoneycomb} viewBox="0 0 300 220" fill="none" aria-hidden="true">
              <path d="M56 17 82 32v30L56 77 30 62V32l26-15Zm93 0 26 15v30l-26 15-26-15V32l26-15Zm93 0 26 15v30l-26 15-26-15V32l26-15ZM102 96l26 15v30l-26 15-26-15v-30l26-15Zm93 0 26 15v30l-26 15-26-15v-30l26-15ZM56 175l26 15v30l-26 15-26-15v-30l26-15Zm93 0 26 15v30l-26 15-26-15v-30l26-15Zm93 0 26 15v30l-26 15-26-15v-30l26-15Z" />
            </svg>
            <span className={styles.artworkCode}>&lt;/&gt;</span>
            <span className={styles.artworkCaption}>MAKE<br />SOMETHING<br />MATTERS</span>
          </div>
          <div className={styles.featuredBottom}>
            <div>
              <p>{displayDate(featuredEvent.starts_at)} · {EVENT_TYPE_LABELS[featuredEvent.type]}</p>
              <h2>{featuredEvent.title}</h2>
            </div>
            <Link href={`/event/${featuredEvent.slug}`} className={styles.featuredArrow} aria-label={`View ${featuredEvent.title}`}>
              <ArrowRight size={19} />
            </Link>
          </div>
          </div>
        </ScrollReveal>
        <span className={styles.heroIndex}>01 — DISCOVER</span>
      </section>

      <section className={styles.howSection} id="how-it-works" aria-labelledby="how-title">
        <ScrollReveal className={styles.howIntro}>
          <p className={styles.eyebrow}>ONE PLACE, FULL CIRCLE</p>
          <h2 id="how-title">From first idea<br />to <em>showing up.</em></h2>
          <p>hivai brings organizers and students together so campus life feels easier to join.</p>
        </ScrollReveal>
        <ScrollReveal className={styles.howGrid} delay={100}>
          <article className={styles.howTrack}>
            <p className={styles.howLabel}>FOR ORGANIZERS</p>
            <h3>Make it happen.</h3>
            <ol><li><span>01</span>Shape an event from a simple brief.</li><li><span>02</span>Manage people, updates, and registrations.</li><li><span>03</span>Run the day with your whole team.</li></ol>
            <Link href="/app/create">Start an event <ArrowRight size={15} /></Link>
          </article>
          <article className={styles.howTrack}>
            <p className={styles.howLabel}>FOR STUDENTS</p>
            <h3>Find your people.</h3>
            <ol><li><span>01</span>Discover events around your campus.</li><li><span>02</span>Register and keep your plans together.</li><li><span>03</span>Show up, take part, make something.</li></ol>
            <Link href="/app/home">Explore the app <ArrowRight size={15} /></Link>
          </article>
        </ScrollReveal>
      </section>

      <section className={styles.eventsSection} id="events" aria-labelledby="events-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>MAKE A PLAN</p>
            <h2 id="events-title">Coming up on campus</h2>
          </div>
          <p className={styles.sampleNote}>A preview of what your campus could share.</p>
        </div>

        <div className={styles.filters}>
          <label className={styles.searchBox}>
            <Search size={17} aria-hidden="true" />
            <span className={styles.visuallyHidden}>Search events</span>
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search events, places, ideas..."
            />
            <kbd>/</kbd>
          </label>
          <div className={styles.categoryFilters} aria-label="Filter by event type">
            <button
              type="button"
              className={activeType === 'all' ? styles.categoryActive : styles.category}
              onClick={() => setActiveType('all')}
              aria-pressed={activeType === 'all'}
            >All events</button>
            {EVENT_TYPES.filter(({ value }) => value !== 'other').map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={activeType === value ? styles.categoryActive : styles.category}
                onClick={() => setActiveType(value)}
                aria-pressed={activeType === value}
              >{label}</button>
            ))}
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <ScrollReveal className={styles.eventGrid}>
            {filteredEvents.map((event, index) => (
              <article className={styles.eventCard} key={event.id}>
                <Link
                  className={styles.eventArtwork}
                  data-type={event.type}
                  href={`/event/${event.slug}`}
                  style={event.cover_url ? {
                    backgroundImage: `linear-gradient(0deg, rgba(35, 10, 10, .7), rgba(35, 10, 10, .18)), url("${event.cover_url}")`,
                  } : undefined}
                >
                  <span className={styles.artworkNumber}>0{index + 1}</span>
                  <span className={styles.artworkType}>{EVENT_TYPE_LABELS[event.type]}</span>
                  <span className={styles.artworkSymbol} aria-hidden="true">{event.type === 'hackathon' ? '</>' : event.type === 'mun' ? 'MUN' : event.type === 'sports' ? 'GO' : 'LAB'}</span>
                  <span className={styles.artworkDate}>{displayDate(event.starts_at)}</span>
                </Link>
                <div className={styles.eventInfo}>
                  <div className={styles.eventMeta}>
                    <span><CalendarDays size={14} /> {displayDate(event.starts_at)}</span>
                    <span><MapPin size={14} /> {event.mode === 'online' ? 'Online' : event.venue?.split(',')[0]}</span>
                  </div>
                  <div className={styles.eventTitleRow}>
                    <div>
                      <p className={styles.eventType}>{EVENT_TYPE_LABELS[event.type]}</p>
                      <h3><Link href={`/event/${event.slug}`}>{event.title}</Link></h3>
                    </div>
                    <button
                      className={savedEvents.includes(event.slug) ? styles.bookmarkActive : styles.bookmark}
                      type="button"
                      onClick={() => toggleSaved(event.slug)}
                      aria-label={savedEvents.includes(event.slug) ? `Remove ${event.title} from saved events` : `Save ${event.title}`}
                      aria-pressed={savedEvents.includes(event.slug)}
                    >
                      <Bookmark size={18} fill={savedEvents.includes(event.slug) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <p className={styles.eventDescription}>{event.description_structured?.summary}</p>
                  <Link className={styles.detailsLink} href={`/event/${event.slug}`}>Event details <ArrowRight size={15} /></Link>
                </div>
              </article>
            ))}
          </ScrollReveal>
        ) : (
          <div className={styles.emptyState}>
            <Bookmark size={22} />
            <h3>{savedOnly ? 'No saved events yet' : 'No events match that search'}</h3>
            <p>{savedOnly ? 'Bookmark an event to keep it close.' : 'Try another search or choose a different category.'}</p>
            <button type="button" onClick={() => { setQuery(''); setActiveType('all'); setSavedOnly(false); }}>Show all events</button>
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <Link className={styles.brand} href="/" aria-label="hivai home">
          <span className={styles.brandMark}><Hexagon size={18} aria-hidden="true" /></span><span>hivai</span>
        </Link>
        <span>Made for the people who make campus.</span>
        <a href="#events">Back to events ↑</a>
      </footer>
    </main>
  );
}