import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useConferenceRoomsStore } from '@/features/conferenceRooms/store';
import { OfficeStatusBadge, PageHeader, EmptyState } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils';

export const ConferenceRoomsPage = () => {
  const { t, language } = useT();
  const rooms = useConferenceRoomsStore((s) => s.items);
  const locale = ({ kk: 'kk-KZ', ru: 'ru-RU', en: 'en-US' } as const)[language];

  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow={t('nav.conferenceRooms')}
        title={t('rooms.title')}
        subtitle={t('rooms.subtitle')}
      />

      {rooms.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-px bg-line border border-line sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Link
              key={room.id}
              to={`/site/conference-rooms/${room.id}`}
              className="bg-surface p-5 sm:p-6 lg:p-7 hover:bg-surface-2 transition-colors group flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <div className="font-display text-xl sm:text-2xl tracking-tight break-words">{room.name}</div>
                  <div className="text-sm text-ink-muted mt-1">
                    {room.capacity} {t('common.capacity').toLowerCase()} · {room.area} м²
                  </div>
                </div>
                <OfficeStatusBadge status={room.status} />
              </div>
              <p className="text-sm text-ink-muted leading-relaxed mb-4 line-clamp-3 flex-1">{room.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {room.equipment.slice(0, 3).map((eq) => (
                  <span key={eq} className="badge-neutral">{eq}</span>
                ))}
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
      )}
    </div>
  );
};
