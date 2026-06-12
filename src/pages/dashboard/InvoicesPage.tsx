import { useState } from 'react';
import { Download, CreditCard } from 'lucide-react';
import type { Invoice } from '@/shared/types';
import { useAuthStore } from '@/store/auth';
import { useInvoicesStore, invoiceTotal } from '@/store/invoices';
import { useSettingsStore } from '@/store/settings';
import { formatKzt, formatDay } from '@/shared/utils';
import { DashHeader, StatusBadge, Modal, EmptyState, Metric } from '@/shared/components/ui';

export const InvoicesPage = () => {
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
      <DashHeader title="Invoices" subtitle="Your billing history and outstanding balance." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric label="Outstanding" value={formatKzt(outstandingTotal)} hint={`${outstanding.length} unpaid`} icon="Receipt" />
        <Metric label="Paid to date" value={formatKzt(paidThisYear)} icon="CircleCheck" />
        <Metric label="Total invoices" value={myInvoices.length} icon="Files" />
      </div>

      {myInvoices.length === 0 ? (
        <EmptyState icon="Receipt" title="No invoices yet" description="Your invoices will appear here once issued." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Invoice</th><th>Period</th><th>Issued</th><th>Due</th><th>Amount</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {myInvoices.map((i) => (
                <tr key={i.id} className="cursor-pointer" onClick={() => setActive(i)}>
                  <td className="font-medium">{i.number}</td>
                  <td>{i.period}</td>
                  <td>{formatDay(i.issuedAt)}</td>
                  <td>{formatDay(i.dueAt)}</td>
                  <td>{formatKzt(invoiceTotal(i))}</td>
                  <td>{StatusBadge.invoice(i.status)}</td>
                  <td className="text-right"><span className="text-sm text-accent">View</span></td>
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
          description={`${active.period} · issued ${formatDay(active.issuedAt)}`}
          footer={
            <>
              <button className="btn-secondary" onClick={() => window.print()}><Download className="h-4 w-4" /> Download PDF</button>
              {active.status !== 'paid' && (
                <button className="btn-primary" onClick={() => { setStatus(active.id, 'paid'); setActive(null); }}><CreditCard className="h-4 w-4" /> Mark as paid</button>
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
            <span className="text-ink-muted">Billing period</span><span>{active.period}</span>
          </div>
          <div className="flex justify-between border-b border-line py-3 text-sm">
            <span className="text-ink-muted">Due date</span><span>{formatDay(active.dueAt)}</span>
          </div>

          <table className="mt-6 w-full text-sm">
            <thead><tr className="border-b border-line text-left text-ink-muted"><th className="py-2 font-medium">Description</th><th className="py-2 text-right font-medium">Amount</th></tr></thead>
            <tbody>
              {active.lines.map((l, idx) => (
                <tr key={idx} className="border-b border-line"><td className="py-2.5">{l.label}</td><td className="py-2.5 text-right">{formatKzt(l.amount)}</td></tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td className="pt-4 font-display text-lg">Total</td><td className="pt-4 text-right font-display text-lg">{formatKzt(invoiceTotal(active))}</td></tr>
            </tfoot>
          </table>
        </Modal>
      )}
    </>
  );
};
