import { Link, useParams, Navigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useConferenceRoomsStore } from '@/features/conferenceRooms/store';
import { OfficeStatusBadge } from '@/shared/components/ui';
import { LeadForm } from '@/shared/components/forms/LeadForm';
import { formatPrice } from '@/shared/utils';

export const ConferenceRoomDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const room = useConferenceRoomsStore((s) => s.items.find((r) => r.id === id));
  const { t, language } = useT();
  const locale = ({ kk: 'kk-KZ', ru: 'ru-RU', en: 'en-US' } as const)[language];

  if (!room) return <Navigate to="/site/conference-rooms" replace />;

  return (
    <div className="container-page py-12 md:py-16">
      <Link to="/site/conference-rooms" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink mb-8">
        <ChevronLeft size={16} /> {t('common.back')}
      </Link>

      <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2 min-w-0">
          <div className="eyebrow mb-3">{t('nav.conferenceRooms')}</div>
          <div className="flex items-start justify-between gap-3 mb-6 flex-wrap">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight break-words">{room.name}</h1>
            <OfficeStatusBadge status={room.status} />
          </div>

          <div className="aspect-[16/9] border border-line bg-surface-2 mb-8 sm:mb-10 overflow-hidden">
            <img
              src={room.capacity >= 60 ? './demo/conference.svg' : './demo/meeting.svg'}
              alt={room.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-line">
            <div>
              <div className="eyebrow mb-2">{t('common.capacity')}</div>
              <div className="font-display text-xl sm:text-2xl">{room.capacity}</div>
            </div>
            <div>
              <div className="eyebrow mb-2">{t('common.area')}</div>
              <div className="font-display text-xl sm:text-2xl">{room.area} м²</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="eyebrow mb-2">{t('rooms.hourly')}</div>
              <div className="font-display text-xl sm:text-2xl break-words">
                {room.hourlyPrice !== null ? formatPrice(room.hourlyPrice, locale) : t('common.priceOnRequest')}
              </div>
            </div>
          </div>

          <h2 className="font-display text-xl sm:text-2xl mb-3">{t('common.description')}</h2>
          <p className="text-ink-muted leading-relaxed mb-8 sm:mb-10">{room.description}</p>

          <h2 className="font-display text-xl sm:text-2xl mb-4">{t('common.equipment')}</h2>
          <ul className="grid gap-2 sm:grid-cols-2 mb-8 sm:mb-10">
            {room.equipment.map((eq) => (
              <li key={eq} className="flex items-start gap-3 text-sm border-l-2 border-accent pl-3 py-1 break-words">
                {eq}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start min-w-0">
          <div className="eyebrow mb-3">{t('common.requestCallback')}</div>
          <LeadForm defaultInterest="conference" relatedItemId={room.id} />
        </div>
      </div>
    </div>
  );
};
