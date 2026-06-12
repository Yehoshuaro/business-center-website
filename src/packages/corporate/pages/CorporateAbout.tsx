import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Photo, SectionHeading } from '@/shared/components/ui';
import { PageHero, StatsBand, CTASection } from '@/shared/components/marketing/sections';

export const CorporateAbout = () => {
  const { t } = useTranslation();
  const values = [
    { title: t('values.serviceTitle'), text: t('values.serviceText') },
    { title: t('values.designTitle'), text: t('values.designText') },
    { title: t('values.communityTitle'), text: t('values.communityText') },
  ];

  return (
    <>
      <PageHero eyebrow={t('nav.about')} title={t('corporate.about.title')} subtitle={t('corporate.about.subtitle')} />

      <section className="container-page grid items-center gap-12 py-16 lg:grid-cols-2">
        <Photo name="lobby" alt={t('corporate.about.storyTitle')} className="aspect-[4/3]" />
        <div>
          <h2 className="section-title">{t('corporate.about.storyTitle')}</h2>
          <p className="mt-4 text-ink-muted leading-relaxed">{t('corporate.about.story1')}</p>
          <p className="mt-4 text-ink-muted leading-relaxed">{t('corporate.about.story2')}</p>
        </div>
      </section>

      <section className="container-page pb-16"><StatsBand /></section>

      <section className="border-y border-line bg-surface-2">
        <div className="container-page py-16">
          <SectionHeading center eyebrow={t('nav.about')} title={t('corporate.about.valuesTitle')} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="card p-7">
                <Check className="h-6 w-6 text-accent" />
                <h3 className="mt-4 font-display text-xl">{v.title}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={t('landing.cta.title')}
        subtitle={t('landing.cta.subtitle')}
        primary={{ to: '/corporate/contact', label: t('nav.bookTour') }}
        secondary={{ to: '/corporate/offices', label: t('common.browseSpaces') }}
      />
    </>
  );
};
