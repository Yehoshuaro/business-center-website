import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LayoutDashboard, LayoutGrid } from 'lucide-react';
import { cn } from '@/shared/utils';
import { useAuthStore } from '@/store/auth';
import { BrandMark } from './BrandMark';
import { Avatar } from '@/shared/components/ui';
import { LanguageSwitcher } from '@/shared/components/common/LanguageSwitcher';
import { ThemeSwitcher } from '@/shared/components/common/ThemeSwitcher';

const LINKS = [
  { to: '/platform', key: 'nav.home', end: true },
  { to: '/about', key: 'nav.about' },
  { to: '/offices', key: 'nav.officesSpaces' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/services', key: 'nav.services' },
  { to: '/news', key: 'nav.news' },
  { to: '/contact', key: 'nav.contact' },
];

export const PublicNavbar = () => {
  const { t } = useTranslation();
  const session = useAuthStore((s) => s.session);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-colors',
        scrolled ? 'border-line bg-surface/90 backdrop-blur-md' : 'border-transparent bg-surface',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/platform" aria-label="Meridian home">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2 text-sm transition-colors',
                  isActive ? 'text-ink font-medium' : 'text-ink-muted hover:text-ink',
                )
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <ThemeSwitcher />
          {session ? (
            <Link to="/dashboard" className="btn-primary">
              <LayoutDashboard className="h-4 w-4" />
              {t('nav.dashboard')}
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                {t('nav.login')}
              </Link>
              <Link to="/offices" className="btn-primary">
                {t('nav.bookTour')}
              </Link>
            </>
          )}
          {session && <Avatar name={session.fullName} />}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <button
            type="button"
            className="btn-ghost btn-sm"
            onClick={() => setOpen((v) => !v)}
            aria-label={t('nav.menu')}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-surface lg:hidden">
          <nav className="container-page flex flex-col py-3">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn('py-2.5 text-sm', isActive ? 'text-ink font-medium' : 'text-ink-muted')
                }
              >
                {t(l.key)}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
              {session ? (
                <Link to="/dashboard" className="btn-primary">
                  {t('nav.dashboard')}
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary">
                    {t('nav.login')}
                  </Link>
                  <Link to="/offices" className="btn-primary">
                    {t('nav.bookTour')}
                  </Link>
                </>
              )}
              <Link to="/" className="inline-flex items-center gap-2 py-2 text-sm text-ink-muted">
                <LayoutGrid className="h-4 w-4" /> {t('nav.allPackages')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
