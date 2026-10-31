/**
 * src/mocks/index.ts — Mock data for the Step 1 UI skeleton phase.
 *
 * This is the ONLY place mock/static data should live.
 * Hooks return data from here during Step 1; the swap to real data in Step 2
 * changes only the hook body — no component or type changes needed.
 *
 * Remove this file (or gate it behind process.env.NEXT_PUBLIC_USE_MOCKS)
 * once every hook is wired to a real service.
 */

import type {
  Profile,
  Event,
  EventMember,
  Registration,
  Broadcast,
  Announcement,
  Idea,
  Institution,
  FormField,
  Screening,
  Notification,
} from '@/types'

// ---------- Institutions ----------

export const MOCK_INSTITUTION: Institution = {
  id: 'inst-1',
  name: 'Delhi Public School, R.K. Puram',
  address: 'Sector 4, R.K. Puram, New Delhi, Delhi 110022',
  place_id: 'ChIJd8BlQ2BZWTkRQpfYkG4G4sM',
  provider: 'google',
  verified: true,
}

export const MOCK_GATIK_INSTITUTION: Institution = {
  id: 'inst-gatik',
  name: 'Gatik Jr. College',
  address: 'R.K. Puram, New Delhi, Delhi',
  provider: 'manual',
  verified: false,
}

export const MOCK_INSTITUTIONS: Institution[] = [
  MOCK_INSTITUTION,
  MOCK_GATIK_INSTITUTION,
  {
    id: 'inst-2',
    name: 'Kendriya Vidyalaya, IIT Delhi',
    address: 'Hauz Khas, New Delhi, Delhi 110016',
    place_id: 'ChIJxxxxxxxxxxxxxxxx',
    provider: 'google',
    verified: true,
  },
  {
    id: 'inst-3',
    name: 'St. Columba\'s School',
    address: 'Ashok Place, New Delhi, Delhi 110001',
    provider: 'osm',
    verified: false,
  },
]

// ---------- Profiles ----------

export const MOCK_CURRENT_USER: Profile = {
  id: 'user-1',
  full_name: 'Navya Sharma',
  account_type: 'student',
  institution_id: MOCK_GATIK_INSTITUTION.id,
  institution: MOCK_GATIK_INSTITUTION,
  grade: '12',
  stream: 'Science',
  avatar_url: undefined,
  created_at: '2024-08-01T10:00:00Z',
}

export const MOCK_ORGANIZER: Profile = {
  id: 'user-2',
  full_name: 'Arjun Mehta',
  account_type: 'student',
  institution_id: 'inst-1',
  institution: MOCK_INSTITUTION,
  grade: '12',
  stream: 'Commerce',
  avatar_url: undefined,
  created_at: '2024-07-15T09:30:00Z',
}

export const MOCK_XPLORER_ORGANIZER: Profile = {
  ...MOCK_ORGANIZER,
  institution_id: MOCK_GATIK_INSTITUTION.id,
  institution: MOCK_GATIK_INSTITUTION,
}

export const MOCK_STAFF: Profile = {
  id: 'user-3',
  full_name: 'Dr. Priya Nair',
  account_type: 'staff',
  institution_id: 'inst-1',
  institution: MOCK_INSTITUTION,
  designation: 'HOD – Computer Science',
  avatar_url: undefined,
  created_at: '2024-06-01T08:00:00Z',
}

export const MOCK_PROFILES: Profile[] = [
  MOCK_CURRENT_USER,
  MOCK_ORGANIZER,
  MOCK_STAFF,
]

// ---------- Events ----------

const CALENDAR_DEMO_DETAILS = {
  summary: 'A student-led campus event made for curious minds and new connections.',
  schedule: [],
  rules: [],
  prizes: [],
  faqs: [],
  contacts: [],
  open_questions: [],
}

