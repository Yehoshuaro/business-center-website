import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Presentation,
  Users,
  ClipboardList,
  UserCog,
  Settings,
  Menu,
  X,
  LogOut,
  ExternalLink,
  Newspaper,
  Images,
} from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useAuthStore } from '@/features/auth/store';
import { useSettingsStore } from '@/features/settings/store';
import { LanguageSwitcher, ThemeSwitcher } from './Switchers';
import { BrandMark } from '@/shared/components/ui/BrandMark';
import { cn } from '@/shared/utils';

const navItems = [
  { to: '/site/admin', icon: LayoutDashboard, key: 'admin.dashboard', end: true },
  { to: '/site/admin/offices', icon: Building2, key: 'admin.offices' },
  { to: '/site/admin/conference-rooms', icon: Presentation, key: 'admin.conferenceRooms' },
  { to: '/site/admin/tenants', icon: Users, key: 'admin.tenants' },
  { to: '/site/admin/gallery', icon: Images, key: 'admin.gallery' },
  { to: '/site/admin/news', icon: Newspaper, key: 'admin.news' },
  { to: '/site/admin/leads', icon: ClipboardList, key: 'admin.leads' },
  { to: '/site/admin/users', icon: UserCog, key: 'admin.users' },
  { to: '/site/admin/settings', icon: Settings, key: 'admin.settings' },
];

export const AdminLayout = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const signOut = useAuthStore((s) => s.signOut);
  const session = useAuthStore((s) => s.session);
  const settings = useSettingsStore((s) => s.settings);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => setDrawerOpen(false), [pathname]);

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => window.innerWidth >= 1024 && setDrawerOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Escape close + body lock
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  const handleSignOut = () => {
    signOut();
    navigate('/site');
  };

  return (
    <div className="min-h-screen flex bg-surface-2 text-ink">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-60 xl:w-64 flex-col bg-surface border-r border-line shrink-0">
        <div className="h-16 flex items-center gap-3 px-5 border-b border-line">
          <BrandMark size="sm" />
          <span className="text-sm font-medium tracking-tight truncate">
            {settings.businessCenterName}
          </span>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-5 py-2.5 text-sm border-l-2 transition-colors',
                  isActive
                    ? 'border-accent bg-surface-2 text-ink font-medium'
                    : 'border-transparent text-ink-muted hover:text-ink hover:bg-surface-2',
                )
              }
            >
              <item.icon size={16} strokeWidth={1.75} />
              <span className="truncate">{t(item.key)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-line">
          <NavLink to="/site" className="flex items-center gap-2 text-xs text-ink-muted hover:text-ink mb-2">
            <ExternalLink size={13} /> {t('nav.home')}
          </NavLink>
          <NavLink to="/" className="flex items-center gap-2 text-xs text-ink-muted hover:text-ink mb-3">
            <ExternalLink size={13} /> {t('common.exitDemo')}
          </NavLink>
          <div className="text-xs text-ink-muted truncate">{session?.email}</div>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-3 btn-secondary btn-sm w-full"
          >
            <LogOut size={14} /> {t('common.logout')}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85%] bg-surface border-r border-line flex flex-col">
            <div className="h-16 flex items-center justify-between gap-3 px-5 border-b border-line shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <BrandMark size="sm" />
                <span className="text-sm font-medium tracking-tight truncate">
                  {settings.businessCenterName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex items-center justify-center w-10 h-10 -mr-2"
                aria-label={t('common.cancel')}
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 py-3 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-5 py-3 text-sm border-l-2',
                      isActive
                        ? 'border-accent bg-surface-2 text-ink font-medium'
                        : 'border-transparent text-ink-muted',
                    )
                  }
                >
                  <item.icon size={16} strokeWidth={1.75} />
                  <span className="truncate">{t(item.key)}</span>
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-line shrink-0">
              <NavLink
                to="/site"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-2 text-xs text-ink-muted hover:text-ink mb-2"
              >
                <ExternalLink size={13} /> {t('nav.home')}
              </NavLink>
              <NavLink
                to="/"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-2 text-xs text-ink-muted hover:text-ink mb-3"
              >
                <ExternalLink size={13} /> {t('common.exitDemo')}
              </NavLink>
              {session?.email && (
                <div className="text-xs text-ink-muted truncate mb-3">{session.email}</div>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="btn-secondary btn-sm w-full"
              >
                <LogOut size={14} /> {t('common.logout')}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 sticky top-0 z-30 bg-surface border-b border-line flex items-center justify-between gap-2 px-3 sm:px-4 md:px-6">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 -ml-2"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="text-xs uppercase tracking-wider text-ink-muted truncate">
              {t('nav.admin')}
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </header>

        <main className="flex-1 min-w-0 p-4 sm:p-5 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
