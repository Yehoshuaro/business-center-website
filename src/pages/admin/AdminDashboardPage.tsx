import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useOfficesStore } from '@/features/offices/store';
import { useConferenceRoomsStore } from '@/features/conferenceRooms/store';
import { useTenantsStore } from '@/features/tenants/store';
import { useLeadsStore } from '@/features/leads/store';
import { MetricCard, LeadStatusBadge, PageHeader } from '@/shared/components/ui';
import { formatDate } from '@/shared/utils';

export const AdminDashboardPage = () => {
  const { t, language } = useT();
  const offices = useOfficesStore((s) => s.items);
  const rooms = useConferenceRoomsStore((s) => s.items);
  const tenants = useTenantsStore((s) => s.items);
  const leads = useLeadsStore((s) => s.items);

  const locale = ({ kk: 'kk-KZ', ru: 'ru-RU', en: 'en-US' } as const)[language];
  const available = offices.filter((o) => o.status === 'available').length;
  const recentLeads = [...leads]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  return (
    <>
      <PageHeader eyebrow={t('admin.dashboard')} title={t('admin.dashboard')} />

      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-8 sm:mb-10">
        <MetricCard label={t('admin.metrics.offices')} value={offices.length} />
        <MetricCard label={t('admin.metrics.available')} value={available} />
        <MetricCard label={t('admin.metrics.leads')} value={leads.length} />
        <MetricCard label={t('admin.metrics.tenants')} value={tenants.length} />
        <MetricCard label={t('admin.metrics.rooms')} value={rooms.length} className="col-span-2 md:col-span-1" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-line">
          <h2 className="font-medium tracking-tight">{t('admin.recentLeads')}</h2>
          <Link to="/site/admin/leads" className="text-xs link-underline inline-flex items-center gap-1 shrink-0">
            {t('admin.section.list')} <ArrowUpRight size={12} />
          </Link>
        </div>

        {/* Desktop / tablet */}
        <div className="table-wrap border-0 hidden md:block">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('form.name')}</th>
                <th>{t('form.phone')}</th>
                <th>{t('form.interest')}</th>
                <th>{t('common.status')}</th>
                <th>{t('form.message')}</th>
                <th className="text-right">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td className="font-medium">
                    <Link to="/site/admin/leads" className="hover:text-accent">{lead.name}</Link>
                  </td>
                  <td className="text-ink-muted whitespace-nowrap">{lead.phone}</td>
                  <td className="text-ink-muted">{t(`interest.${lead.interestType}`)}</td>
                  <td><LeadStatusBadge status={lead.status} /></td>
                  <td className="text-ink-muted text-xs max-w-[260px] truncate">{lead.message}</td>
                  <td className="text-right text-xs text-ink-muted whitespace-nowrap">
                    {formatDate(lead.createdAt, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <ul className="md:hidden divide-y divide-line">
          {recentLeads.map((lead) => (
            <li key={lead.id} className="p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <Link to="/site/admin/leads" className="font-medium break-words hover:text-accent">
                  {lead.name}
                </Link>
                <LeadStatusBadge status={lead.status} />
              </div>
              <div className="text-sm text-ink-muted break-words">{lead.phone}</div>
              <div className="text-xs text-ink-muted">
                {t(`interest.${lead.interestType}`)} · {formatDate(lead.createdAt, locale)}
              </div>
              {lead.message && (
                <p className="text-xs text-ink-muted line-clamp-2 break-words">{lead.message}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