function createCalendarDemoEvents(): Event[] {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 11)
  const monthLength = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const daySlots = [2, 5, 8, 11, 14, 18, 22, 27]
  const events = [
    { title: 'Build for Good: Mini Hackathon', type: 'hackathon', mode: 'offline', venue: 'Innovation Lab', cost: 0 },
    { title: 'Open Mic Under the Stars', type: 'cultural', mode: 'offline', venue: 'Central Courtyard', cost: 100 },
    { title: 'Design Your First App', type: 'workshop', mode: 'online', venue: 'Online workshop', cost: 0 },
    { title: 'Inter-house Badminton Cup', type: 'sports', mode: 'offline', venue: 'Sports Pavilion', cost: 0 },
    { title: 'Youth Parliament: City Edition', type: 'mun', mode: 'offline', venue: 'Seminar Hall', cost: 150 },
    { title: 'Startup Pitch Night', type: 'other', mode: 'offline', venue: 'Auditorium', cost: 0 },
    { title: 'Sketchbook Social', type: 'cultural', mode: 'offline', venue: 'Arts Studio', cost: 50 },
    { title: 'Study Jam: Finals Edition', type: 'other', mode: 'online', venue: 'Online study room', cost: 0 },
  ] satisfies {
    title: string
    type: Event['type']
    mode: Event['mode']
    venue: string
    cost: number
  }[]

  return events.map((item, index) => {
    const date = new Date(monthStart)
    date.setDate(Math.min(daySlots[index], monthLength))
    const endsAt = new Date(date)
    endsAt.setHours(endsAt.getHours() + 3)

    return {
      id: `evt-demo-${index + 1}`,
      slug: `campus-demo-${index + 1}`,
      owner_id: 'user-2',
      title: item.title,
      description_structured: CALENDAR_DEMO_DETAILS,
      type: item.type,
      mode: item.mode,
      venue: item.venue,
      starts_at: date.toISOString(),
      ends_at: endsAt.toISOString(),
      cost_amount: item.cost,
      registration_mode: 'direct',
      eligibility: { type: 'open', account_types: ['student', 'staff'] },
      capacity: 80,
      status: 'published',
      created_at: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    } satisfies Event
  })
}

