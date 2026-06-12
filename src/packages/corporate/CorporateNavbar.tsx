import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LayoutGrid } from 'lucide-react';
import { cn } from '@/shared/utils';
import { BrandMark } from '@/shared/components/layout/BrandMark';
import { LanguageSwitcher } from '@/shared/components/common/LanguageSwitcher';
import { ThemeSwitcher } from '@/shared/components/common/ThemeSwitcher';

const LINKS = [
  { to: '/corporate', key: 'nav.home', end: true },
  { to: '/corporate/about', key: 'nav.about' },
  { to: '/corporate/offices', key: 'nav.offices' },
  { to: '/corporate/gallery', key: 'nav.gallery' },
  { to: '/corporate/services', key: 'nav.services' },
  { to: '/corporate/news', key: 'nav.news' },
  { to: '/corporate/contact', key: 'nav.contact' },
];

export const CorporateNavbar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/corporate" aria-label="Home"><BrandMark /></Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => cn('px-3 py-2 text-sm transition-colors', isActive ? 'text-ink font-medium' : 'text-ink-muted hover:text-ink')}>
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Link to="/corporate/contact" className="btn-primary">{t('nav.bookTour')}</Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <button className="btn-ghost btn-sm" onClick={() => setOpen((v) => !v)} aria-label={t('nav.menu')}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-surface xl:hidden">
          <nav className="container-page flex flex-col py-3">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}
                className={({ isActive }) => cn('py-2.5 text-sm', isActive ? 'text-ink font-medium' : 'text-ink-muted')}>
                {t(l.key)}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
              <Link to="/corporate/contact" className="btn-primary">{t('nav.bookTour')}</Link>
              <Link to="/" className="inline-flex items-center gap-2 py-2 text-sm text-ink-muted"><LayoutGrid className="h-4 w-4" /> {t('nav.allPackages')}</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
