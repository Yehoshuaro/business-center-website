import { Link } from 'react-router-dom';
import { useT } from '@/features/i18n/store';
import { useSettingsStore } from '@/features/settings/store';
import { BrandMark } from '@/shared/components/ui/BrandMark';

export const PublicFooter = () => {
  const { t } = useT();
  const settings = useSettingsStore((s) => s.settings);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-surface-2">
      <div className="container-page py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <BrandMark size="md" />
            <span className="text-sm font-medium tracking-tight">
              {settings.businessCenterName}
            </span>
          </div>
          <p className="text-sm text-ink-muted max-w-md leading-relaxed">
            {settings.address}
          </p>
        </div>

        <div>
          <h4 className="eyebrow mb-3">{t('nav.contacts')}</h4>
          <ul className="space-y-2 text-sm text-ink">
            <li>{settings.phone}</li>
            <li>{settings.email}</li>
            <li className="text-ink-muted">{settings.workingHours}</li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-3">{t('nav.home')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/site/offices" className="link-underline">{t('nav.offices')}</Link></li>
            <li><Link to="/site/conference-rooms" className="link-underline">{t('nav.conferenceRooms')}</Link></li>
            <li><Link to="/site/tenants" className="link-underline">{t('nav.tenants')}</Link></li>
            <li><Link to="/site/news" className="link-underline">{t('nav.news')}</Link></li>
            <li><Link to="/site/contacts" className="link-underline">{t('nav.contacts')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-ink-muted">
          <span>© {year} · {settings.businessCenterName} · {t('footer.rights')}</span>
          <span>{t('footer.legal')}</span>
        </div>
      </div>
    </footer>
  );
};