export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt-1',
    slug: 'xplorer-2026',
    owner_id: 'user-2',
    owner: MOCK_XPLORER_ORGANIZER,
    title: 'Xplorer',
    description_structured: {
      summary:
        'Xplorer is a high-energy, overnight buildathon for curious minds who want to turn bold ideas into things people can actually use. Teams will spend 24 hours exploring problems around them, sketching a direction, and building a working prototype with support from mentors across design, product, and code. Beginners are welcome: bring a question, a half-formed idea, or just the urge to make something. Leave with a demo, new collaborators, and a story worth telling.',
      schedule: [
        { time: '09:00', title: 'Doors open, breakfast & team check-in' },
        { time: '10:00', title: 'Welcome, challenge reveal & idea sprint' },
        { time: '12:00', title: 'Build mode begins — mentors on the floor' },
        { time: '19:00', title: 'Show-and-tell checkpoint & dinner break' },
        { time: '02:00', title: 'Midnight maker break: snacks, games & fresh eyes' },
        { time: '08:00', title: 'Final polish and project submissions' },
        { time: '10:00', title: 'Live demos, awards & closing celebration' },
      ],
      rules: [
        'Build solo or in a team of up to four people. We can help match solo participants.',
        'Projects should be created during the event; open-source tools and public APIs are welcome.',
        'No experience level is required. Thoughtful problem-solving matters more than a perfect pitch.',
        'Bring a laptop, charger, student ID, and anything that helps you think clearly.',
      ],
      prizes: ['Best Overall Build: ₹10,000 team grant', 'People’s Choice: maker-kit bundle', 'Best First Build: mentor session + project spotlight'],
      faqs: [
        {
          question: 'Do I need to know how to code?',
          answer: 'Not at all. Designers, storytellers, researchers, and first-time builders are all welcome.',
        },
        {
          question: 'Can I come without a team?',
          answer: 'Yes. We will run a friendly team-matching session at check-in.',
        },
        {
          question: 'What should I bring?',
          answer: 'Bring your laptop, charger, student ID, and a reusable water bottle. Meals and late-night snacks are covered.',
        },
      ],
      contacts: [
        { name: 'Arjun Mehta', role: 'Xplorer student lead' },
        { name: 'Gatik Innovation Club', role: 'Campus host' },
      ],
      open_questions: ['What is one small thing on campus you wish worked better?'],
    },
    type: 'hackathon',
    mode: 'offline',
    venue: 'Gatik Jr. College, Innovation Hall',
    starts_at: '2026-10-31T03:30:00Z',
    ends_at: '2026-11-01T04:30:00Z',
    cost_amount: 0,
    registration_mode: 'screened',
    eligibility: {
      type: 'open',
      account_types: ['student'],
    },
    capacity: 120,
    cover_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1800&q=85',
    status: 'published',
    created_at: '2026-10-01T12:00:00Z',
    member_role: 'participant',
  },
  {
    id: 'evt-2',
    slug: 'mun-winter-2027',
    owner_id: 'user-3',
    owner: MOCK_STAFF,
    title: 'DPSMUN Winter 2027',
    description_structured: {
      summary:
        'Annual Model United Nations conference hosted by DPS RK Puram. Six committees, 300+ delegates.',
      schedule: [
        { time: 'Day 1 – 08:30', title: 'Opening ceremony & committee session I' },
        { time: 'Day 2 – 09:00', title: 'Committee sessions II & III' },
        { time: 'Day 3 – 14:00', title: 'Closing ceremony & awards' },
      ],
      rules: ['Delegates must submit a position paper 10 days before the conference.'],
      prizes: ['Best Delegate', 'Outstanding Delegate', 'High Commendation'],
      faqs: [
        {
          question: 'Can students from other schools apply?',
          answer: 'Yes — it is open to all schools.',
        },
      ],
      contacts: [
        { name: 'Dr. Priya Nair', role: 'Faculty Advisor', email: 'priya@dpsrkp.net' },
      ],
      open_questions: [],
    },
    type: 'mun',
    mode: 'offline',
    venue: 'DPS RK Puram, Auditorium',
    starts_at: '2027-01-23T08:30:00Z',
    ends_at: '2027-01-25T17:00:00Z',
    cost_amount: 500,
    registration_mode: 'screened',
    eligibility: {
      type: 'open',
      account_types: ['student'],
    },
    capacity: 300,
    status: 'published',
    created_at: '2026-09-20T10:00:00Z',
  },
  {
    id: 'evt-3',
    slug: 'annual-sports-day-2026',
    owner_id: 'user-3',
    owner: MOCK_STAFF,
    title: 'Annual Sports Day 2026',
    description_structured: {
      summary:
        'Celebrate athletic excellence at our school\'s annual sports day. Track events, team sports, and relays for all grades.',
      schedule: [
        { time: '07:30', title: 'March past & parade' },
        { time: '08:30', title: 'Track events begin' },
        { time: '15:00', title: 'Prize distribution' },
      ],
      rules: ['Students must register for their house team events through the form.'],
      prizes: ['Rolling trophy for the winning house'],
      faqs: [],
      contacts: [
        { name: 'Coach Ramesh', role: 'Sports Teacher', phone: '9876543210' },
      ],
      open_questions: [],
    },
    type: 'sports',
    mode: 'offline',
    venue: 'DPS RK Puram, Sports Complex',
    starts_at: '2026-11-20T07:30:00Z',
    ends_at: '2026-11-20T17:00:00Z',
    cost_amount: 0,
    registration_mode: 'direct',
    eligibility: {
      type: 'my_institution',
      account_types: ['student'],
    },
    status: 'published',
    created_at: '2026-09-25T08:00:00Z',
    member_role: 'participant',
  },
  {
    id: 'evt-4',
    slug: 'ai-workshop-dec-2026',
    owner_id: 'user-2',
    owner: MOCK_ORGANIZER,
    title: 'Introduction to AI/ML Workshop',
    description_structured: {
      summary:
        'A hands-on beginner workshop on machine learning with Python. No prior experience required.',
      schedule: [
        { time: '10:00', title: 'What is Machine Learning?' },
        { time: '11:00', title: 'Python + Scikit-learn hands-on' },
        { time: '13:00', title: 'Lunch break' },
        { time: '14:00', title: 'Build your first classifier' },
      ],
      rules: ['Bring a laptop with Python 3.10+ installed.'],
      prizes: [],
      faqs: [
        {
          question: 'Is this online or offline?',
          answer: 'Online via Google Meet. Link sent after registration.',
        },
      ],
      contacts: [{ name: 'Arjun Mehta', role: 'Workshop Lead' }],
      open_questions: [],
    },
    type: 'workshop',
    mode: 'online',
    venue: undefined,
    starts_at: '2026-12-05T10:00:00Z',
    ends_at: '2026-12-05T17:00:00Z',
    cost_amount: 0,
    registration_mode: 'direct',
    eligibility: {
      type: 'open',
      account_types: ['student', 'staff'],
    },
    capacity: 50,
    status: 'published',
    created_at: '2026-10-01T09:00:00Z',
  },
  {
    id: 'evt-5',
    slug: 'cultural-fest-2027',
    owner_id: 'user-2',
    owner: MOCK_ORGANIZER,
    title: 'Utsav – Annual Cultural Fest 2027',
    description_structured: {
      summary:
        'Two days of dance, music, drama, and art. Open to all students. Competitions across 15 categories.',
      schedule: [
        { time: 'Day 1 – 09:00', title: 'Opening ceremony & solo events' },
        { time: 'Day 2 – 09:00', title: 'Group events & grand finale' },
      ],
      rules: ['Each student may register for at most 3 individual events.'],
      prizes: ['Best Performer', 'Best Group Performance', 'Best Overall Institution'],
      faqs: [],
      contacts: [{ name: 'Cultural Committee', role: 'Organizer' }],
      open_questions: [],
    },
    type: 'cultural',
    mode: 'offline',
    venue: 'DPS RK Puram, Auditorium & Grounds',
    starts_at: '2027-02-06T09:00:00Z',
    ends_at: '2027-02-07T20:00:00Z',
    cost_amount: 200,
    registration_mode: 'direct',
    eligibility: {
      type: 'open',
      account_types: ['student'],
    },
    status: 'published',
    created_at: '2026-10-10T11:00:00Z',
    member_role: 'organizer',
  },
  ...createCalendarDemoEvents(),
]

