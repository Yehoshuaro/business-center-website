import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { useSettingsStore } from '@/store/settings';
import { Photo, SectionHeading, Avatar } from '@/shared/components/ui';
import { PageHero, StatsBand, CTASection } from '@/shared/components/marketing/sections';

export const AboutPage = () => {
  const { t } = useTranslation();
  const settings = useSettingsStore((s) => s.settings);

  const values = [
    { title: t('platform.about.v1t'), body: t('platform.about.v1b') },
    { title: t('platform.about.v2t'), body: t('platform.about.v2b') },
    { title: t('platform.about.v3t'), body: t('platform.about.v3b') },
  ];
  const timeline = [
    { year: '2016', text: t('platform.about.m2016') },
    { year: '2019', text: t('platform.about.m2019') },
    { year: '2022', text: t('platform.about.m2022') },
    { year: '2026', text: t('platform.about.m2026') },
  ];
  const team = [
    { name: 'Alexandra Petrova', role: t('platform.about.roleDirector') },
    { name: 'Daniyar Akhmetov', role: t('platform.about.roleLeasing') },
    { name: 'Sofia Belova', role: t('platform.about.roleCommunity') },
    { name: 'Marat Idrisov', role: t('platform.about.roleFacilities') },
  ];

  return (
    <>
      <PageHero
        eyebrow={t('platform.about.eyebrow')}
        title={t('platform.about.title')}
        subtitle={t('platform.about.subtitle', { name: settings.centerName })}
      />

      <section className="container-page grid items-center gap-12 py-16 lg:grid-cols-2">
        <Photo name="lobby" alt={t('platform.about.storyTitle')} className="aspect-[4/3]" />
        <div>
          <div className="eyebrow mb-3">{t('platform.about.storyEyebrow')}</div>
          <h2 className="section-title">{t('platform.about.storyTitle')}</h2>
          <p className="mt-4 text-ink-muted leading-relaxed">{t('platform.about.story1')}</p>
          <p className="mt-4 text-ink-muted leading-relaxed">{t('platform.about.story2', { city: settings.city })}</p>
        </div>
      </section>

      <section className="container-page pb-16">
        <StatsBand />
      </section>

      {/* Values */}
      <section className="border-y border-line bg-surface-2">
        <div className="container-page py-16">
          <SectionHeading center eyebrow={t('platform.about.valuesEyebrow')} title={t('platform.about.valuesTitle')} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="card p-7">
                <Check className="h-6 w-6 text-accent" />
                <h3 className="mt-4 font-display text-xl">{v.title}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-page py-16">
        <SectionHeading eyebrow={t('platform.about.milestonesEyebrow')} title={t('platform.about.milestonesTitle')} />
        <div className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {timeline.map((m) => (
            <div key={m.year} className="bg-surface p-6">
              <div className="font-display text-3xl tracking-tight text-accent">{m.year}</div>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-line bg-surface-2">
        <div className="container-page py-16">
          <SectionHeading center eyebrow={t('platform.about.leadershipEyebrow')} title={t('platform.about.leadershipTitle')} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((p) => (
              <div key={p.name} className="card flex flex-col items-center p-7 text-center">
                <Avatar name={p.name} className="h-16 w-16 text-lg" />
                <div className="mt-4 font-medium">{p.name}</div>
                <div className="text-sm text-ink-muted">{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection title={t('platform.about.ctaTitle')} subtitle={t('platform.about.ctaSubtitle')} />
    </>
  );
};
