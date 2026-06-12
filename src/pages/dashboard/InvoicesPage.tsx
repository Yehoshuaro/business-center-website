import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, CreditCard } from 'lucide-react';
import type { Invoice } from '@/shared/types';
import { useAuthStore } from '@/store/auth';
import { useInvoicesStore, invoiceTotal } from '@/store/invoices';
import { useSettingsStore } from '@/store/settings';
import { formatKzt, formatDay } from '@/shared/utils';
import { DashHeader, StatusBadge, Modal, EmptyState, Metric } from '@/shared/components/ui';

export const InvoicesPage = () => {
  const { t } = useTranslation();
  const session = useAuthStore((s) => s.session)!;
  const { items, setStatus } = useInvoicesStore();
  const settings = useSettingsStore((s) => s.settings);
  const [active, setActive] = useState<Invoice | null>(null);

  const myInvoices = items
    .filter((i) => i.tenantId === session.tenantId)
    .sort((a, b) => +new Date(b.issuedAt) - +new Date(a.issuedAt));
  const outstanding = myInvoices.filter((i) => i.status !== 'paid');
  const outstandingTotal = outstanding.reduce((s, i) => s + invoiceTotal(i), 0);
  const paidThisYear = myInvoices.filter((i) => i.status === 'paid').reduce((s, i) => s + invoiceTotal(i), 0);

  return (
    <>
      <DashHeader title={t('dashboard.invoices.title')} subtitle={t('dashboard.invoices.subtitle')} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric label={t('dashboard.invoices.outstanding')} value={formatKzt(outstandingTotal)} hint={t('dashboard.invoices.outstandingHint', { count: outstanding.length })} icon="Receipt" />
        <Metric label={t('dashboard.invoices.paid')} value={formatKzt(paidThisYear)} icon="CircleCheck" />
        <Metric label={t('dashboard.invoices.total')} value={myInvoices.length} icon="Files" />
      </div>

      {myInvoices.length === 0 ? (
        <EmptyState icon="Receipt" title={t('dashboard.invoices.noneTitle')} description={t('dashboard.invoices.noneDesc')} />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('dashboard.invoices.colInvoice')}</th><th>{t('dashboard.invoices.colPeriod')}</th><th>{t('dashboard.invoices.colIssued')}</th><th>{t('dashboard.invoices.colDue')}</th><th>{t('dashboard.invoices.colAmount')}</th><th>{t('dashboard.invoices.colStatus')}</th><th></th></tr></thead>
            <tbody>
              {myInvoices.map((i) => (
                <tr key={i.id} className="cursor-pointer" onClick={() => setActive(i)}>
                  <td className="font-medium">{i.number}</td>
                  <td>{i.period}</td>
                  <td>{formatDay(i.issuedAt)}</td>
                  <td>{formatDay(i.dueAt)}</td>
                  <td>{formatKzt(invoiceTotal(i))}</td>
                  <td>{StatusBadge.invoice(i.status)}</td>
                  <td className="text-right"><span className="text-sm text-accent">{t('dashboard.actions.view')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {active && (
        <Modal
          open
          onClose={() => setActive(null)}
          title={active.number}
          description={t('dashboard.invoices.issued', { period: active.period, date: formatDay(active.issuedAt) })}
          footer={
            <>
              <button className="btn-secondary" onClick={() => window.print()}><Download className="h-4 w-4" /> {t('dashboard.invoices.downloadPdf')}</button>
              {active.status !== 'paid' && (
                <button className="btn-primary" onClick={() => { setStatus(active.id, 'paid'); setActive(null); }}><CreditCard className="h-4 w-4" /> {t('dashboard.invoices.markPaid')}</button>
              )}
            </>
          }
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="font-display text-xl">{settings.centerName}</div>
              <div className="text-sm text-ink-muted">{settings.address}, {settings.city}</div>
            </div>
            {StatusBadge.invoice(active.status)}
          </div>
          <div className="mt-6 flex justify-between border-y border-line py-3 text-sm">
            <span className="text-ink-muted">{t('dashboard.invoices.billingPeriod')}</span><span>{active.period}</span>
          </div>
          <div className="flex justify-between border-b border-line py-3 text-sm">
            <span className="text-ink-muted">{t('dashboard.invoices.dueDate')}</span><span>{formatDay(active.dueAt)}</span>
          </div>

          <table className="mt-6 w-full text-sm">
            <thead><tr className="border-b border-line text-left text-ink-muted"><th className="py-2 font-medium">{t('dashboard.invoices.description')}</th><th className="py-2 text-right font-medium">{t('dashboard.invoices.amount')}</th></tr></thead>
            <tbody>
              {active.lines.map((l, idx) => (
                <tr key={idx} className="border-b border-line"><td className="py-2.5">{l.label}</td><td className="py-2.5 text-right">{formatKzt(l.amount)}</td></tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td className="pt-4 font-display text-lg">{t('dashboard.invoices.total2')}</td><td className="pt-4 text-right font-display text-lg">{formatKzt(invoiceTotal(active))}</td></tr>
            </tfoot>
          </table>
        </Modal>
      )}
    </>
  );
};