// ---------- Events by role ----------

/** Events the current user is participating in. */
export const MOCK_PARTICIPATING_EVENTS: Event[] = [MOCK_EVENTS[0], MOCK_EVENTS[2]]

/** Events the current user is organizing. */
export const MOCK_ORGANIZING_EVENTS: Event[] = [MOCK_EVENTS[4]]

/** Events the current user is volunteering at. */
export const MOCK_VOLUNTEERING_EVENTS: Event[] = []

// ---------- Event Members ----------

export const MOCK_EVENT_MEMBERS: EventMember[] = [
  { event_id: 'evt-1', profile_id: 'user-2', role: 'owner', profile: MOCK_XPLORER_ORGANIZER },
  { event_id: 'evt-1', profile_id: 'user-1', role: 'volunteer', profile: MOCK_CURRENT_USER },
  { event_id: 'evt-5', profile_id: 'user-2', role: 'owner', profile: MOCK_ORGANIZER },
  { event_id: 'evt-5', profile_id: 'user-1', role: 'organizer', profile: MOCK_CURRENT_USER },
]

// ---------- Form Fields ----------

export const MOCK_FORM_FIELDS: FormField[] = [
  {
    id: 'ff-1',
    event_id: 'evt-1',
    label: 'Tell us about a project you built',
    type: 'long_text',
    required: true,
    position: 0,
  },
  {
    id: 'ff-2',
    event_id: 'evt-1',
    label: 'Team name (if you already have one)',
    type: 'short_text',
    required: false,
    position: 1,
  },
  {
    id: 'ff-3',
    event_id: 'evt-1',
    label: 'Preferred programming language',
    type: 'dropdown',
    options: ['Python', 'JavaScript', 'Java', 'C++', 'Other'],
    required: true,
    position: 2,
  },
]

// ---------- Screenings ----------

