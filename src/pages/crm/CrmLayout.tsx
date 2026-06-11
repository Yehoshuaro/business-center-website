import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Handshake,
  Users,
  ListChecks,
  UserCog,
  Settings,
  Menu,
  X,
  LogOut,
  ArrowLeft,
  Eye,
} from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useCrmStore, useCrmCanEdit } from '@/features/crm/store';
import { LanguageSwitcher, ThemeSwitcher } from '@/shared/components/layout/Switchers';
import { cn } from '@/shared/utils';

const baseNav: { to: string; icon: typeof LayoutDashboard; key: string; end?: boolean }[] = [
  { to: '/crm', icon: LayoutDashboard, key: 'crm.nav.dashboard', end: true },
  { to: '/crm/deals', icon: Handshake, key: 'crm.nav.deals' },
  { to: '/crm/clients', icon: Users, key: 'crm.nav.clients' },
  { to: '/crm/tasks', icon: ListChecks, key: 'crm.nav.tasks' },
];

const adminNav: typeof baseNav = [
  { to: '/crm/users', icon: UserCog, key: 'crm.nav.users' },
  { to: '/crm/settings', icon: Settings, key: 'crm.nav.settings' },
];

export const CrmLayout = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const session = useCrmStore((s) => s.session);
  const signOut = useCrmStore((s) => s.signOut);
  const canEdit = useCrmCanEdit();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = session?.role === 'admin' ? [...baseNav, ...adminNav] : baseNav;

  useEffect(() => setDrawerOpen(false), [pathname]);

  useEffect(() => {
    const onResize = () => window.innerWidth >= 1024 && setDrawerOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
    navigate('/crm/login');
  };

  const SidebarInner = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
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
      <div className="p-4 border-t border-line shrink-0">
        <NavLink to="/" onClick={onNavigate} className="flex items-center gap-2 text-xs text-ink-muted hover:text-ink mb-3">
          <ArrowLeft size={13} /> {t('common.exitDemo')}
        </NavLink>
        {session && (
          <div className="mb-3 min-w-0">
            <div className="text-sm font-medium truncate">{session.name}</div>
            <div className="text-xs text-ink-muted truncate">{t(`crm.role.${session.role}`)}</div>
          </div>
        )}
        <button type="button" onClick={handleSignOut} className="btn-secondary btn-sm w-full">
          <LogOut size={14} /> {t('crm.signOut')}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-surface-2 text-ink">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-60 xl:w-64 flex-col bg-surface border-r border-line shrink-0">
        <div className="h-16 flex items-center gap-3 px-5 border-b border-line">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-accent text-accent-ink font-display text-base font-semibold shrink-0">
            Q
          </span>
          <span className="text-sm font-medium tracking-tight truncate">{t('crm.product')}</span>
        </div>
        <SidebarInner />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <aside className="relative w-72 max-w-[85%] bg-surface border-r border-line flex flex-col">
            <div className="h-16 flex items-center justify-between gap-3 px-5 border-b border-line shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-accent text-accent-ink font-display text-base font-semibold shrink-0">
                  Q
                </span>
                <span className="text-sm font-medium tracking-tight truncate">{t('crm.product')}</span>
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
            <SidebarInner onNavigate={() => setDrawerOpen(false)} />
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
              {t('crm.product')} · {t('common.demo')}
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </header>

        {!canEdit && (
          <div className="px-3 sm:px-4 md:px-6 py-2.5 bg-surface border-b border-line flex items-center gap-2 text-xs text-ink-muted">
            <Eye size={14} className="shrink-0" />
            <span>{t('crm.readOnly')}</span>
          </div>
        )}

        <main className="flex-1 min-w-0 p-4 sm:p-5 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
