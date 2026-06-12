import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogOut, ExternalLink, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils';
import { useAuthStore } from '@/store/auth';
import { DASHBOARD_NAV, SECTION_LABELS, ROLE_META, type NavItem } from '@/features/access/roles';
import { BrandMark } from './BrandMark';
import { Avatar, Icon } from '@/shared/components/ui';
import { LanguageSwitcher } from '@/shared/components/common/LanguageSwitcher';
import { ThemeSwitcher } from '@/shared/components/common/ThemeSwitcher';

const SECTION_ORDER: NavItem['section'][] = ['main', 'tenant', 'manage', 'admin'];

export const DashboardLayout = () => {
  const { t } = useTranslation();
  const session = useAuthStore((s) => s.session);
  const signOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  if (!session) return null;

  const items = DASHBOARD_NAV.filter((n) => n.roles.includes(session.role));
  const grouped = SECTION_ORDER.map((section) => ({
    section,
    items: items.filter((i) => i.section === section),
  })).filter((g) => g.items.length > 0);

  const handleSignOut = () => {
    signOut();
    navigate('/login', { replace: true });
  };

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-line px-5">
        <Link to="/dashboard"><BrandMark /></Link>
        <button className="btn-ghost btn-sm lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {grouped.map((group) => (
          <div key={group.section} className="mb-6">
            <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-subtle">
              {t(SECTION_LABELS[group.section])}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                        isActive ? 'bg-accent text-accent-ink' : 'text-ink-muted hover:bg-surface-2 hover:text-ink',
                      )
                    }
                  >
                    <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                    {t(item.labelKey)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <Link to="/platform" className="flex items-center gap-3 px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink">
          <ExternalLink className="h-4 w-4" /> {t('nav.viewPublicSite')}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-full bg-surface-2">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-surface lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-ink/40 lg:hidden" onClick={() => setOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-line bg-surface lg:hidden">
            {SidebarContent}
          </aside>
        </>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line bg-surface/90 px-4 backdrop-blur-md sm:px-6">
          <button className="btn-ghost btn-sm lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden text-sm text-ink-muted sm:block">
            <span className={ROLE_META[session.role].badgeClass}>{t(ROLE_META[session.role].labelKey)}</span>
            <span className="ml-3">{session.title}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <div className="relative">
            <button onClick={() => setMenu((v) => !v)} className="flex items-center gap-2 border border-line px-2 py-1.5 text-sm hover:bg-surface-2">
              <Avatar name={session.fullName} className="h-7 w-7 text-[10px]" />
              <span className="hidden max-w-[12rem] truncate sm:inline">{session.fullName}</span>
              <ChevronDown className="h-4 w-4 text-ink-subtle" />
            </button>
            {menu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                <div className="absolute right-0 z-20 mt-2 w-60 border border-line bg-surface shadow-card-hover">
                  <div className="border-b border-line p-4">
                    <div className="font-medium">{session.fullName}</div>
                    <div className="truncate text-sm text-ink-muted">{session.email}</div>
                  </div>
                  <button onClick={handleSignOut} className="flex w-full items-center gap-2 px-4 py-3 text-sm text-ink-muted hover:bg-surface-2 hover:text-ink">
                    <LogOut className="h-4 w-4" /> {t('auth.signOut')}
                  </button>
                </div>
              </>
            )}
          </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
