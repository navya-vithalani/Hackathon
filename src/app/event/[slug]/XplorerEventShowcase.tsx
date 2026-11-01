import Link from 'next/link';
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Code2,
  MapPin,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { EVENT_TYPE_LABELS } from '@/lib/constants/eventTypes';
import { ROUTES } from '@/lib/constants/routes';
import type { Event } from '@/types';
import styles from '../../discovery.module.css';
import XplorerRegistrationForm from './XplorerRegistrationForm';

const MOMENT_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
    alt: 'A team collaborating around a laptop',
    label: 'Make it together',
  },
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    alt: 'Code open on a laptop in a creative workspace',
    label: 'Build something real',
  },
  {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
    alt: 'A team celebrating a project together',
    label: 'Meet your people',
  },
];

export default function XplorerEventShowcase({ event }: { event: Event }) {
  const details = event.description_structured;
  const eventDate = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(event.starts_at));
  const eventTime = new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(event.starts_at));

  return (
    <article className={`${styles.detailContent} ${styles.xplorerContent}`}>
      <section
        className={`${styles.detailArtwork} ${styles.xplorerArtwork}`}
        data-type={event.type}
        style={event.cover_url ? {
          backgroundImage: `linear-gradient(90deg, rgba(28, 8, 8, .94) 0%, rgba(35, 10, 10, .78) 48%, rgba(35, 10, 10, .24) 100%), url("${event.cover_url}")`,
        } : undefined}
      >
        <div className={styles.xplorerHeroMeta}>
          <span><Sparkles size={13} aria-hidden="true" /> GATIK INNOVATION CLUB PRESENTS</span>
          <span>{EVENT_TYPE_LABELS[event.type]} <i /> 24-HOUR BUILDATHON</span>
        </div>
        <p className={styles.xplorerHeroKicker}>Big ideas. Tiny first steps. One unforgettable night.</p>
        <h1>{event.title}<span>.</span></h1>
        <p className={styles.xplorerHeroDescription}>A campus buildathon for the curious, the makers, and the “what if?” people.</p>
        <div className={styles.xplorerHeroActions}>
          <Link href="#register" className={styles.xplorerPrimaryAction}>Save your spot <ArrowUpRight size={17} /></Link>
          <a href="#the-journey" className={styles.xplorerTextAction}>Explore the experience <ArrowDown size={15} /></a>
        </div>
        <div className={styles.xplorerHeroStamp} aria-hidden="true">BUILD<br />BOLDLY<br /><span>’26</span></div>
      </section>

      <div className={styles.xplorerQuickFacts} aria-label="Event highlights">
        <div><span className={styles.xplorerFactIcon}><CalendarDays size={17} /></span><span><strong>{eventDate}</strong><small>{eventTime} · overnight</small></span></div>
        <div><span className={styles.xplorerFactIcon}><MapPin size={17} /></span><span><strong>Gatik Jr. College</strong><small>Innovation Hall · New Delhi</small></span></div>
        <div><span className={styles.xplorerFactIcon}><Users size={17} /></span><span><strong>120 builder spots</strong><small>Solo makers welcome</small></span></div>
        <div><span className={styles.xplorerFactIcon}><Trophy size={17} /></span><span><strong>₹10,000 prize pool</strong><small>Plus people’s choice</small></span></div>
      </div>

      <section className={styles.xplorerStory} id="the-journey">
        <div className={styles.xplorerStoryCopy}>
          <p className={styles.xplorerEyebrow}><Code2 size={14} /> NOT JUST ANOTHER HACKATHON</p>
          <h2>Explore the <em>“what if?”</em></h2>
          <p>{details?.summary}</p>
          <p>For 24 hours, the campus turns into a little launchpad: ideas on whiteboards, playlists in the hallway, kind mentors nearby, and teams finding their rhythm. You don’t need a polished pitch or a perfect portfolio. Just bring your curiosity and make a first version that says, “this could be better.”</p>
          <div className={styles.xplorerStoryNote}><Zap size={17} /><span><strong>Beginner energy is welcome.</strong> Designers, coders, researchers, storytellers, and first-time builders all belong here.</span></div>
        </div>
        <div className={styles.xplorerImageGrid}>
          {MOMENT_IMAGES.map((image, index) => (
            <div
              key={image.label}
              role="img"
              aria-label={image.alt}
              className={`${styles.xplorerImage} ${styles[`xplorerImage${index + 1}`]}`}
              style={{ backgroundImage: `linear-gradient(0deg, rgba(31, 8, 8, .7), transparent 58%), url("${image.url}")` }}
            >
              <span>{image.label}</span>
            </div>
          ))}
          <div className={styles.xplorerImageSticker}><Sparkles size={16} /> IDEAS LOOK<br />GOOD ON YOU</div>
        </div>
      </section>

      <section className={styles.xplorerJourney}>
        <div className={styles.xplorerSectionHeading}>
          <div><p className={styles.xplorerEyebrow}>ONE DAY. A LOT OF POSSIBILITY.</p><h2>The Xplorer journey</h2></div>
          <p>Arrive curious. Leave with something you made — and a few new friends.</p>
        </div>
        <div className={styles.xplorerTimeline}>
          {(details?.schedule ?? []).slice(0, 4).map((item, index) => (
            <div key={`${item.time}-${item.title}`} className={styles.xplorerTimelineItem}>
              <span className={styles.xplorerTimelineIndex}>0{index + 1}</span>
              <span className={styles.xplorerTimelineDot} />
              <span><strong>{item.time}</strong><small>{item.title}</small></span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.xplorerDetailsSection} aria-labelledby="xplorer-details-title">
        <div className={styles.xplorerSectionHeading}>
          <div><p className={styles.xplorerEyebrow}>OPEN A CARD, GET THE DETAILS</p><h2 id="xplorer-details-title">Everything you need to know</h2></div>
          <BadgeCheck size={26} className={styles.xplorerHeadingIcon} aria-hidden="true" />
        </div>
        <div className={styles.xplorerAccordionGrid}>
          <details className={styles.xplorerAccordion} open>
            <summary><span><CalendarDays size={18} /><strong>Full schedule</strong></span><i aria-hidden="true" /></summary>
            <div className={styles.xplorerAccordionContent}>
              <ul className={styles.xplorerSchedule}>
                {(details?.schedule ?? []).map((item) => <li key={`${item.time}-${item.title}`}><time>{item.time}</time><span>{item.title}</span></li>)}
              </ul>
            </div>
          </details>
          <details className={styles.xplorerAccordion}>
            <summary><span><Code2 size={18} /><strong>What to bring & how to play</strong></span><i aria-hidden="true" /></summary>
            <div className={styles.xplorerAccordionContent}>
              <p>Bring your laptop, charger, student ID, and an open mind. We’ll take care of meals and late-night snacks.</p>
              <ul>{(details?.rules ?? []).map((rule) => <li key={rule}>{rule}</li>)}</ul>
            </div>
          </details>
          <details className={styles.xplorerAccordion}>
            <summary><span><Trophy size={18} /><strong>Prizes & bragging rights</strong></span><i aria-hidden="true" /></summary>
            <div className={styles.xplorerAccordionContent}>
              <p>Celebrate the craft, the teamwork, and the brave first version.</p>
              <ul>{(details?.prizes ?? []).map((prize) => <li key={prize}>{prize}</li>)}</ul>
            </div>
          </details>
          <details className={styles.xplorerAccordion}>
            <summary><span><Sparkles size={18} /><strong>Quick answers</strong></span><i aria-hidden="true" /></summary>
            <div className={styles.xplorerAccordionContent}>
              {(details?.faqs ?? []).map((faq) => <div className={styles.xplorerFaq} key={faq.question}><strong>{faq.question}</strong><p>{faq.answer}</p></div>)}
            </div>
          </details>
        </div>
      </section>

      <XplorerRegistrationForm />

      <footer className={styles.xplorerFooter}>
        <span>MADE WITH CURIOSITY AT GATIK JR. COLLEGE</span>
        <Link href={ROUTES.APP_HOME}>Back to home <ArrowUpRight size={14} /></Link>
      </footer>
    </article>
  );
}
