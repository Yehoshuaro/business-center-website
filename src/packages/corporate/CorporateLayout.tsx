import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, LayoutGrid } from 'lucide-react';
import { useSettingsStore } from '@/store/settings';
import { BrandMark } from '@/shared/components/layout/BrandMark';
import { CorporateNavbar } from './CorporateNavbar';

export const CorporateLayout = () => {
  const { t } = useTranslation();
  const settings = useSettingsStore((s) => s.settings);
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0 }), [pathname]);

  const links = [
    { to: '/corporate/about', key: 'nav.about' },
    { to: '/corporate/offices', key: 'nav.offices' },
    { to: '/corporate/gallery', key: 'nav.gallery' },
    { to: '/corporate/services', key: 'nav.services' },
    { to: '/corporate/news', key: 'nav.news' },
    { to: '/corporate/contact', key: 'nav.contact' },
  ];

  return (
    <div className="flex min-h-full flex-col">
      <CorporateNavbar />
      <main className="flex-1"><Outlet /></main>

      <footer className="border-t border-line bg-surface-2">
        <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-xs text-sm text-ink-muted">{settings.tagline}.</p>
            <Link to="/" className="mt-4 inline-flex items-center gap-2 text-xs text-ink-muted hover:text-ink">
              <LayoutGrid className="h-3.5 w-3.5" /> {t('nav.allPackages')}
            </Link>
          </div>
          <div>
            <div className="eyebrow mb-4">{t('footer.explore')}</div>
            <ul className="grid grid-cols-2 gap-2.5">
              {links.map((l) => (
                <li key={l.to}><Link to={l.to} className="text-sm text-ink-muted hover:text-ink">{t(l.key)}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="eyebrow mb-4">{t('footer.visit')}</div>
            <ul className="space-y-3 text-sm text-ink-muted">
              <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" /> {settings.address}, {settings.city}</li>
              <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" /> {settings.phone}</li>
              <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" /> {settings.email}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-ink-subtle sm:flex-row">
            <span>© {new Date().getFullYear()} {settings.centerName}. {t('footer.rights')}</span>
            <span>{t('footer.demoNote')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
