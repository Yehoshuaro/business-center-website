import type { Role } from '@/shared/types';

/**
 * Accent colour + i18n key for each role.
 * `labelKey` resolves through `t()` in the dashboard chrome.
 */
export const ROLE_META: Record<Role, { labelKey: string; badgeClass: string }> = {
  admin: { labelKey: 'dashboard.roles.admin', badgeClass: 'badge-accent' },
  manager: { labelKey: 'dashboard.roles.manager', badgeClass: 'badge-warning' },
  viewer: { labelKey: 'dashboard.roles.viewer', badgeClass: 'badge-success' },
};

export interface NavItem {
  to: string;
  /** i18n key, resolved with t() in the navigation. */
  labelKey: string;
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
  { to: '/dashboard', labelKey: 'dashboard.nav.overview', icon: 'LayoutDashboard', roles: ['admin', 'manager', 'viewer'], end: true, section: 'main' },

  // Tenant (viewer) self-service
  { to: '/dashboard/my-spaces', labelKey: 'dashboard.nav.mySpaces', icon: 'Building2', roles: ['viewer'], section: 'tenant' },
  { to: '/dashboard/invoices', labelKey: 'dashboard.nav.invoices', icon: 'Receipt', roles: ['viewer'], section: 'tenant' },

  // CRM management
  { to: '/dashboard/spaces', labelKey: 'dashboard.nav.spaces', icon: 'Building', roles: ['admin', 'manager'], section: 'manage' },
  { to: '/dashboard/tenants', labelKey: 'dashboard.nav.tenants', icon: 'Briefcase', roles: ['admin', 'manager'], section: 'manage' },
  { to: '/dashboard/leads', labelKey: 'dashboard.nav.leads', icon: 'Target', roles: ['admin', 'manager'], section: 'manage' },
  { to: '/dashboard/bookings', labelKey: 'dashboard.nav.bookings', icon: 'CalendarDays', roles: ['admin', 'manager'], section: 'manage' },
  { to: '/dashboard/maintenance', labelKey: 'dashboard.nav.maintenance', icon: 'Wrench', roles: ['admin', 'manager', 'viewer'], section: 'manage' },

  // Admin only
  { to: '/dashboard/users', labelKey: 'dashboard.nav.users', icon: 'Users', roles: ['admin'], section: 'admin' },
  { to: '/dashboard/settings', labelKey: 'dashboard.nav.settings', icon: 'Settings', roles: ['admin'], section: 'admin' },
];

export const SECTION_LABELS: Record<NavItem['section'], string> = {
  main: 'dashboard.sections.main',
  tenant: 'dashboard.sections.tenant',
  manage: 'dashboard.sections.manage',
  admin: 'dashboard.sections.admin',
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
