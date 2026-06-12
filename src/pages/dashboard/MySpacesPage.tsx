import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, Maximize, Users, Building, CalendarDays } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useOfficesStore } from '@/store/offices';
import { useTenantsStore } from '@/store/tenants';
import { useBookingsStore } from '@/store/bookings';
import { useMeetingRoomsStore } from '@/store/meetingRooms';
import { formatKzt, formatDay } from '@/shared/utils';
import { DashHeader, Photo, StatusBadge, EmptyState } from '@/shared/components/ui';

export const MySpacesPage = () => {
  const { t } = useTranslation();
  const session = useAuthStore((s) => s.session)!;
  const offices = useOfficesStore((s) => s.items);
  const tenants = useTenantsStore((s) => s.items);
  const bookings = useBookingsStore((s) => s.items);
  const rooms = useMeetingRoomsStore((s) => s.items);

  const tenant = tenants.find((t) => t.id === session.tenantId);
  const mySpaces = offices.filter((o) => o.tenantId === session.tenantId);
  const myBookings = bookings
    .filter((b) => b.tenantId === session.tenantId && b.status !== 'cancelled')
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  const roomName = (id: string) => rooms.find((r) => r.id === id)?.name ?? '—';

  return (
    <>
      <DashHeader
        title={t('dashboard.mySpaces.title')}
        subtitle={tenant ? t('dashboard.mySpaces.subtitle', { company: tenant.companyName, date: formatDay(tenant.since) }) : t('dashboard.mySpaces.fallback')}
        actions={<Link to="/dashboard/maintenance" className="btn-secondary">{t('dashboard.mySpaces.reportIssue')}</Link>}
      />

      {mySpaces.length === 0 ? (
        <EmptyState icon="Building" title={t('dashboard.mySpaces.noneTitle')} description={t('dashboard.mySpaces.noneDesc')} />
      ) : (
        <div className="grid gap-6">
          {mySpaces.map((o) => (
            <div key={o.id} className="card overflow-hidden lg:flex">
              <Photo name={o.photo} alt={o.title} className="aspect-[16/10] lg:aspect-auto lg:w-72 lg:shrink-0" />
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="eyebrow">#{o.code}</div>
                    <h2 className="font-display text-2xl">{o.title}</h2>
                  </div>
                  {StatusBadge.space(o.status)}
                </div>
                <p className="mt-2 text-sm text-ink-muted">{o.description}</p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
                  <span className="inline-flex items-center gap-1.5"><Maximize className="h-4 w-4" /> {o.area} m²</span>
                  <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {o.capacity} {t('dashboard.common.seats')}</span>
                  <span className="inline-flex items-center gap-1.5"><Building className="h-4 w-4" /> {t('dashboard.common.floor')} {o.floor}</span>
                  <span className="font-medium text-ink">{formatKzt(o.monthlyPrice)} {t('dashboard.common.perMonth')}</span>
                </div>
                <div className="mt-5 border-t border-line pt-4">
                  <div className="eyebrow mb-2">{t('dashboard.mySpaces.included')}</div>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {o.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-ink-muted"><Check className="h-4 w-4 text-success" /> {f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming bookings */}
      <div className="mt-8">
        <h2 className="mb-3 font-display text-xl">{t('dashboard.mySpaces.upcoming')}</h2>
        {myBookings.length === 0 ? (
          <div className="card p-6 text-sm text-ink-muted">
            {t('dashboard.mySpaces.noUpcoming')} <Link to="/dashboard/maintenance" className="link-underline">{t('dashboard.mySpaces.contactReception')}</Link> {t('dashboard.mySpaces.orManager')}
          </div>
        ) : (
          <div className="grid gap-3">
            {myBookings.map((b) => (
              <div key={b.id} className="card flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border border-line text-accent"><CalendarDays className="h-5 w-5" /></div>
                  <div>
                    <div className="font-medium">{b.title}</div>
                    <div className="text-sm text-ink-muted">{roomName(b.roomId)} · {formatDay(b.date)} · {b.startTime}–{b.endTime}</div>
                  </div>
                </div>
                {StatusBadge.booking(b.status)}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
