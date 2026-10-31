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

export const MOCK_INSTITUTIONS: Institution[] = [
  MOCK_INSTITUTION,
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
  institution_id: 'inst-1',
  institution: MOCK_INSTITUTION,
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

export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt-1',
    slug: 'code-storm-2026',
    owner_id: 'user-2',
    owner: MOCK_ORGANIZER,
    title: 'CodeStorm 2026',
    description_structured: {
      summary:
        'A 24-hour hackathon open to all high school students. Build something that solves a real problem in your school or community.',
      schedule: [
        { time: '09:00', title: 'Registration & Kit collection' },
        { time: '10:00', title: 'Hacking begins' },
        { time: '10:00 (next day)', title: 'Submissions close' },
        { time: '14:00 (next day)', title: 'Presentations & judging' },
      ],
      rules: [
        'Teams of 2–4 members.',
        'All code must be written during the event.',
        'Use of public APIs and open-source libraries is allowed.',
      ],
      prizes: ['1st place: ₹10,000', '2nd place: ₹6,000', '3rd place: ₹3,000'],
      faqs: [
        {
          question: 'Is prior coding experience required?',
          answer: 'No — beginners are welcome! Mentors will be present.',
        },
      ],
      contacts: [
        { name: 'Arjun Mehta', role: 'Lead Organizer', email: 'arjun@dpsrkp.net' },
      ],
      open_questions: [],
    },
    type: 'hackathon',
    mode: 'offline',
    venue: 'DPS RK Puram, Main Hall',
    starts_at: '2026-12-12T09:00:00Z',
    ends_at: '2026-12-13T18:00:00Z',
    cost_amount: 0,
    registration_mode: 'screened',
    eligibility: {
      type: 'open',
      account_types: ['student'],
    },
    capacity: 200,
    cover_url: undefined,
    status: 'published',
    created_at: '2026-09-10T12:00:00Z',
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
  { event_id: 'evt-1', profile_id: 'user-2', role: 'owner', profile: MOCK_ORGANIZER },
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
]

// ---------- Notifications ----------

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notice-1',
    user_id: 'user-1',
    type: 'registration_status',
    title: 'You are registered for CodeStorm 2026',
    body: 'Your place is confirmed. Event details and schedule are ready in your workspace.',
    read: false,
    link: '/app/event/code-storm-2026',
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
    title: 'CodeStorm organizer update',
    body: 'Team registration closes one week before the event.',
    read: true,
    link: '/app/event/code-storm-2026',
    created_at: '2026-10-25T18:20:00Z',
  },
]