export const MOCK_SCREENING: Screening = {
  id: 'screen-1',
  registration_id: 'reg-1',
  transcript: [
    {
      role: 'ai',
      content: 'Hi! Tell me about a technical project you\'re proud of.',
      timestamp: '2025-01-11T10:00:00Z',
    },
    {
      role: 'user',
      content:
        'I built a web app that tracks the school bus in real time using GPS. It used React and Firebase.',
      timestamp: '2025-01-11T10:01:00Z',
    },
    {
      role: 'ai',
      content: 'That\'s impressive! What was the hardest part of building it?',
      timestamp: '2025-01-11T10:01:30Z',
    },
    {
      role: 'user',
      content: 'Getting the real-time updates to work smoothly without draining the phone battery.',
      timestamp: '2025-01-11T10:02:15Z',
    },
  ],
  score: 82,
  strengths: ['Practical problem-solving', 'Real-world project experience', 'Clear communication'],
  concerns: ['Limited team collaboration experience mentioned'],
  summary:
    'Strong candidate with hands-on experience building a real-world web application. Demonstrated ability to tackle technical challenges independently. Would benefit from collaborative project experience.',
  recommendation: 'Accept',
  created_at: '2025-01-11T10:05:00Z',
}

// ---------- Registrations ----------

export const MOCK_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-1',
    event_id: 'evt-1',
    profile_id: 'user-1',
    profile: MOCK_CURRENT_USER,
    answers: {
      'ff-1': 'I built a school bus tracker using React and Firebase.',
      'ff-2': 'Team Pixel',
      'ff-3': 'JavaScript',
    },
    status: 'accepted',
    created_at: '2025-01-11T09:50:00Z',
    screening: MOCK_SCREENING,
  },
  {
    id: 'reg-2',
    event_id: 'evt-1',
    profile_id: 'user-3',
    profile: MOCK_STAFF,
    answers: {
      'ff-1': 'I built a student performance analytics dashboard for our school.',
      'ff-2': 'Team Alpha',
      'ff-3': 'Python',
    },
    status: 'submitted',
    created_at: '2025-01-11T11:00:00Z',
  },
]

// ---------- Broadcasts ----------

export const MOCK_BROADCASTS: Broadcast[] = [
  {
    id: 'bc-1',
    event_id: 'evt-1',
    author_id: 'user-2',
    author: MOCK_ORGANIZER,
    audience: 'everyone',
    body: 'Welcome to CodeStorm 2025! Check-in opens at 8:30 AM. Please bring your student ID.',
    created_at: '2025-03-14T18:00:00Z',
  },
  {
    id: 'bc-2',
    event_id: 'evt-1',
    author_id: 'user-2',
    author: MOCK_ORGANIZER,
    audience: 'participants',
    body: 'Reminder: submit your team names by tonight 11:59 PM to be eligible for the opening draw.',
    created_at: '2025-03-14T20:30:00Z',
  },
]

// ---------- Announcements ----------

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    institution_id: 'inst-1',
    author_id: 'user-3',
    author: MOCK_STAFF,
    title: 'Half-day on 15th Feb — Sports Day Rehearsal',
    body: 'All students are required to attend the rehearsal. School will be dismissed at 12:30 PM.',
    created_at: '2025-02-10T09:00:00Z',
  },
  {
    id: 'ann-2',
    institution_id: 'inst-1',
    author_id: 'user-3',
    author: MOCK_STAFF,
    title: 'New Computer Lab rules effective immediately',
    body: 'No food or drinks inside the lab. Headphones must be kept in lockers. Repeated violations will result in restricted access.',
    created_at: '2025-02-05T11:00:00Z',
  },
  {
    id: 'ann-3',
    institution_id: 'inst-1',
    author_id: 'user-3',
    author: MOCK_STAFF,
    title: 'Library hours extended during project week',
    body: 'The senior reading room will stay open until 8 PM this week. Please carry your student ID and keep the quiet zone clear.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'ann-4',
    institution_id: 'inst-1',
    author_id: 'user-3',
    author: MOCK_STAFF,
    title: 'Volunteer sign-ups are open',
    body: 'Help welcome visiting teams at the inter-school showcase. Sign-ups close Friday afternoon at the student activity desk.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'ann-5',
    institution_id: 'inst-1',
    author_id: 'user-3',
    author: MOCK_STAFF,
    title: 'Bring a reusable bottle to Sports Day',
    body: 'Water refill stations will be available around the grounds. Let’s keep single-use plastic out of the stands.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'ann-6',
    institution_id: 'inst-1',
    author_id: 'user-3',
    author: MOCK_STAFF,
    title: 'Student showcase submissions',
    body: 'Have a project, performance, or club idea to share? Submit a short description to the activities office by next Wednesday.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
]

