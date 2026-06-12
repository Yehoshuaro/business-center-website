import type { Role } from '@/shared/types';

/** Human label + accent colour for each role. */
export const ROLE_META: Record<Role, { label: string; badgeClass: string }> = {
  admin: { label: 'Administrator', badgeClass: 'badge-accent' },
  manager: { label: 'Manager', badgeClass: 'badge-warning' },
  viewer: { label: 'Tenant', badgeClass: 'badge-success' },
};

export interface NavItem {
  to: string;
  label: string;
  icon: string; // lucide icon name
  roles: Role[];
  /** End match for index route. */
  end?: boolean;
  section: 'main' | 'manage' | 'admin' | 'tenant';
}

/**
 * Single source of truth for dashboard navigation AND route authorization.
 * A route is accessible to a role iff that role appears in `roles`.
 */
export const DASHBOARD_NAV: NavItem[] = [
  { to: '/dashboard', label: 'Overview', icon: 'LayoutDashboard', roles: ['admin', 'manager', 'viewer'], end: true, section: 'main' },

  // Tenant (viewer) self-service
  { to: '/dashboard/my-spaces', label: 'My Spaces', icon: 'Building2', roles: ['viewer'], section: 'tenant' },
  { to: '/dashboard/invoices', label: 'Invoices', icon: 'Receipt', roles: ['viewer'], section: 'tenant' },

  // CRM management
  { to: '/dashboard/spaces', label: 'Spaces', icon: 'Building', roles: ['admin', 'manager'], section: 'manage' },
  { to: '/dashboard/tenants', label: 'Tenants', icon: 'Briefcase', roles: ['admin', 'manager'], section: 'manage' },
  { to: '/dashboard/leads', label: 'Leads', icon: 'Target', roles: ['admin', 'manager'], section: 'manage' },
  { to: '/dashboard/bookings', label: 'Bookings', icon: 'CalendarDays', roles: ['admin', 'manager'], section: 'manage' },
  { to: '/dashboard/maintenance', label: 'Maintenance', icon: 'Wrench', roles: ['admin', 'manager', 'viewer'], section: 'manage' },

  // Admin only
  { to: '/dashboard/users', label: 'Users & Roles', icon: 'Users', roles: ['admin'], section: 'admin' },
  { to: '/dashboard/settings', label: 'Settings', icon: 'Settings', roles: ['admin'], section: 'admin' },
];

export const SECTION_LABELS: Record<NavItem['section'], string> = {
  main: 'Overview',
  tenant: 'My Account',
  manage: 'Management',
  admin: 'Administration',
};

/** Whether a role may access a given dashboard path. */
export const canAccess = (role: Role, path: string): boolean => {
  // Normalise to the matching nav entry (longest prefix wins for nested paths).
  const match = [...DASHBOARD_NAV]
    .sort((a, b) => b.to.length - a.to.length)
    .find((n) => (n.end ? path === n.to : path === n.to || path.startsWith(n.to + '/')));
  if (!match) return true; // unknown sub-route — let the page itself decide
  return match.roles.includes(role);
};
