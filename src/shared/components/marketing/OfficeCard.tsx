import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Maximize, Users, Building } from 'lucide-react';
import type { Office } from '@/shared/types';
import { formatKzt } from '@/shared/utils';
import { Photo, StatusBadge } from '@/shared/components/ui';

interface OfficeCardProps {
  office: Office;
  /** Link target. When omitted the card is a static preview (e.g. on the landing page). */
  to?: string;
}

export const OfficeCard = ({ office, to }: OfficeCardProps) => {
  const { t } = useTranslation();

  const body = (
    <>
      <div className="relative aspect-[4/3]">
        <Photo name={office.photo} alt={office.title} className="h-full w-full" imgClassName="transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3">{StatusBadge.space(office.status)}</div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="eyebrow">{t(`office.type.${office.type}`)} · {t('office.floor')} {office.floor}</div>
          <span className="text-xs text-ink-subtle">#{office.code}</span>
        </div>
        <h3 className="mt-1.5 font-display text-xl tracking-tight">{office.title}</h3>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
          {office.area > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Maximize className="h-3.5 w-3.5" /> {office.area} m²
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> {office.capacity} {t(office.capacity === 1 ? 'office.seat' : 'office.seats')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5" /> {t('office.level')} {office.floor}
          </span>
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
          <div>
            <div className="font-display text-lg tracking-tight">{formatKzt(office.monthlyPrice, t('office.onRequest'))}</div>
            {office.monthlyPrice !== null && <div className="text-xs text-ink-subtle">{t('office.perMonth')}</div>}
          </div>
          {to && <span className="text-sm font-medium text-accent group-hover:underline">{t('office.viewDetails')} →</span>}
        </div>
      </div>
    </>
  );

  if (!to) {
    return <div className="group card overflow-hidden">{body}</div>;
  }
  return (
    <Link to={to} className="group card overflow-hidden transition-shadow hover:shadow-card-hover">
      {body}
    </Link>
  );
};
