import {
  // nav + sections
  LayoutDashboard, Building, Building2, Briefcase, Target, CalendarDays, Wrench, Users, Settings,
  Receipt, User, DoorOpen, Lock, Globe, TrendingUp, CircleCheck, Clock, CalendarCheck, CircleDot,
  Loader, Files, ShieldCheck, Inbox, SearchX, Search, CheckCircle2, Square,
  // services / amenities
  Car, Wifi, Coffee, Leaf,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Explicit registry of the icons referenced dynamically by name across the app
 * (services, dashboard nav, metric cards, empty states). Keeping this list
 * explicit lets the bundler tree-shake the rest of lucide-react.
 */
export const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, Building, Building2, Briefcase, Target, CalendarDays, Wrench, Users, Settings,
  Receipt, User, DoorOpen, Lock, Globe, TrendingUp, CircleCheck, Clock, CalendarCheck, CircleDot,
  Loader, Files, ShieldCheck, Inbox, SearchX, Search, CheckCircle2, Square,
  Car, Wifi, Coffee, Leaf,
};
