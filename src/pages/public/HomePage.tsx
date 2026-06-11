import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowUpRight, MapPin, Building, Presentation, Car, ShieldCheck, Coffee } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useSettingsStore } from '@/features/settings/store';
import { useOfficesStore } from '@/features/offices/store';
import { useConferenceRoomsStore } from '@/features/conferenceRooms/store';
import { useTenantsStore } from '@/features/tenants/store';
import { useGalleryStore } from '@/features/gallery/store';
import { useNewsStore } from '@/features/news/store';
import { LeadForm } from '@/shared/components/forms/LeadForm';
import { OfficeStatusBadge } from '@/shared/components/ui';
import { Carousel } from '@/shared/components/ui/Carousel';
import { formatDate, formatNumber, formatPrice } from '@/shared/utils';
import { PHOTOS } from '@/shared/photos';
import { PhotoImg } from '@/shared/components/ui/PhotoImg';

const benefits = [
  { icon: MapPin, key: 'location' },
  { icon: Building, key: 'formats' },
  { icon: Presentation, key: 'conference' },
  { icon: Car, key: 'parking' },
  { icon: ShieldCheck, key: 'security' },
  { icon: Coffee, key: 'infra' },
] as const;

export const HomePage = () => {
  const { t, language } = useT();
  const settings = useSettingsStore((s) => s.settings);
  const offices = useOfficesStore((s) => s.items).filter((o) => o.status === 'available').slice(0, 4);
  const rooms = useConferenceRoomsStore((s) => s.items).slice(0, 3);
  const tenants = useTenantsStore((s) => s.items).filter((t) => t.isPublished).slice(0, 6);
  const galleryItems = useGalleryStore((s) => s.items).filter((g) => g.isPublished);
  const news = useNewsStore((s) => s.items).filter((n) => n.isPublished).slice(0, 3);

  const heroTitle = settings.heroTitle[language] || t('hero.title');
  const heroSubtitle = settings.heroSubtitle[language] || t('hero.subtitle');
  const aboutText = settings.aboutText[language] || t('about.text');
  const localeMap = { kk: 'kk-KZ', ru: 'ru-RU', en: 'en-US' } as const;
  const locale = localeMap[language];

  const slides = useMemo(
    () => galleryItems.map((g) => ({
      id: g.id,
      src: g.src,
      fallback: g.fallback,
      title: g.title[language] || g.title.ru,
      caption: g.caption[language] || g.caption.ru,
    })),
    [galleryItems, language],
  );

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative border-b border-line overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="container-page relative py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end">
            <div className="lg:col-span-7 max-w-3xl">
              <div className="eyebrow mb-4 sm:mb-5 flex items-center">
                <span className="inline-block w-6 sm:w-8 h-px bg-accent mr-3" />
                <span className="truncate">{settings.businessCenterName}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-balance">
                {heroTitle}
              </h1>
              <p className="mt-5 sm:mt-6 max-w-xl text-sm sm:text-base md:text-lg text-ink-muted leading-relaxed">
                {heroSubtitle}
              </p>
              <div className="mt-7 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <Link to="/site/contacts" className="btn-primary w-full sm:w-auto">
                  {t('common.requestCallback')}
                  <ArrowUpRight size={16} />
                </Link>
                <Link to="/site/offices" className="btn-secondary w-full sm:w-auto">
                  {t('common.viewOffices')}
                </Link>
              </div>
            </div>

            {/* Hero image inset — visible from lg up */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="relative">
                <div className="aspect-[4/5] border border-line overflow-hidden bg-surface-2 shadow-card">
                  <PhotoImg
                    src={PHOTOS.facade.src}
                    fallback={PHOTOS.facade.fallback}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-44 aspect-[4/3] border border-line bg-surface-2 overflow-hidden shadow-card hidden xl:block">
                  <PhotoImg
                    src={PHOTOS.lobby.src}
                    fallback={PHOTOS.lobby.fallback}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-3 right-4 text-[11px] uppercase tracking-[0.18em] text-ink-muted bg-surface px-2 py-1 border border-line">
                  Astana · 2026
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-6 pt-7 sm:pt-8 border-t border-line">
            {[
              { label: 'about.stat.floors', value: '9' },
              { label: 'about.stat.area', value: '18 400' },
              { label: 'about.stat.tenants', value: '46' },
              { label: 'about.stat.parking', value: '220' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-xl sm:text-2xl md:text-3xl tracking-tight">{s.value}</div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-muted mt-1">{t(s.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="container-page py-12 sm:py-16 md:py-20">
        <div className="max-w-2xl mb-8 sm:mb-12">
          <div className="eyebrow mb-3">02</div>
          <h2 className="section-title">{t('benefits.title')}</h2>
        </div>
        <div className="grid gap-px bg-line border border-line sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, key }) => (
            <div key={key} className="bg-surface p-5 sm:p-6 lg:p-8">
              <Icon size={20} strokeWidth={1.5} className="text-accent" />
              <h3 className="mt-4 sm:mt-5 font-medium text-base sm:text-lg tracking-tight">{t(`benefits.${key}.title`)}</h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">{t(`benefits.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      {slides.length > 0 && (
        <section className="container-page py-12 sm:py-16 md:py-20 border-t border-line">
          <div className="flex items-end justify-between mb-8 sm:mb-10 flex-wrap gap-4">
            <div>
              <div className="eyebrow mb-3">03</div>
              <h2 className="section-title">{t('gallery.title')}</h2>
              <p className="mt-3 max-w-xl text-ink-muted text-sm md:text-base leading-relaxed">
                {t('gallery.subtitle')}
              </p>
            </div>
          </div>
          <Carousel slides={slides} />
        </section>
      )}

      {/* ===== ABOUT ===== */}
      <section className="container-page py-12 sm:py-16 md:py-20 border-t border-line">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-20 items-start">
          <div>
            <div className="eyebrow mb-3">{t('about.eyebrow')}</div>
            <h2 className="section-title">{t('about.title')}</h2>
          </div>
          <div>
            <p className="text-sm sm:text-base md:text-lg text-ink-muted leading-relaxed">{aboutText}</p>
            <div className="mt-7 sm:mt-8 grid grid-cols-2 gap-5 sm:gap-6">
              {[
                { label: t('about.stat.floors'), value: '9' },
                { label: t('about.stat.area'), value: '18 400' },
                { label: t('about.stat.tenants'), value: '46' },
                { label: t('about.stat.parking'), value: '220' },
              ].map((s) => (
                <div key={s.label} className="border-t border-line pt-4">
                  <div className="font-display text-xl sm:text-2xl tracking-tight">{s.value}</div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-muted mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== OFFICES ===== */}
      <section className="container-page py-12 sm:py-16 md:py-20 border-t border-line">
        <div className="flex items-end justify-between mb-8 sm:mb-10 flex-wrap gap-4">
          <div>
            <div className="eyebrow mb-3">{t('nav.offices')}</div>
            <h2 className="section-title">{t('offices.title')}</h2>
          </div>
          <Link to="/site/offices" className="text-sm text-ink hover:text-accent link-underline inline-flex items-center gap-1">
            {t('common.details')} <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="grid gap-px bg-line border border-line sm:grid-cols-2 lg:grid-cols-4">
          {offices.map((office) => (
            <Link
              to={`/site/offices/${office.id}`}
              key={office.id}
              className="bg-surface p-5 sm:p-6 hover:bg-surface-2 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <span className="text-xs uppercase tracking-wider text-ink-muted">
                  {t('common.floor')} {office.floor}
                </span>
                <OfficeStatusBadge status={office.status} />
              </div>
              <div className="font-display text-xl sm:text-2xl tracking-tight mb-2 break-words">{office.title}</div>
              <div className="text-sm text-ink-muted mb-4">
                {formatNumber(office.area)} м² · {t(`officeType.${office.type}`)}
              </div>
              <div className="hairline mb-4" />
              <div className="flex items-end justify-between gap-2">
                <span className="text-sm font-medium break-words">
                  {office.price !== null ? formatPrice(office.price, locale) : t('common.priceOnRequest')}
                </span>
                <ArrowUpRight size={16} className="text-ink-muted group-hover:text-accent transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== ROOMS ===== */}
      <section className="container-page py-12 sm:py-16 md:py-20 border-t border-line">
        <div className="flex items-end justify-between mb-8 sm:mb-10 flex-wrap gap-4">
          <div>
            <div className="eyebrow mb-3">{t('nav.conferenceRooms')}</div>
            <h2 className="section-title">{t('rooms.title')}</h2>
          </div>
          <Link to="/site/conference-rooms" className="text-sm link-underline inline-flex items-center gap-1">
            {t('common.details')} <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="grid gap-px bg-line border border-line sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Link
              to={`/site/conference-rooms/${room.id}`}
              key={room.id}
              className="bg-surface p-5 sm:p-6 lg:p-7 hover:bg-surface-2 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="font-display text-xl sm:text-2xl tracking-tight break-words">{room.name}</div>
                <OfficeStatusBadge status={room.status} />
              </div>
              <div className="text-sm text-ink-muted mb-4">
                {room.capacity} {t('common.capacity').toLowerCase()} · {room.area} м²
              </div>
              <div className="hairline mb-4" />
              <div className="flex items-end justify-between gap-2">
                <span className="text-sm font-medium break-words">
                  {room.hourlyPrice !== null
                    ? `${formatPrice(room.hourlyPrice, locale)} / ${t('rooms.hourly').toLowerCase()}`
                    : t('common.priceOnRequest')}
                </span>
                <ArrowUpRight size={16} className="text-ink-muted group-hover:text-accent transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== TENANTS ===== */}
      <section className="container-page py-12 sm:py-16 md:py-20 border-t border-line">
        <div className="flex items-end justify-between mb-8 sm:mb-10 flex-wrap gap-4">
          <div>
            <div className="eyebrow mb-3">{t('nav.tenants')}</div>
            <h2 className="section-title">{t('tenants.title')}</h2>
          </div>
          <Link to="/site/tenants" className="text-sm link-underline inline-flex items-center gap-1">
            {t('common.details')} <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="grid gap-px bg-line border border-line sm:grid-cols-2 lg:grid-cols-3">
          {tenants.map((tenant) => (
            <div key={tenant.id} className="bg-surface p-5 sm:p-6">
              <div className="text-xs uppercase tracking-wider text-ink-muted mb-3">
                {tenant.category}
              </div>
              <div className="font-display text-lg sm:text-xl tracking-tight break-words">{tenant.companyName}</div>
              <div className="mt-3 text-sm text-ink-muted">
                {t('common.floor')} {tenant.floor} · {tenant.officeNumber}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== NEWS TEASER ===== */}
      {news.length > 0 && (
        <section className="container-page py-12 sm:py-16 md:py-20 border-t border-line">
          <div className="flex items-end justify-between mb-8 sm:mb-10 flex-wrap gap-4">
            <div>
              <div className="eyebrow mb-3">{t('nav.news')}</div>
              <h2 className="section-title">{t('news.title')}</h2>
            </div>
            <Link to="/site/news" className="text-sm link-underline inline-flex items-center gap-1">
              {t('news.all')} <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid gap-px bg-line border border-line sm:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <Link
                key={n.id}
                to={`/site/news/${n.slug}`}
                className="bg-surface flex flex-col hover:bg-surface-2 transition-colors group"
              >
                <div className="aspect-[16/10] overflow-hidden bg-surface-2 border-b border-line">
                  <PhotoImg
                    src={n.cover}
                    fallback={n.coverFallback}
                    alt={n.title[language] || n.title.ru}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3 text-[11px] uppercase tracking-[0.18em] text-ink-muted flex-wrap">
                    <span>{n.tag}</span>
                    <span className="w-1 h-1 rounded-full bg-line-strong" />
                    <span>{formatDate(n.publishedAt, locale)}</span>
                  </div>
                  <div className="font-display text-xl sm:text-2xl tracking-tight leading-snug mb-3 text-balance">
                    {n.title[language] || n.title.ru}
                  </div>
                  <p className="text-sm text-ink-muted leading-relaxed flex-1">
                    {n.excerpt[language] || n.excerpt.ru}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-1 text-sm text-ink group-hover:text-accent transition-colors">
                    {t('common.details')} <ArrowUpRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== CTA / Contacts ===== */}
      <section className="container-page py-12 sm:py-16 md:py-20 border-t border-line">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="eyebrow mb-3">{t('nav.contacts')}</div>
            <h2 className="section-title mb-4">{t('cta.title')}</h2>
            <p className="text-ink-muted leading-relaxed mb-8 max-w-md">{t('cta.text')}</p>
            <dl className="space-y-3 sm:space-y-4 text-sm">
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 border-b border-line pb-3">
                <dt className="sm:w-32 shrink-0 text-ink-muted">{t('contacts.address')}</dt>
                <dd className="flex-1 break-words">{settings.address}</dd>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 border-b border-line pb-3">
                <dt className="sm:w-32 shrink-0 text-ink-muted">{t('contacts.phone')}</dt>
                <dd className="flex-1 break-words">{settings.phone}</dd>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 border-b border-line pb-3">
                <dt className="sm:w-32 shrink-0 text-ink-muted">{t('contacts.email')}</dt>
                <dd className="flex-1 break-all">{settings.email}</dd>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <dt className="sm:w-32 shrink-0 text-ink-muted">{t('contacts.hours')}</dt>
                <dd className="flex-1 break-words">{settings.workingHours}</dd>
              </div>
            </dl>
          </div>
          <div>
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
};
