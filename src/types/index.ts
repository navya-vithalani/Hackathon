/**
 * src/types/index.ts — Shared TypeScript types for the entire hivai app.
 * Used by all components, server actions, API routes, and utilities.
 */

// ─── Primitive Union Types ────────────────────────────────────────────────────

export type AccountType = 'student' | 'staff';

export type EventRole = 'owner' | 'organizer' | 'volunteer' | 'participant';

export type EventType =
  | 'sports'
  | 'hackathon'
  | 'mun'
  | 'cultural'
  | 'workshop'
  | 'other';

export type EventMode = 'online' | 'offline';

export type EventStatus = 'draft' | 'published' | 'closed';

export type RegistrationMode = 'direct' | 'screened';

export type RegistrationStatus =
  | 'submitted'
  | 'accepted'
  | 'rejected'
  | 'waitlisted'
  | 'checked_in';

export type PaymentStatus = 'pending' | 'paid' | 'rejected';

export type BroadcastAudience =
  | 'everyone'
  | 'participants'
  | 'volunteers'
  | 'organizing_team'
  | 'selected_people';

export type IdeaStatus = 'new' | 'under_review' | 'done';

export type InstitutionProvider = 'google' | 'osm' | 'manual';

// ─── Core Entity Interfaces ───────────────────────────────────────────────────

export interface Institution {
  id: string;
  name: string;
  address: string;
  place_id?: string;
  provider: InstitutionProvider;
  verified: boolean;
}

export interface Profile {
  id: string;
  full_name: string;
  account_type: AccountType;
  institution_id: string;
  institution?: Institution;
  /** For students: e.g. "11", "12" */
  grade?: string;
  /** For students: e.g. "Science", "Commerce" */
  stream?: string;
  /** For staff: e.g. "HOD", "Teacher" */
  designation?: string;
  avatar_url?: string;
  created_at: string;
}

// ─── Event Sub-Types ──────────────────────────────────────────────────────────

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Contact {
  name: string;
  role: string;
  email?: string;
  phone?: string;
}

export interface EventStructured {
  summary: string;
  schedule: ScheduleItem[];
  rules: string[];
  prizes: string[];
  faqs: FAQ[];
  contacts: Contact[];
  open_questions: string[];
}

export interface ScreeningCriteria {
  description: string;
  num_questions: number;
  tone: 'friendly' | 'neutral' | 'rigorous';
}

export interface EventEligibility {
  type: 'open' | 'my_institution' | 'specific_institutions' | 'grade_range';
  institution_ids?: string[];
  min_grade?: string;
  max_grade?: string;
  account_types?: AccountType[];
}

// ─── Event ────────────────────────────────────────────────────────────────────

export interface Event {
  id: string;
  slug: string;
  owner_id: string;
  title: string;
  description_structured?: EventStructured;
  type: EventType;
  mode: EventMode;
  venue?: string;
  starts_at: string;
  ends_at: string;
  /** 0 = free */
  cost_amount: number;
  payment_qr_url?: string;
  registration_mode: RegistrationMode;
  screening_criteria?: ScreeningCriteria;
  eligibility: EventEligibility;
  capacity?: number;
  cover_url?: string;
  status: EventStatus;
  created_at: string;
  /** Populated when fetched with JOIN */
  owner?: Profile;
  /** Role of the currently authenticated user, if any */
  member_role?: EventRole;
}

// ─── Event Membership ─────────────────────────────────────────────────────────

export interface EventMember {
  event_id: string;
  profile_id: string;
  role: EventRole;
  profile?: Profile;
}

// ─── Registration & Screening ─────────────────────────────────────────────────

export interface FormField {
  id: string;
  event_id: string;
  label: string;
  type: 'short_text' | 'long_text' | 'number' | 'dropdown' | 'checkbox' | 'file';
  options?: string[];
  required: boolean;
  position: number;
}

export interface TranscriptMessage {
  role: 'ai' | 'user';
  content: string;
  timestamp: string;
}

export interface Screening {
  id: string;
  registration_id: string;
  transcript: TranscriptMessage[];
  score: number;
  strengths: string[];
  concerns: string[];
  summary: string;
  recommendation: string;
  created_at: string;
}

export interface Registration {
  id: string;
  event_id: string;
  profile_id: string;
  /** Answers keyed by FormField.id */
  answers: Record<string, unknown>;
  payment_status?: PaymentStatus;
  payment_proof_url?: string;
  status: RegistrationStatus;
  checked_in_at?: string;
  created_at: string;
  profile?: Profile;
  screening?: Screening;
}

// ─── Communication ────────────────────────────────────────────────────────────

export interface Broadcast {
  id: string;
  event_id: string;
  author_id: string;
  audience: BroadcastAudience;
  /** Only set when audience = 'selected_people' */
  audience_profile_ids?: string[];
  body: string;
  created_at: string;
  author?: Profile;
}

export interface Announcement {
  id: string;
  institution_id: string;
  author_id: string;
  title: string;
  body: string;
  created_at: string;
  author?: Profile;
}

// ─── Campus Features ──────────────────────────────────────────────────────────

export interface Idea {
  id: string;
  institution_id: string;
  body: string;
  status: IdeaStatus;
  upvote_count: number;
  hidden: boolean;
  created_at: string;
  /** Whether the currently authenticated user has upvoted */
  has_voted?: boolean;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  user_id: string;
  type: 'registration_status' | 'screening_result' | 'broadcast' | 'announcement';
  title: string;
  body: string;
  read: boolean;
  link?: string;
  created_at: string;
}

// ─── Derived / Composite Types ────────────────────────────────────────────────

/** Profile with an optional event-scoped role attached */
export type UserWithRole = Profile & { event_role?: EventRole };
