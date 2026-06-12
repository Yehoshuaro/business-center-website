import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, LayoutGrid } from 'lucide-react';
import { useSettingsStore } from '@/store/settings';
import { BrandMark } from './BrandMark';

export const PublicFooter = () => {
  const { t } = useTranslation();
  const settings = useSettingsStore((s) => s.settings);
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t('footer.explore'),
      links: [
        { to: '/about', label: t('nav.about') },
        { to: '/offices', label: t('nav.officesSpaces') },
        { to: '/gallery', label: t('nav.gallery') },
        { to: '/services', label: t('nav.services') },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { to: '/news', label: t('nav.news') },
        { to: '/contact', label: t('nav.contact') },
        { to: '/login', label: t('footer.tenantLogin') },
        { to: '/', label: t('nav.allPackages') },
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-xs text-sm text-ink-muted leading-relaxed">{settings.tagline}.</p>
          <p className="mt-4 text-xs text-ink-subtle">{t('footer.established')} {settings.foundedYear}</p>
          <Link to="/" className="mt-4 inline-flex items-center gap-2 text-xs text-ink-muted hover:text-ink">
            <LayoutGrid className="h-3.5 w-3.5" /> {t('nav.allPackages')}
          </Link>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <div className="eyebrow mb-4">{col.title}</div>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-ink-muted transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <div className="eyebrow mb-4">{t('footer.visit')}</div>
          <ul className="space-y-3 text-sm text-ink-muted">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" />
              <span>{settings.address}, {settings.city}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" />
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-ink">{settings.phone}</a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" />
              <a href={`mailto:${settings.email}`} className="hover:text-ink">{settings.email}</a>
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" />
              <span>{settings.workingHours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-ink-subtle sm:flex-row">
          <span>© {year} {settings.centerName}. {t('footer.rights')}</span>
          <span>{t('footer.demoNote')}</span>
        </div>
      </div>
    </footer>
  );
};
