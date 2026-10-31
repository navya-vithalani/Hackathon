/**
 * nav.ts — Shared navigation item definitions.
 * Used by BottomNav and Sidebar to keep items in sync.
 */
import { Home, CalendarDays, PlusCircle, Building2, User, Bell } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
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
  { label: 'Home',      href: ROUTES.APP_HOME,      icon: Home,        exact: true },
  { label: 'My Events', href: ROUTES.APP_MY_EVENTS, icon: CalendarDays },
  { label: 'Create',    href: ROUTES.APP_CREATE,    icon: PlusCircle },
  { label: 'Campus',    href: ROUTES.APP_CAMPUS,    icon: Building2 },
  { label: 'Profile',   href: ROUTES.APP_PROFILE,   icon: User },
];

/** Inbox / notifications — shown in Sidebar and TopBar. */
export const INBOX_NAV: NavItem = {
  label: 'Inbox', href: ROUTES.APP_INBOX, icon: Bell,
};
