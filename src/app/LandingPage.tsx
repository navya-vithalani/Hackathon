import Link from 'next/link';
import styles from './landing.module.css';

const eventTypes = [
  'MUN',
  'Hackathons',
  'Sports Day',
  'Workshops',
  'Quiz leagues',
  'Cultural fests',
  'Robotics',
  'Debates',
];

const features = [
  {
    icon: '🤖',
    title: 'AI event builder',
    description: 'Share your idea by text or voice. Hivai structures the schedule, rules, and FAQs.',
  },
  {
    icon: '🎯',
    title: 'AI screening',
    description: 'Short adaptive interviews help organizers review applicants faster.',
  },
  {
    icon: '🌐',
    title: 'Cross-school discovery',
    description: 'Browse public events from every school, with eligibility built in.',
  },
  {
    icon: '🎟',
    title: 'QR check-in',
    description: 'Digital IDs and tickets let volunteers scan attendees and update attendance.',
  },
];

const steps = ['Create', 'Discover', 'Apply', 'AI interview', 'Check-in'];

export default function LandingPage() {
  return (
    <main className={styles.landing}>
      <section className={styles.hero} aria-labelledby="landing-title">
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            <span className={styles.statusDot} aria-hidden="true" />
            HIVAI · THE STUDENT EVENTS PLATFORM
          </p>
          <Link className={styles.loginLink} href="/login">Log in</Link>
        </header>

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <h1 className={styles.title} id="landing-title">
              Every campus event.
              <br />
              <span className={styles.titleAccent}>One hive.</span>
            </h1>
            <p className={styles.description}>
              Discover events at your school and beyond, run your own with AI, and bring your whole campus together.
            </p>
            <Link className={styles.enterLink} href="/app/home">
              Enter the hive <span aria-hidden="true">›</span>
            </Link>

            <div className={styles.avatars} aria-label="For students, volunteers, organizers, and staff">
              <span className={styles.avatarHoney} aria-hidden="true">AR</span>
              <span className={styles.avatarAmber} aria-hidden="true">MI</span>
              <span className={styles.avatarCoral} aria-hidden="true">KS</span>
              <span className={styles.avatarGold} aria-hidden="true">RM</span>
              <span className={styles.avatarLabel}>Students · Volunteers · Organizers · Staff</span>
            </div>
          </div>

          <div className={styles.orbitWrap} aria-hidden="true">
            <div className={styles.orbit} />
            <div className={styles.dashedOrbit}><span /></div>
            <div className={styles.orb} />
            <div className={`${styles.floatingCard} ${styles.ideaCard}`}>
              <span className={styles.floatingIcon}>✦</span>
              <span><strong>Idea → event</strong><small>AI-built in seconds</small></span>
            </div>
            <div className={`${styles.floatingCard} ${styles.eventsCard}`}>
              <span className={styles.floatingIcon}>🗓</span>
              <span><strong>6 things happening</strong><small>across schools</small></span>
            </div>
          </div>
        </div>

        <div className={styles.highlights}>
          <div><small>BUILT FOR EVERY ROLE</small><strong>Student · Volunteer · Organizer · Staff</strong></div>
          <div><small>ONE PLACE TO</small><strong>Create · Discover · Join · Run</strong></div>
          <div><small>POWERED BY</small><strong>AI screening · QR check-in</strong></div>
        </div>
      </section>

      <div className={styles.ticker} aria-label="Popular campus events">
        <div className={styles.tickerTrack} aria-hidden="true">
          {[...eventTypes, ...eventTypes].map((type, index) => (
            <span key={`${type}-${index}`}>✦ {type}</span>
          ))}
        </div>
      </div>

      <section className={styles.stats} aria-label="Hivai at a glance">
        <div><strong>6</strong><span>events live right now</span></div>
        <div><strong>4</strong><span>schools in the hive</span></div>
        <div><strong>5</strong><span>steps, idea to check-in</span></div>
        <div><strong>0</strong><span>fees for students</span></div>
      </section>

      <section className={styles.section} aria-labelledby="features-title">
        <h2 className={styles.sectionTitle} id="features-title">Everything an event needs</h2>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article className={styles.featureCard} key={feature.title}>
              <span className={styles.featureIcon} aria-hidden="true">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="steps-title">
        <h2 className={styles.sectionTitle} id="steps-title">From idea to check-in</h2>
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li className={styles.step} key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.join} aria-labelledby="join-title">
        <h2 className={styles.sectionTitle} id="join-title">Ready to join the hive?</h2>
        <Link className={styles.enterLink} href="/signup">Create your account</Link>
      </section>
    </main>
  );
}
