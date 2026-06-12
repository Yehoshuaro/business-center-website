import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check } from 'lucide-react';
import { useOfficesStore } from '@/store/offices';
import { useNewsStore } from '@/store/news';
import { useSettingsStore } from '@/store/settings';
import { seedServices } from '@/data/seed';
import { formatDay } from '@/shared/utils';
import { Photo, SectionHeading, Icon } from '@/shared/components/ui';
import { OfficeCard } from '@/shared/components/marketing/OfficeCard';
import { StatsBand, CTASection } from '@/shared/components/marketing/sections';

export const CorporateHome = () => {
  const { t } = useTranslation();
  const offices = useOfficesStore((s) => s.items);
  const news = useNewsStore((s) => s.items);
  const settings = useSettingsStore((s) => s.settings);

  const featured = offices.filter((o) => o.featured).slice(0, 3);
  const latest = [...news].filter((n) => n.isPublished).sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 hero-glow" />
        <div className="container-page relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <div className="eyebrow mb-3">{t('corporate.home.heroEyebrow')}</div>
            <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {t('corporate.home.heroTitle')}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-muted leading-relaxed">{t('corporate.home.heroSubtitle')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/corporate/offices" className="btn-primary px-6">{t('common.exploreSpaces')} <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/corporate/contact" className="btn-secondary px-6">{t('nav.bookTour')}</Link>
            </div>
          </div>
          <Photo name="facade" alt={settings.centerName} className="aspect-[4/5] ring-soft" />
        </div>
      </section>

      <section className="container-page -mt-px py-14"><StatsBand /></section>

      <section className="container-page pb-16">
        <SectionHeading
          eyebrow={t('corporate.home.featuredTitle')}
          title={t('corporate.home.featuredSubtitle')}
          actions={<Link to="/corporate/offices" className="btn-secondary">{t('common.viewAll')} <ArrowRight className="h-4 w-4" /></Link>}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((o) => (
            <OfficeCard key={o.id} office={o} to="/corporate/offices" />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface-2">
        <div className="container-page py-16">
          <SectionHeading center eyebrow={t('corporate.home.servicesTitle')} title={t('corporate.home.servicesSubtitle')} />
          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {seedServices.slice(0, 8).map((s) => (
              <div key={s.id} className="bg-surface p-6">
                <div className="flex h-10 w-10 items-center justify-center border border-line text-accent"><Icon name={s.icon} className="h-5 w-5" /></div>
                <h3 className="mt-4 font-display text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/corporate/services" className="btn-secondary">{t('nav.services')} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading eyebrow={t('nav.news')} title={t('corporate.home.newsTitle')} actions={<Link to="/corporate/news" className="btn-secondary">{t('common.viewAllNews')}</Link>} />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {latest.map((n) => (
            <Link key={n.id} to={`/corporate/news/${n.slug}`} className="group flex flex-col">
              <Photo name={n.photo} alt={n.title} className="aspect-[16/10]" imgClassName="transition-transform duration-500 group-hover:scale-105" />
              <div className="mt-3 flex items-center gap-2 text-xs text-ink-subtle">
                <span className="badge-neutral">{n.tag}</span><span>{formatDay(n.publishedAt)}</span>
              </div>
              <h3 className="mt-2 font-display text-lg leading-snug group-hover:underline">{n.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface-2">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2">
          <Photo name="lounge" alt={t('corporate.about.storyTitle')} className="aspect-[16/11]" />
          <div>
            <div className="eyebrow mb-3">{t('nav.about')}</div>
            <h2 className="section-title">{t('corporate.about.storyTitle')}</h2>
            <p className="mt-4 text-ink-muted leading-relaxed">{t('corporate.about.story1')}</p>
            <ul className="mt-6 space-y-3">
              {[t('values.serviceTitle'), t('values.designTitle'), t('values.communityTitle')].map((v) => (
                <li key={v} className="flex items-center gap-3 text-sm"><Check className="h-4 w-4 text-success" /> {v}</li>
              ))}
            </ul>
            <Link to="/corporate/about" className="btn-secondary mt-8">{t('nav.about')} <ArrowRight className="h-4 w-4" /></Link>
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
