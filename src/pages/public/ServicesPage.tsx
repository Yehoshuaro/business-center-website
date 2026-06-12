import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Users, Maximize } from 'lucide-react';
import { useMeetingRoomsStore } from '@/store/meetingRooms';
import { seedServices } from '@/data/seed';
import { formatKzt, pickLocale } from '@/shared/utils';
import { Photo, SectionHeading, Icon } from '@/shared/components/ui';
import { PageHero, CTASection } from '@/shared/components/marketing/sections';

export const ServicesPage = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const rooms = useMeetingRoomsStore((s) => s.items);

  return (
    <>
      <PageHero
        eyebrow={t('platform.services.eyebrow')}
        title={t('platform.services.title')}
        subtitle={t('platform.services.subtitle')}
      />

      {/* Amenities grid */}
      <section className="container-page py-14">
        <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {seedServices.map((s) => (
            <div key={s.id} className="bg-surface p-6">
              <div className="flex h-11 w-11 items-center justify-center border border-line text-accent">
                <Icon name={s.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg">{pickLocale(s.title, lang)}</h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">{pickLocale(s.description, lang)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meeting rooms */}
      <section className="border-y border-line bg-surface-2">
        <div className="container-page py-16">
          <SectionHeading
            eyebrow={t('platform.services.roomsEyebrow')}
            title={t('platform.services.roomsTitle')}
            subtitle={t('platform.services.roomsSubtitle')}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {rooms.map((r) => (
              <div key={r.id} className="card flex flex-col overflow-hidden sm:flex-row">
                <Photo name={r.photo} alt={r.name} className="aspect-video sm:aspect-auto sm:w-44 sm:shrink-0" />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl">{r.name}</h3>
                    <div className="text-right">
                      <div className="font-display text-lg">{formatKzt(r.hourlyPrice)}</div>
                      <div className="text-xs text-ink-subtle">{t('platform.services.perHour')}</div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-ink-muted">{r.description}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
                    <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {r.capacity} {t('platform.services.seats')}</span>
                    <span className="inline-flex items-center gap-1.5"><Maximize className="h-3.5 w-3.5" /> {r.area} m²</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {t('platform.services.floor')} {r.floor}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {r.amenities.map((a) => (
                      <span key={a} className="badge-neutral">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-ink-muted">
            {t('platform.services.alreadyTenant')} <Link to="/login" className="link-underline">{t('platform.services.signIn')}</Link> {t('platform.services.toBookRoom')}
          </p>
        </div>
      </section>

      <CTASection
        title={t('platform.services.ctaTitle')}
        subtitle={t('platform.services.ctaSubtitle')}
        primary={{ to: '/contact', label: t('platform.services.talkEvents') }}
        secondary={{ to: '/gallery', label: t('platform.services.seeSpaces') }}
      />
    </>
  );
};
