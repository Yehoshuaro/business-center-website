import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, MapPin, Repeat, ShieldCheck, Sparkles, Phone, Mail, Clock, Menu, X, LayoutGrid, Quote } from 'lucide-react';
import { useOfficesStore } from '@/store/offices';
import { useGalleryStore } from '@/store/gallery';
import { useSettingsStore } from '@/store/settings';
import { seedTestimonials } from '@/data/seed';
import { pickLocale } from '@/shared/utils';
import { BrandMark } from '@/shared/components/layout/BrandMark';
import { Photo } from '@/shared/components/ui';
import { OfficeCard } from '@/shared/components/marketing/OfficeCard';
import { LeadForm } from '@/shared/components/marketing/LeadForm';
import { LanguageSwitcher } from '@/shared/components/common/LanguageSwitcher';
import { ThemeSwitcher } from '@/shared/components/common/ThemeSwitcher';

const SECTIONS = ['about', 'benefits', 'offices', 'gallery', 'contact'] as const;

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const offices = useOfficesStore((s) => s.items);
  const gallery = useGalleryStore((s) => s.items);
  const settings = useSettingsStore((s) => s.settings);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const available = offices.filter((o) => o.status === 'available').slice(0, 3);
  const galleryPreview = gallery.slice(0, 6);

  const benefits = [
    { icon: MapPin, ...trItem(t, 'location') },
    { icon: Repeat, ...trItem(t, 'flexible') },
    { icon: ShieldCheck, ...trItem(t, 'service') },
    { icon: Sparkles, ...trItem(t, 'amenities') },
  ];

  return (
    <div className="flex min-h-full flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <button onClick={() => scrollTo('top')} aria-label="Top"><BrandMark /></button>
          <nav className="hidden items-center gap-1 lg:flex">
            {SECTIONS.map((s) => (
              <button key={s} onClick={() => scrollTo(s)} className="px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink">
                {t(`landing.${s}.title`)}
              </button>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <button onClick={() => scrollTo('contact')} className="btn-primary">{t('landing.hero.ctaPrimary')}</button>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <button className="btn-ghost btn-sm" onClick={() => setOpen((v) => !v)} aria-label={t('nav.menu')}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-line bg-surface lg:hidden">
            <nav className="container-page flex flex-col py-3">
              {SECTIONS.map((s) => (
                <button key={s} onClick={() => { scrollTo(s); setOpen(false); }} className="py-2.5 text-left text-sm text-ink-muted">
                  {t(`landing.${s}.title`)}
                </button>
              ))}
              <button onClick={() => { scrollTo('contact'); setOpen(false); }} className="btn-primary mt-3">{t('landing.hero.ctaPrimary')}</button>
              <Link to="/" className="mt-2 inline-flex items-center gap-2 py-2 text-sm text-ink-muted"><LayoutGrid className="h-4 w-4" /> {t('nav.allPackages')}</Link>
            </nav>
          </div>
        )}
      </header>

      <main id="top" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-line">
          <div className="absolute inset-0 hero-glow" />
          <div className="container-page relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
            <div>
              <div className="eyebrow mb-3">{t('landing.hero.eyebrow')}</div>
              <h1 className="font-display text-4xl leading-[1.04] tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {t('landing.hero.title')}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-ink-muted leading-relaxed">{t('landing.hero.subtitle')}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => scrollTo('contact')} className="btn-primary px-6">
                  {t('landing.hero.ctaPrimary')} <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => scrollTo('offices')} className="btn-secondary px-6">{t('landing.hero.ctaSecondary')}</button>
              </div>
            </div>
            <div className="relative">
              <Photo name="facade" alt={settings.centerName} className="aspect-[4/5] ring-soft" />
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="container-page grid items-center gap-12 py-16 lg:grid-cols-2">
          <Photo name="atrium" alt={t('landing.about.title')} className="aspect-[16/11]" />
          <div>
            <div className="eyebrow mb-3">{t('landing.about.eyebrow')}</div>
            <h2 className="section-title text-balance">{t('landing.about.title')}</h2>
            <p className="mt-4 text-ink-muted leading-relaxed">{t('landing.about.text')}</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[['24k', t('stats.space')], ['60+', t('stats.residents')], ['9', t('stats.floors')]].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display text-3xl tracking-tight">{v}</div>
                  <div className="text-xs text-ink-muted">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="border-y border-line bg-surface-2">
          <div className="container-page py-16">
            <h2 className="section-title text-center">{t('landing.benefits.title')}</h2>
            <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((b) => (
                <div key={b.title} className="bg-surface p-6">
                  <div className="flex h-11 w-11 items-center justify-center border border-line text-accent">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg">{b.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Available offices */}
        <section id="offices" className="container-page py-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="section-title">{t('landing.offices.title')}</h2>
              <p className="mt-2 text-ink-muted">{t('landing.offices.subtitle')}</p>
            </div>
            <Link to="/corporate/offices" className="btn-secondary">{t('landing.offices.viewAll')} <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((o) => (
              <OfficeCard key={o.id} office={o} />
            ))}
          </div>
        </section>

        {/* Gallery preview */}
        <section id="gallery" className="border-y border-line bg-surface-2">
          <div className="container-page py-16">
            <div className="text-center">
              <h2 className="section-title">{t('landing.gallery.title')}</h2>
              <p className="mt-2 text-ink-muted">{t('landing.gallery.subtitle')}</p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {galleryPreview.map((g) => (
                <Photo key={g.id} name={g.photo} alt={pickLocale(g.title, lang)} className="aspect-[4/3]" imgClassName="transition-transform duration-500 hover:scale-105" />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container-page py-16">
          <h2 className="section-title text-center">{t('landing.testimonials.title')}</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {seedTestimonials.map((tst) => (
              <figure key={tst.id} className="card flex flex-col p-7">
                <Quote className="h-7 w-7 text-accent/30" />
                <blockquote className="mt-4 flex-1 leading-relaxed">“{pickLocale(tst.quote, lang)}”</blockquote>
                <figcaption className="mt-6 border-t border-line pt-4">
                  <div className="font-medium">{tst.author}</div>
                  <div className="text-sm text-ink-muted">{pickLocale(tst.role, lang)}, {tst.company}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Contact + lead form */}
        <section id="contact" className="border-t border-line bg-surface-2">
          <div className="container-page grid gap-12 py-16 lg:grid-cols-2">
            <div>
              <div className="eyebrow mb-3">{t('landing.contact.eyebrow')}</div>
              <h2 className="section-title">{t('landing.contact.title')}</h2>
              <p className="mt-4 text-ink-muted leading-relaxed">{t('landing.contact.subtitle')}</p>
              <ul className="mt-8 space-y-5">
                {[
                  { icon: MapPin, value: `${settings.address}, ${settings.city}` },
                  { icon: Phone, value: settings.phone },
                  { icon: Mail, value: settings.email },
                  { icon: Clock, value: settings.workingHours },
                ].map((d, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-accent">
                      <d.icon className="h-5 w-5" />
                    </div>
                    <span className="self-center text-ink">{d.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <LeadForm source="Landing demo" />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-accent text-accent-ink">
          <div className="container-page flex flex-col items-center gap-6 py-16 text-center">
            <h2 className="max-w-3xl font-display text-3xl leading-tight tracking-tight text-balance sm:text-4xl">{t('landing.cta.title')}</h2>
            <p className="max-w-xl text-accent-ink/80">{t('landing.cta.subtitle')}</p>
            <button onClick={() => scrollTo('contact')} className="btn border-accent-ink bg-accent-ink px-6 text-accent hover:bg-accent-ink/90">
              {t('landing.hero.ctaPrimary')}
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-subtle sm:flex-row">
          <span>© {new Date().getFullYear()} {settings.centerName}. {t('footer.rights')}</span>
          <Link to="/" className="inline-flex items-center gap-2 hover:text-ink"><LayoutGrid className="h-3.5 w-3.5" /> {t('nav.allPackages')}</Link>
        </div>
      </footer>
    </div>
  );
};

function trItem(t: (k: string) => string, key: string) {
  return {
    title: t(`landing.benefits.items.${key}.title`),
    text: t(`landing.benefits.items.${key}.text`),
  };
}
