/**
 * nav.ts — Shared navigation item definitions.
 * Used by BottomNav and Sidebar to keep items in sync.
 */
import { Home, CalendarDays, PlusCircle, Building2, User, Bell } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** If true, only mark active on exact path match */
  exact?: boolean;
}

/** Primary nav items — appear in both BottomNav and Sidebar. */
export const MAIN_NAV: NavItem[] = [
  { label: 'Home',      href: '/app',          icon: Home,        exact: true },
  { label: 'My Events', href: '/app/events',   icon: CalendarDays },
  { label: 'Create',    href: '/app/create',   icon: PlusCircle,  exact: true },
  { label: 'Campus',    href: '/app/campus',   icon: Building2 },
  { label: 'Profile',   href: '/app/profile',  icon: User },
];

/** Inbox / notifications — shown in Sidebar and TopBar. */
export const INBOX_NAV: NavItem = {
  label: 'Inbox', href: '/app/inbox', icon: Bell,
};
