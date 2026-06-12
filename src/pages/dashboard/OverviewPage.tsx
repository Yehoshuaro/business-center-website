import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useOfficesStore } from '@/store/offices';
import { useTenantsStore } from '@/store/tenants';
import { useLeadsStore } from '@/store/leads';
import { useBookingsStore } from '@/store/bookings';
import { useMaintenanceStore } from '@/store/maintenance';
import { useInvoicesStore, invoiceTotal } from '@/store/invoices';
import { formatKzt, formatKztCompact, formatDay, formatRelative } from '@/shared/utils';
import { DashHeader, Metric, StatusBadge, EmptyState, Avatar } from '@/shared/components/ui';

export const OverviewPage = () => {
  const { t } = useTranslation();
  const session = useAuthStore((s) => s.session)!;
  const offices = useOfficesStore((s) => s.items);
  const tenants = useTenantsStore((s) => s.items);
  const leads = useLeadsStore((s) => s.items);
  const bookings = useBookingsStore((s) => s.items);
  const maintenance = useMaintenanceStore((s) => s.items);
  const invoices = useInvoicesStore((s) => s.items);

  if (session.role === 'viewer') {
    return <TenantOverview />;
  }

  // Manager / admin analytics
  const available = offices.filter((o) => o.status === 'available').length;
  const occupiedRate = Math.round((offices.filter((o) => o.status === 'occupied').length / offices.length) * 100);
  const openLeads = leads.filter((l) => !['won', 'lost'].includes(l.status));
  const pipeline = openLeads.reduce((sum, l) => sum + l.estimatedValue, 0);
  const openMaintenance = maintenance.filter((m) => m.status === 'open' || m.status === 'in-progress');
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const recentLeads = [...leads].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5);

  return (
    <>
      <DashHeader
        title={t('dashboard.overview.welcomeBack', { name: session.fullName.split(' ')[0] })}
        subtitle={t('dashboard.overview.subtitle')}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label={t('dashboard.overview.occupancy')} value={`${occupiedRate}%`} hint={t('dashboard.overview.occupancyHint')} icon="Building" trend={{ value: '2.4%', positive: true }} />
        <Metric label={t('dashboard.overview.available')} value={available} hint={t('dashboard.overview.availableHint')} icon="DoorOpen" />
        <Metric label={t('dashboard.overview.pipeline')} value={formatKztCompact(pipeline)} hint={t('dashboard.overview.pipelineHint', { count: openLeads.length })} icon="Target" />
        <Metric label={t('dashboard.overview.residents')} value={tenants.filter((t) => t.isPublished).length} hint={t('dashboard.overview.residentsHint')} icon="Briefcase" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent leads */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-lg">{t('dashboard.overview.recentLeads')}</h2>
            <Link to="/dashboard/leads" className="text-sm text-accent hover:underline">{t('dashboard.actions.viewAll')}</Link>
          </div>
          <div className="divide-y divide-line">
            {recentLeads.map((l) => (
              <div key={l.id} className="flex items-center gap-4 px-5 py-3">
                <Avatar name={l.name} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{l.name}</div>
                  <div className="truncate text-sm text-ink-muted">{l.company ?? l.email}</div>
                </div>
                <div className="hidden text-right text-sm sm:block">
                  <div>{l.estimatedValue ? formatKzt(l.estimatedValue) : '—'}</div>
                  <div className="text-xs text-ink-subtle">{formatRelative(l.createdAt)}</div>
                </div>
                {StatusBadge.lead(l.status)}
              </div>
            ))}
          </div>
        </div>

        {/* Action items */}
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="font-display text-lg">{t('dashboard.overview.needsAttention')}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-ink-muted">{t('dashboard.overview.pendingBookings')}</span>
                <Link to="/dashboard/bookings" className="font-medium hover:underline">{pendingBookings.length}</Link>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-ink-muted">{t('dashboard.overview.openMaintenance')}</span>
                <Link to="/dashboard/maintenance" className="font-medium hover:underline">{openMaintenance.length}</Link>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-ink-muted">{t('dashboard.overview.newLeadsToday')}</span>
                <Link to="/dashboard/leads" className="font-medium hover:underline">{leads.filter((l) => formatRelative(l.createdAt) === 'today').length}</Link>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-ink-muted">{t('dashboard.overview.overdueInvoices')}</span>
                <span className="font-medium text-danger">{invoices.filter((i) => i.status === 'overdue').length}</span>
              </li>
            </ul>
          </div>

          <div className="card p-5">
            <h2 className="font-display text-lg">{t('dashboard.overview.quickActions')}</h2>
            <div className="mt-4 grid gap-2">
              <Link to="/dashboard/leads" className="btn-secondary justify-between">{t('dashboard.overview.manageLeads')} <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/dashboard/spaces" className="btn-secondary justify-between">{t('dashboard.overview.manageSpaces')} <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/dashboard/bookings" className="btn-secondary justify-between">{t('dashboard.overview.reviewBookings')} <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
// Tenant (viewer) overview
// ---------------------------------------------------------------------------
const TenantOverview = () => {
  const { t } = useTranslation();
  const session = useAuthStore((s) => s.session)!;
  const tenants = useTenantsStore((s) => s.items);
  const offices = useOfficesStore((s) => s.items);
  const invoices = useInvoicesStore((s) => s.items);
  const maintenance = useMaintenanceStore((s) => s.items);
  const bookings = useBookingsStore((s) => s.items);

  const tenant = tenants.find((t) => t.id === session.tenantId);
  const mySpaces = offices.filter((o) => o.tenantId === session.tenantId);
  const myInvoices = invoices.filter((i) => i.tenantId === session.tenantId);
  const outstanding = myInvoices.filter((i) => i.status !== 'paid');
  const myRequests = maintenance.filter((m) => m.tenantId === session.tenantId);
  const openRequests = myRequests.filter((m) => m.status === 'open' || m.status === 'in-progress');
  const myBookings = bookings.filter((b) => b.tenantId === session.tenantId && b.status !== 'cancelled');

  return (
    <>
      <DashHeader
        title={t('dashboard.overview.welcome', { name: session.fullName.split(' ')[0] })}
        subtitle={tenant ? `${tenant.companyName} · ${t('dashboard.spaces.colSpace')} ${tenant.officeCode}` : t('dashboard.overview.tenantFallback')}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label={t('dashboard.overview.leasedSpaces')} value={mySpaces.length} hint={t('dashboard.overview.leasedHint')} icon="Building" />
        <Metric label={t('dashboard.overview.outstanding')} value={formatKztCompact(outstanding.reduce((s, i) => s + invoiceTotal(i), 0))} hint={t('dashboard.overview.outstandingHint', { count: outstanding.length })} icon="Receipt" />
        <Metric label={t('dashboard.overview.openRequests')} value={openRequests.length} hint={t('dashboard.overview.openRequestsHint')} icon="Wrench" />
        <Metric label={t('dashboard.overview.upcomingBookings')} value={myBookings.length} hint={t('dashboard.overview.upcomingHint')} icon="CalendarDays" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-lg">{t('dashboard.overview.yourSpaces')}</h2>
            <Link to="/dashboard/my-spaces" className="text-sm text-accent hover:underline">{t('dashboard.actions.details')}</Link>
          </div>
          {mySpaces.length === 0 ? (
            <div className="p-5"><EmptyState icon="Building" title={t('dashboard.overview.noLeasedSpaces')} description={t('dashboard.overview.noLeasedSpacesDesc')} /></div>
          ) : (
            <div className="divide-y divide-line">
              {mySpaces.map((o) => (
                <div key={o.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="font-medium">{o.title}</div>
                    <div className="text-sm text-ink-muted">#{o.code} · {o.area} m² · {o.capacity} {t('dashboard.common.seats')}</div>
                  </div>
                  <div className="text-right text-sm">{o.monthlyPrice ? formatKzt(o.monthlyPrice) : '—'}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-lg">{t('dashboard.overview.recentInvoices')}</h2>
            <Link to="/dashboard/invoices" className="text-sm text-accent hover:underline">{t('dashboard.overview.allInvoices')}</Link>
          </div>
          <div className="divide-y divide-line">
            {myInvoices.slice(0, 4).map((i) => (
              <div key={i.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <div className="font-medium">{i.number}</div>
                  <div className="text-sm text-ink-muted">{i.period} · {t('dashboard.overview.due', { date: formatDay(i.dueAt) })}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{formatKzt(invoiceTotal(i))}</span>
                  {StatusBadge.invoice(i.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