// ---------- Ideas ----------

export const MOCK_IDEAS: Idea[] = [
  {
    id: 'idea-1',
    institution_id: 'inst-1',
    body: 'Can we have a standing desk option in the library? Sitting for long hours is really uncomfortable.',
    status: 'under_review',
    upvote_count: 47,
    hidden: false,
    has_voted: false,
    created_at: '2025-01-28T14:00:00Z',
  },
  {
    id: 'idea-2',
    institution_id: 'inst-1',
    body: 'A school-wide recycling program with separate bins for paper, plastic, and wet waste in every classroom.',
    status: 'new',
    upvote_count: 31,
    hidden: false,
    has_voted: true,
    created_at: '2025-02-01T10:30:00Z',
  },
  {
    id: 'idea-3',
    institution_id: 'inst-1',
    body: 'Monthly inter-house coding challenges with a small prize would motivate a lot of students who aren\'t into sports.',
    status: 'done',
    upvote_count: 88,
    hidden: false,
    has_voted: false,
    created_at: '2025-01-10T09:00:00Z',
  },
  {
    id: 'idea-4',
    institution_id: 'inst-1',
    body: 'Could we have a monthly swap shelf for books, art supplies, and sports gear? It would make it easier to pass useful things along.',
    status: 'under_review',
    upvote_count: 63,
    hidden: false,
    has_voted: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 'idea-5',
    institution_id: 'inst-1',
    body: 'A shaded seating corner near the sports ground would be great for friends waiting between practice sessions.',
    status: 'new',
    upvote_count: 28,
    hidden: false,
    has_voted: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: 'idea-6',
    institution_id: 'inst-1',
    body: 'Can the cafeteria put a small sign next to each snack with allergy information and vegetarian options?',
    status: 'new',
    upvote_count: 42,
    hidden: false,
    has_voted: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: 'idea-7',
    institution_id: 'inst-1',
    body: 'A quiet room during lunch could help students who want to read, recharge, or study somewhere calm.',
    status: 'under_review',
    upvote_count: 51,
    hidden: false,
    has_voted: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
  },
  {
    id: 'idea-8',
    institution_id: 'inst-1',
    body: 'Could clubs share a simple monthly calendar so we can plan around each other and try something new?',
    status: 'done',
    upvote_count: 76,
    hidden: false,
    has_voted: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'idea-9',
    institution_id: 'inst-1',
    body: 'Let’s host a beginner-friendly chess and board-game afternoon where anyone can drop in.',
    status: 'new',
    upvote_count: 34,
    hidden: false,
    has_voted: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    id: 'idea-10',
    institution_id: 'inst-1',
    body: 'A student playlist for the annual fest would be fun. Could we collect clean song suggestions from each class?',
    status: 'under_review',
    upvote_count: 19,
    hidden: false,
    has_voted: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
]

// ---------- Notifications ----------

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notice-1',
    user_id: 'user-1',
    type: 'registration_status',
    title: 'You joined Xplorer',
    body: 'Your place is confirmed. Event details and schedule are ready in your workspace.',
    read: false,
    link: '/app/event/xplorer-2026',
    created_at: '2026-10-28T15:00:00Z',
  },
  {
    id: 'notice-2',
    user_id: 'user-1',
    type: 'announcement',
    title: 'A new campus announcement',
    body: 'The Computer Lab schedule has been updated for this term.',
    read: false,
    link: '/app/campus',
    created_at: '2026-10-27T09:30:00Z',
  },
  {
    id: 'notice-3',
    user_id: 'user-1',
    type: 'broadcast',
    title: 'Xplorer organizer update',
    body: 'Team registration closes one week before the event.',
    read: true,
    link: '/app/event/xplorer-2026',
    created_at: '2026-10-25T18:20:00Z',
  },
]
