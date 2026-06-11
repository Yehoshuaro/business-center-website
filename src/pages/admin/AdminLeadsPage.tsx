import { useMemo, useState } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useLeadsStore } from '@/features/leads/store';
import { useAuthStore } from '@/features/auth/store';
import type { Lead, LeadStatus } from '@/shared/types';
import { PageHeader, LeadStatusBadge, ConfirmDialog, EmptyState, Modal } from '@/shared/components/ui';
import { formatDate } from '@/shared/utils';

const STATUSES: LeadStatus[] = ['new', 'contacted', 'inProgress', 'closed'];

export const AdminLeadsPage = () => {
  const { t, language } = useT();
  const leads = useLeadsStore((s) => s.items);
  const setStatus = useLeadsStore((s) => s.setStatus);
  const remove = useLeadsStore((s) => s.remove);
  const addComment = useLeadsStore((s) => s.addComment);
  const session = useAuthStore((s) => s.session);

  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const locale = ({ kk: 'kk-KZ', ru: 'ru-RU', en: 'en-US' } as const)[language];

  const filtered = useMemo(() => {
    return [...leads]
      .filter((l) => statusFilter === 'all' || l.status === statusFilter)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [leads, statusFilter]);

  // Always read the latest version of the currently-selected lead from the store
  const currentLead = selected ? leads.find((l) => l.id === selected.id) ?? null : null;

  const submitComment = () => {
    if (!currentLead || !commentText.trim()) return;
    addComment(currentLead.id, session?.fullName ?? 'Manager', commentText.trim());
    setCommentText('');
  };

  return (
    <>
      <PageHeader eyebrow={t('admin.section.list')} title={t('admin.leads')} />

      <div className="card p-4 mb-6 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-end">
        <div className="sm:max-w-[220px] sm:flex-1">
          <label className="field-label">{t('common.status')}</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
          >
            <option value="all">{t('common.all')}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{t(`leadStatus.${s}`)}</option>
            ))}
          </select>
        </div>
        <div className="text-xs text-ink-muted sm:ml-auto">
          {filtered.length} / {leads.length}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="table-wrap hidden md:block">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('form.name')}</th>
                  <th>{t('form.phone')}</th>
                  <th>{t('form.interest')}</th>
                  <th>{t('common.status')}</th>
                  <th>Created</th>
                  <th className="text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="font-medium">{lead.name}</div>
                      {lead.email && <div className="text-xs text-ink-subtle break-all">{lead.email}</div>}
                    </td>
                    <td className="text-ink-muted whitespace-nowrap">{lead.phone}</td>
                    <td className="text-ink-muted">{t(`interest.${lead.interestType}`)}</td>
                    <td><LeadStatusBadge status={lead.status} /></td>
                    <td className="text-xs text-ink-muted whitespace-nowrap">
                      {formatDate(lead.createdAt, locale)}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button type="button" className="btn-ghost btn-sm" onClick={() => setSelected(lead)}>
                          <Eye size={14} />
                        </button>
                        <button type="button" className="btn-danger btn-sm" onClick={() => setConfirmId(lead.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="stack-cards md:hidden">
            {filtered.map((lead) => (
              <div key={lead.id} className="stack-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-base break-words">{lead.name}</div>
                    {lead.email && (
                      <div className="text-xs text-ink-subtle break-all mt-1">{lead.email}</div>
                    )}
                  </div>
                  <LeadStatusBadge status={lead.status} />
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-ink-muted">
                      {t('form.phone')}
                    </dt>
                    <dd className="break-words">{lead.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-ink-muted">
                      {t('form.interest')}
                    </dt>
                    <dd className="break-words">{t(`interest.${lead.interestType}`)}</dd>
                  </div>
                </dl>
                <div className="text-xs text-ink-muted">{formatDate(lead.createdAt, locale)}</div>
                <div className="stack-card-actions">
                  <button
                    type="button"
                    className="btn-secondary btn-sm flex-1 justify-center"
                    onClick={() => setSelected(lead)}
                  >
                    <Eye size={14} /> {t('common.details')}
                  </button>
                  <button
                    type="button"
                    className="btn-danger btn-sm"
                    onClick={() => setConfirmId(lead.id)}
                    aria-label={t('common.delete')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        open={Boolean(currentLead)}
        onClose={() => setSelected(null)}
        size="lg"
        title={currentLead?.name ?? ''}
      >
        {currentLead && (
          <>
            <div className="eyebrow mb-1">{t('form.interest')}: {t(`interest.${currentLead.interestType}`)}</div>
            <div className="text-xs text-ink-muted mb-5">
              {formatDate(currentLead.createdAt, locale)}
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-5 text-sm">
              <div>
                <div className="eyebrow mb-1">{t('form.phone')}</div>
                <div className="break-words">{currentLead.phone}</div>
              </div>
              <div>
                <div className="eyebrow mb-1">{t('form.email')}</div>
                <div className="break-all">{currentLead.email || '—'}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="eyebrow mb-1">{t('form.message')}</div>
                <div className="text-ink-muted whitespace-pre-wrap break-words">{currentLead.message || '—'}</div>
              </div>
            </div>

            <div className="border-t border-line pt-5 mb-5">
              <div className="eyebrow mb-2">{t('common.status')}</div>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(currentLead.id, s)}
                    className={
                      currentLead.status === s ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'
                    }
                  >
                    {t(`leadStatus.${s}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-line pt-5">
              <div className="eyebrow mb-3">{t('admin.comments')}</div>
              {currentLead.comments.length === 0 ? (
                <p className="text-sm text-ink-muted mb-4">{t('admin.noComments')}</p>
              ) : (
                <ul className="space-y-3 mb-4">
                  {currentLead.comments.map((c) => (
                    <li key={c.id} className="border border-line bg-surface-2 p-3">
                      <div className="flex flex-wrap justify-between gap-2 text-xs text-ink-muted mb-1">
                        <span className="font-medium text-ink break-words">{c.author}</span>
                        <span>{formatDate(c.createdAt, locale)}</span>
                      </div>
                      <div className="text-sm whitespace-pre-wrap break-words">{c.text}</div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-col gap-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t('admin.addComment')}
                  className="min-h-[80px]"
                />
                <button
                  type="button"
                  className="btn-primary self-end"
                  onClick={submitComment}
                  disabled={!commentText.trim()}
                >
                  {t('admin.addComment')}
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmId !== null}
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) {
            remove(confirmId);
            if (selected && selected.id === confirmId) setSelected(null);
          }
          setConfirmId(null);
        }}
      />
    </>
  );
};
