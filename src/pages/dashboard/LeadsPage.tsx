import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, List, Send, Trash2 } from 'lucide-react';
import type { Lead, LeadStatus } from '@/shared/types';
import { useLeadsStore } from '@/store/leads';
import { useAuthStore } from '@/store/auth';
import { formatKzt, formatRelative, cn } from '@/shared/utils';
import { DashHeader, StatusBadge, Modal, Avatar, Field, EmptyState, Metric, ConfirmDialog } from '@/shared/components/ui';

const STATUSES: LeadStatus[] = ['new', 'contacted', 'touring', 'negotiation', 'won', 'lost'];

export const LeadsPage = () => {
  const { t } = useTranslation();
  const interestLabel = (i: Lead['interest']) => t(`dashboard.interest.${i}`);
  const { items, setStatus, addNote, remove } = useLeadsStore();
  const [view, setView] = useState<'board' | 'list'>('board');
  const [active, setActive] = useState<Lead | null>(null);

  const open = items.filter((l) => !['won', 'lost'].includes(l.status));
  const pipeline = open.reduce((s, l) => s + l.estimatedValue, 0);
  const won = items.filter((l) => l.status === 'won').length;

  const activeLead = active ? items.find((l) => l.id === active.id) ?? null : null;

  return (
    <>
      <DashHeader
        title={t('dashboard.leads.title')}
        subtitle={t('dashboard.leads.subtitle')}
        actions={
          <div className="flex border border-line">
            <button className={cn('btn-ghost btn-sm rounded-none', view === 'board' && 'bg-surface-2')} onClick={() => setView('board')}><LayoutGrid className="h-4 w-4" /> {t('dashboard.leads.board')}</button>
            <button className={cn('btn-ghost btn-sm rounded-none', view === 'list' && 'bg-surface-2')} onClick={() => setView('list')}><List className="h-4 w-4" /> {t('dashboard.leads.list')}</button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric label={t('dashboard.leads.open')} value={open.length} icon="Target" />
        <Metric label={t('dashboard.leads.pipeline')} value={formatKzt(pipeline)} hint={t('dashboard.leads.pipelineHint')} icon="TrendingUp" />
        <Metric label={t('dashboard.leads.won')} value={won} icon="CircleCheck" />
      </div>

      {view === 'board' ? (
        <div className="grid grid-flow-col auto-cols-[minmax(15rem,1fr)] gap-4 overflow-x-auto pb-4">
          {STATUSES.map((status) => {
            const colLeads = items.filter((l) => l.status === status);
            return (
              <div key={status} className="flex flex-col">
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="text-sm font-medium">{t(`dashboard.status.lead.${status}`)}</span>
                  <span className="text-xs text-ink-subtle">{colLeads.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {colLeads.map((l) => (
                    <button key={l.id} onClick={() => setActive(l)} className="card p-3 text-left transition-shadow hover:shadow-card-hover">
                      <div className="flex items-center gap-2">
                        <Avatar name={l.name} className="h-7 w-7 text-[10px]" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{l.name}</div>
                          <div className="truncate text-xs text-ink-subtle">{l.company ?? interestLabel(l.interest)}</div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-ink-muted">
                        <span>{l.estimatedValue ? formatKzt(l.estimatedValue) : '—'}</span>
                        <span>{formatRelative(l.createdAt)}</span>
                      </div>
                    </button>
                  ))}
                  {colLeads.length === 0 && <div className="border border-dashed border-line p-3 text-center text-xs text-ink-subtle">{t('dashboard.common.empty')}</div>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('dashboard.leads.colName')}</th><th>{t('dashboard.leads.colInterest')}</th><th>{t('dashboard.leads.colSource')}</th><th>{t('dashboard.leads.colValue')}</th><th>{t('dashboard.leads.colCreated')}</th><th>{t('dashboard.leads.colStatus')}</th></tr></thead>
            <tbody>
              {items.map((l) => (
                <tr key={l.id} className="cursor-pointer" onClick={() => setActive(l)}>
                  <td><div className="font-medium">{l.name}</div><div className="text-xs text-ink-subtle">{l.company ?? l.email}</div></td>
                  <td>{interestLabel(l.interest)}</td>
                  <td>{l.source}</td>
                  <td>{l.estimatedValue ? formatKzt(l.estimatedValue) : '—'}</td>
                  <td>{formatRelative(l.createdAt)}</td>
                  <td>{StatusBadge.lead(l.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {items.length === 0 && <EmptyState icon="Target" title={t('dashboard.leads.noneTitle')} description={t('dashboard.leads.noneDesc')} />}

      {activeLead && (
        <LeadDetail
          lead={activeLead}
          onClose={() => setActive(null)}
          onStatus={(s) => setStatus(activeLead.id, s)}
          onNote={(text) => addNote(activeLead.id, useAuthStore.getState().session?.fullName ?? 'Manager', text)}
          onDelete={() => { remove(activeLead.id); setActive(null); }}
        />
      )}
    </>
  );
};

const LeadDetail = ({ lead, onClose, onStatus, onNote, onDelete }: {
  lead: Lead; onClose: () => void; onStatus: (s: LeadStatus) => void; onNote: (text: string) => void; onDelete: () => void;
}) => {
  const { t } = useTranslation();
  const interestLabel = (i: Lead['interest']) => t(`dashboard.interest.${i}`);
  const [note, setNote] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <Modal open onClose={onClose} title={lead.name} description={lead.company ?? interestLabel(lead.interest)}>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><div className="eyebrow">{t('dashboard.leads.email')}</div><div className="mt-1 break-words">{lead.email}</div></div>
          <div><div className="eyebrow">{t('dashboard.leads.phone')}</div><div className="mt-1">{lead.phone}</div></div>
          <div><div className="eyebrow">{t('dashboard.leads.interest')}</div><div className="mt-1">{interestLabel(lead.interest)}</div></div>
          <div><div className="eyebrow">{t('dashboard.leads.estValue')}</div><div className="mt-1">{lead.estimatedValue ? formatKzt(lead.estimatedValue) : '—'}</div></div>
          <div><div className="eyebrow">{t('dashboard.leads.source')}</div><div className="mt-1">{lead.source}</div></div>
          <div><div className="eyebrow">{t('dashboard.leads.received')}</div><div className="mt-1">{formatRelative(lead.createdAt)}</div></div>
        </div>

        <div>
          <div className="eyebrow mb-1">{t('dashboard.leads.message')}</div>
          <p className="border border-line bg-surface-2 p-3 text-sm">{lead.message}</p>
        </div>

        <Field label={t('dashboard.leads.stage')}>
          <select value={lead.status} onChange={(e) => onStatus(e.target.value as LeadStatus)}>
            {STATUSES.map((s) => <option key={s} value={s}>{t(`dashboard.status.lead.${s}`)}</option>)}
          </select>
        </Field>

        <div>
          <div className="eyebrow mb-2">{t('dashboard.leads.notes', { count: lead.notes.length })}</div>
          <div className="space-y-2">
            {lead.notes.map((n) => (
              <div key={n.id} className="border border-line bg-surface-2 p-3 text-sm">
                <div className="flex justify-between text-xs text-ink-subtle"><span>{n.author}</span><span>{formatRelative(n.createdAt)}</span></div>
                <p className="mt-1">{n.text}</p>
              </div>
            ))}
            {lead.notes.length === 0 && <p className="text-sm text-ink-subtle">{t('dashboard.leads.noNotes')}</p>}
          </div>
          <div className="mt-3 flex gap-2">
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('dashboard.leads.addNote')} onKeyDown={(e) => { if (e.key === 'Enter' && note.trim()) { onNote(note.trim()); setNote(''); } }} />
            <button className="btn-primary shrink-0" disabled={!note.trim()} onClick={() => { onNote(note.trim()); setNote(''); }}><Send className="h-4 w-4" /></button>
          </div>
        </div>

        <button className="btn-danger w-full" onClick={() => setConfirmDelete(true)}><Trash2 className="h-4 w-4" /> {t('dashboard.leads.deleteLead')}</button>
      </div>

      <ConfirmDialog open={confirmDelete} title={t('dashboard.leads.deleteTitle')} confirmLabel={t('dashboard.actions.delete')} danger onConfirm={onDelete} onCancel={() => setConfirmDelete(false)} />
    </Modal>
  );
};
