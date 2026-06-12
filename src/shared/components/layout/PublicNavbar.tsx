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
  { to: '/offices', key: 'nav.offices' },
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
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 md:px-8">
        <Link to="/platform" aria-label="Meridian home">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap px-2.5 py-2 text-sm transition-colors 2xl:px-3',
                  isActive ? 'text-ink font-medium' : 'text-ink-muted hover:text-ink',
                )
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 whitespace-nowrap px-2 text-sm text-ink-muted transition-colors hover:text-ink"
            title={t('nav.allPackages')}
          >
            <LayoutGrid className="h-4 w-4" /> {t('nav.allPackages')}
          </Link>
          <LanguageSwitcher />
          <ThemeSwitcher />
          {session ? (
            <Link to="/dashboard" className="btn-primary whitespace-nowrap">
              <LayoutDashboard className="h-4 w-4" />
              {t('nav.dashboard')}
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                {t('nav.login')}
              </Link>
              <Link to="/offices" className="btn-primary whitespace-nowrap">
                {t('nav.tourShort')}
              </Link>
            </>
          )}
          {session && <Avatar name={session.fullName} />}
        </div>

        <div className="flex items-center gap-2 xl:hidden">
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
        <div className="border-t border-line bg-surface xl:hidden">
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
