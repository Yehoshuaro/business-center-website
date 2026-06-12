import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, Quote } from 'lucide-react';
import { useOfficesStore } from '@/store/offices';
import { useNewsStore } from '@/store/news';
import { useSettingsStore } from '@/store/settings';
import { seedServices, seedTestimonials } from '@/data/seed';
import { formatDay, pickLocale } from '@/shared/utils';
import { Photo, SectionHeading, Icon } from '@/shared/components/ui';
import { OfficeCard } from '@/shared/components/marketing/OfficeCard';
import { StatsBand, CTASection } from '@/shared/components/marketing/sections';

export const HomePage = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const offices = useOfficesStore((s) => s.items);
  const news = useNewsStore((s) => s.items);
  const settings = useSettingsStore((s) => s.settings);

  const featured = offices.filter((o) => o.featured).slice(0, 3);
  const latestNews = [...news].filter((n) => n.isPublished).sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)).slice(0, 3);
  const services = seedServices.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 hero-glow" />
        <div className="container-page relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 border border-line bg-surface px-3 py-1 text-xs text-ink-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Now leasing · {settings.city}
            </div>
            <h1 className="mt-6 font-display text-4xl leading-[1.04] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              A premium address for modern business
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-muted leading-relaxed">
              {settings.centerName} brings together Class-A offices, conference halls and a full service
              floor in the heart of the business district. Spaces that work as hard as your team.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/offices" className="btn-primary px-6">
                Explore spaces <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="btn-secondary px-6">
                Book a tour
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
              {['Flexible lease terms', 'Move-in ready', '24/7 access'].map((f) => (
                <span key={f} className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" /> {f}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <Photo name="facade" alt="Meridian Business Center facade" className="aspect-[4/5] ring-soft" />
            <div className="absolute -bottom-5 -left-5 hidden w-48 bg-surface p-4 shadow-card-hover ring-1 ring-line sm:block">
              <div className="eyebrow">Occupancy</div>
              <div className="font-display text-3xl">98%</div>
              <div className="text-xs text-ink-muted">across 9 floors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page -mt-px py-14">
        <StatsBand />
      </section>

      {/* Featured offices */}
      <section className="container-page py-10 md:py-16">
        <SectionHeading
          eyebrow="Featured spaces"
          title="Offices ready for your team"
          subtitle="A selection of our most sought-after spaces, from private cabinets to full-floor suites."
          actions={
            <Link to="/offices" className="btn-secondary">
              View all spaces <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((o) => (
            <OfficeCard key={o.id} office={o} to={`/offices/${o.id}`} />
          ))}
        </div>
      </section>

      {/* About teaser */}
      <section className="border-y border-line bg-surface-2">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2">
          <Photo name="atrium" alt="Central atrium" className="aspect-[16/11]" />
          <div>
            <div className="eyebrow mb-3">Why Meridian</div>
            <h2 className="section-title text-balance">More than an office — a working environment</h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Since {settings.foundedYear}, Meridian has been home to companies that value design,
              service and a genuine sense of community. Every detail — from the lobby to the rooftop
              terrace — is built to help your business perform.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'On-site facilities team and concierge',
                'Conference halls from 8 to 120 seats',
                'Underground parking with EV charging',
                'Fibre connectivity and managed Wi-Fi',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/about" className="btn-secondary mt-8">
              About the center <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container-page py-14 md:py-20">
        <SectionHeading center eyebrow="Services & amenities" title="Everything taken care of" subtitle="A full service floor so your team can focus on the work that matters." />
        <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.id} className="bg-surface p-6">
              <div className="flex h-10 w-10 items-center justify-center border border-line text-accent">
                <Icon name={s.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg">{pickLocale(s.title, lang)}</h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">{pickLocale(s.description, lang)}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/services" className="btn-secondary">
            All services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-line bg-surface-2">
        <div className="container-page py-16 md:py-20">
          <SectionHeading center eyebrow="Testimonials" title="Trusted by our residents" />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {seedTestimonials.map((t) => (
              <figure key={t.id} className="card flex flex-col p-7">
                <Quote className="h-7 w-7 text-accent/30" />
                <blockquote className="mt-4 flex-1 text-ink leading-relaxed">“{pickLocale(t.quote, lang)}”</blockquote>
                <figcaption className="mt-6 border-t border-line pt-4">
                  <div className="font-medium">{t.author}</div>
                  <div className="text-sm text-ink-muted">{pickLocale(t.role, lang)}, {t.company}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Latest news */}
      <section className="container-page py-14 md:py-20">
        <SectionHeading
          eyebrow="News"
          title="Latest from Meridian"
          actions={<Link to="/news" className="btn-secondary">All news <ArrowRight className="h-4 w-4" /></Link>}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {latestNews.map((n) => (
            <Link key={n.id} to={`/news/${n.slug}`} className="group card overflow-hidden transition-shadow hover:shadow-card-hover">
              <Photo name={n.photo} alt={pickLocale(n.title, lang)} className="aspect-[16/10]" imgClassName="transition-transform duration-500 group-hover:scale-105" />
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-ink-subtle">
                  <span className="badge-neutral">{pickLocale(n.tag, lang)}</span>
                  <span>{formatDay(n.publishedAt)}</span>
                </div>
                <h3 className="mt-3 font-display text-lg leading-snug group-hover:underline">{pickLocale(n.title, lang)}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{pickLocale(n.excerpt, lang)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CTASection
        title="Ready to find your space at Meridian?"
        subtitle="Tell us about your team and we'll prepare a shortlist and a private tour."
      />
    </>
  );
};
