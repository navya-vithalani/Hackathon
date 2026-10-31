/**
 * src/lib/constants/eventTypes.ts — Display metadata for event-related enums.
 * Used by event creation forms, filters, badges, and listing pages.
 */

import type {
  EventType,
  EventMode,
  RegistrationMode,
  BroadcastAudience,
  IdeaStatus,
} from '@/types';

// ─── Event Types ─────────────────────────────────────────────────────────────

export const EVENT_TYPES: { value: EventType; label: string; icon: string }[] = [
  { value: 'sports',    label: 'Sports',     icon: '🏆' },
  { value: 'hackathon', label: 'Hackathon',  icon: '💻' },
  { value: 'mun',       label: 'MUN',        icon: '🌐' },
  { value: 'cultural',  label: 'Cultural',   icon: '🎭' },
  { value: 'workshop',  label: 'Workshop',   icon: '🔧' },
  { value: 'other',     label: 'Other',      icon: '📌' },
];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  sports:    'Sports',
  hackathon: 'Hackathon',
  mun:       'MUN',
  cultural:  'Cultural',
  workshop:  'Workshop',
  other:     'Other',
};

// ─── Event Modes ─────────────────────────────────────────────────────────────

export const EVENT_MODES: { value: EventMode; label: string }[] = [
  { value: 'offline', label: 'In-Person' },
  { value: 'online',  label: 'Online' },
];

// ─── Eligibility Types ───────────────────────────────────────────────────────

export const ELIGIBILITY_TYPES: {
  value: 'open' | 'my_institution' | 'specific_institutions' | 'grade_range';
  label: string;
  description: string;
}[] = [
  {
    value: 'open',
    label: 'Open to All',
    description: 'Anyone can register, regardless of institution.',
  },
  {
    value: 'my_institution',
    label: 'My Institution Only',
    description: 'Only members of the organising institution can register.',
  },
  {
    value: 'specific_institutions',
    label: 'Specific Institutions',
    description: 'Only members of selected institutions can register.',
  },
  {
    value: 'grade_range',
    label: 'Grade Range',
    description: 'Open only to students within a specified grade range.',
  },
];

// ─── Registration Modes ───────────────────────────────────────────────────────

export const REGISTRATION_MODES: {
  value: RegistrationMode;
  label: string;
  description: string;
}[] = [
  {
    value: 'direct',
    label: 'Direct Registration',
    description: 'Anyone eligible can register immediately — no approval needed.',
  },
  {
    value: 'screened',
    label: 'AI-Screened Registration',
    description:
      'Applicants go through a short AI interview before organizers accept or reject them.',
  },
];

// ─── Broadcast Audiences ─────────────────────────────────────────────────────

export const BROADCAST_AUDIENCES: { value: BroadcastAudience; label: string }[] = [
  { value: 'everyone',         label: 'Everyone' },
  { value: 'participants',     label: 'Participants' },
  { value: 'volunteers',       label: 'Volunteers' },
  { value: 'organizing_team',  label: 'Organising Team' },
  { value: 'selected_people',  label: 'Selected People' },
];

// ─── Idea Statuses ────────────────────────────────────────────────────────────

export const IDEA_STATUSES: {
  value: IdeaStatus;
  label: string;
  /** Tailwind semantic color classes for the status chip */
  color: string;
}[] = [
  { value: 'new',          label: 'New',          color: 'bg-blue-100 text-blue-800' },
  { value: 'under_review', label: 'Under Review',  color: 'bg-yellow-100 text-yellow-800' },
  { value: 'done',         label: 'Done',          color: 'bg-green-100 text-green-800' },
];
