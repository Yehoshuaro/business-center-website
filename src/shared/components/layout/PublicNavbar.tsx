import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useSettingsStore } from '@/features/settings/store';
import { LanguageSwitcher, ThemeSwitcher } from './Switchers';
import { BrandMark } from '@/shared/components/ui/BrandMark';
import { cn } from '@/shared/utils';

const navLinks = [
  { to: '/site', key: 'nav.home', end: true },
  { to: '/site/offices', key: 'nav.offices' },
  { to: '/site/conference-rooms', key: 'nav.conferenceRooms' },
  { to: '/site/tenants', key: 'nav.tenants' },
  { to: '/site/news', key: 'nav.news' },
  { to: '/site/contacts', key: 'nav.contacts' },
];

export const PublicNavbar = () => {
  const { t } = useT();
  const settings = useSettingsStore((s) => s.settings);
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Close on route change
  useEffect(() => setOpen(false), [pathname]);

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close on Escape + lock body scroll while drawer is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-line">
      <div className="container-page flex items-center justify-between h-16 gap-3">
        <Link to="/site" className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <BrandMark size="md" />
          <span className="hidden sm:block text-sm font-medium tracking-tight text-ink truncate max-w-[180px] md:max-w-[260px]">
            {settings.businessCenterName}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 min-w-0">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2 text-sm tracking-tight transition-colors whitespace-nowrap',
                  isActive
                    ? 'text-accent font-medium'
                    : 'text-ink-muted hover:text-ink',
                )
              }
            >
              {t(link.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
          <Link to="/site/login" className="btn-secondary btn-sm hidden md:inline-flex">
            {t('nav.login')}
          </Link>
          <Link to="/" className="hidden lg:inline-flex text-xs text-ink-muted hover:text-ink px-2 py-2 whitespace-nowrap transition-colors">
            {t('common.exitDemo')}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 -mr-1 text-ink border border-transparent hover:border-line"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 top-16 z-40">
          <div
            className="absolute inset-0 bg-ink/30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative bg-surface border-t border-line max-h-[calc(100vh-4rem)] flex flex-col">
            <nav className="container-page py-4 flex flex-col overflow-y-auto">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'px-1 py-3 text-base border-b border-line last:border-b-0',
                      isActive ? 'text-accent font-medium' : 'text-ink',
                    )
                  }
                >
                  {t(link.key)}
                </NavLink>
              ))}
            </nav>
            <div className="container-page py-4 border-t border-line flex flex-wrap items-center gap-2 shrink-0">
              <ThemeSwitcher />
              <LanguageSwitcher />
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="text-xs text-ink-muted hover:text-ink px-1 py-2"
              >
                {t('common.exitDemo')}
              </Link>
              <Link
                to="/site/login"
                onClick={() => setOpen(false)}
                className="btn-secondary btn-sm ml-auto"
              >
                {t('nav.login')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
