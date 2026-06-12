import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSettingsStore } from '@/store/settings';
import { PageHero } from '@/shared/components/marketing/sections';
import { LeadForm } from '@/shared/components/marketing/LeadForm';

export const CorporateContact = () => {
  const { t } = useTranslation();
  const settings = useSettingsStore((s) => s.settings);

  const details = [
    { icon: MapPin, label: t('footer.visit'), value: `${settings.address}, ${settings.city}` },
    { icon: Phone, label: t('lead.phone'), value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, '')}` },
    { icon: Mail, label: t('lead.email'), value: settings.email, href: `mailto:${settings.email}` },
    { icon: Clock, label: t('nav.contact'), value: settings.workingHours },
  ];

  return (
    <>
      <PageHero eyebrow={t('nav.contact')} title={t('corporate.contact.title')} subtitle={t('corporate.contact.subtitle')} />

      <section className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <ul className="space-y-5">
            {details.map((d) => (
              <li key={d.label} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-accent"><d.icon className="h-5 w-5" /></div>
                <div>
                  <div className="eyebrow">{d.label}</div>
                  {d.href ? <a href={d.href} className="mt-1 block text-ink hover:text-accent">{d.value}</a> : <div className="mt-1 text-ink">{d.value}</div>}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 aspect-[16/10] overflow-hidden border border-line grid-bg">
            <div className="flex h-full flex-col items-center justify-center text-center">
              <MapPin className="h-8 w-8 text-accent" />
              <div className="mt-2 font-display text-lg">{settings.centerName}</div>
              <div className="text-sm text-ink-muted">{settings.address}</div>
            </div>
          </div>
        </div>
        <LeadForm source="Corporate demo" />
      </section>
    </>
  );
};
