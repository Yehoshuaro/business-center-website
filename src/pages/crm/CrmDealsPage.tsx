import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import {
  useCrmStore,
  useCrmCanEdit,
  DEAL_STAGES,
  type Deal,
  type DealStage,
} from '@/features/crm/store';
import { PageHeader, Modal, ConfirmDialog } from '@/shared/components/ui';
import { uid, cn } from '@/shared/utils';

const LOCALE: Record<string, string> = { kk: 'kk-KZ', ru: 'ru-RU', en: 'en-GB' };

const STAGE_TONE: Record<DealStage, string> = {
  new: 'border-t-line-strong',
  qualified: 'border-t-accent/50',
  proposal: 'border-t-accent/70',
  negotiation: 'border-t-accent',
  won: 'border-t-success',
  lost: 'border-t-danger',
};

interface DealForm {
  id: string;
  title: string;
  amount: string;
  clientId: string;
  ownerId: string;
  stage: DealStage;
}

export const CrmDealsPage = () => {
  const { t, language } = useT();
  const locale = LOCALE[language] ?? 'ru-RU';
  const canEdit = useCrmCanEdit();

  const deals = useCrmStore((s) => s.deals);
  const clients = useCrmStore((s) => s.clients);
  const users = useCrmStore((s) => s.users);
  const upsertDeal = useCrmStore((s) => s.upsertDeal);
  const moveDeal = useCrmStore((s) => s.moveDeal);
  const removeDeal = useCrmStore((s) => s.removeDeal);
  const log = useCrmStore((s) => s.log);

  const [form, setForm] = useState<DealForm | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<DealStage | null>(null);

  const clientName = useMemo(() => {
    const map = new Map(clients.map((c) => [c.id, c.company]));
    return (id: string) => map.get(id) ?? '?';
  }, [clients]);

  const fmt = (n: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);

  const openCreate = (stage: DealStage = 'new') => {
    setIsNew(true);
    setForm({
      id: uid(),
      title: '',
      amount: '',
      clientId: clients[0]?.id ?? '',
      ownerId: users.find((u) => u.role === 'manager')?.id ?? users[0]?.id ?? '',
      stage,
    });
  };

  const openEdit = (deal: Deal) => {
    setIsNew(false);
    setForm({
      id: deal.id,
      title: deal.title,
      amount: String(deal.amount),
      clientId: deal.clientId,
      ownerId: deal.ownerId,
      stage: deal.stage,
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    upsertDeal({
      id: form.id,
      title: form.title.trim(),
      amount: Math.max(0, Number(form.amount) || 0),
      clientId: form.clientId,
      ownerId: form.ownerId,
      stage: form.stage,
    });
    log(`${isNew ? t('crm.deal.add') : t('crm.deal.edit')}: ${form.title.trim()}`);
    setForm(null);
  };

  const confirmDelete = () => {
    if (!confirmId) return;
    const deal = deals.find((d) => d.id === confirmId);
    removeDeal(confirmId);
    if (deal) log(`${t('common.delete')}: ${deal.title}`);
    setConfirmId(null);
  };

  const onDrop = (stage: DealStage) => {
    if (dragId) {
      const deal = deals.find((d) => d.id === dragId);
      if (deal && deal.stage !== stage) {
        moveDeal(dragId, stage);
        log(`${deal.title} → ${t(`crm.stage.${stage}`)}`);
      }
    }
    setDragId(null);
    setDragOver(null);
  };

  return (
    <>
      <PageHeader
        title={t('crm.nav.deals')}
        subtitle={canEdit ? t('crm.deal.dragHint') : undefined}
        actions={
          canEdit ? (
            <button type="button" className="btn-primary" onClick={() => openCreate()}>
              <Plus size={16} /> {t('crm.deal.add')}
            </button>
          ) : undefined
        }
      />

      {/* Kanban: horizontal scroll on small screens */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="grid grid-flow-col auto-cols-[260px] sm:auto-cols-[280px] gap-3 min-w-max">
          {DEAL_STAGES.map((stage) => {
            const items = deals.filter((d) => d.stage === stage);
            const total = items.reduce((s, d) => s + d.amount, 0);
            return (
              <section
                key={stage}
                className={cn(
                  'bg-surface border border-line border-t-2 flex flex-col max-h-[70vh]',
                  STAGE_TONE[stage],
                  dragOver === stage && 'ring-1 ring-accent',
                )}
                onDragOver={(e) => {
                  if (!canEdit) return;
                  e.preventDefault();
                  setDragOver(stage);
                }}
                onDragLeave={() => setDragOver((s) => (s === stage ? null : s))}
                onDrop={(e) => {
                  if (!canEdit) return;
                  e.preventDefault();
                  onDrop(stage);
                }}
              >
                <header className="px-3.5 pt-3 pb-2 flex items-baseline justify-between gap-2">
                  <h2 className="text-xs uppercase tracking-wider text-ink-muted">
                    {t(`crm.stage.${stage}`)}
                  </h2>
                  <span className="text-xs text-ink-subtle tabular-nums">{items.length}</span>
                </header>
                <div className="px-3.5 pb-1 text-xs text-ink-muted tabular-nums">{fmt(total)} ₸</div>

                <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-2">
                  {items.map((deal) => (
                    <article
                      key={deal.id}
                      draggable={canEdit}
                      onDragStart={() => setDragId(deal.id)}
                      onDragEnd={() => {
                        setDragId(null);
                        setDragOver(null);
                      }}
                      className={cn(
                        'bg-surface-2 border border-line p-3 group',
                        canEdit && 'cursor-grab active:cursor-grabbing',
                        dragId === deal.id && 'opacity-50',
                      )}
                    >
                      <div className="text-sm font-medium leading-snug mb-1.5">{deal.title}</div>
                      <div className="text-sm tabular-nums mb-1">{fmt(deal.amount)} ₸</div>
                      <div className="text-xs text-ink-muted truncate">{clientName(deal.clientId)}</div>
                      {canEdit && (
                        <div className="mt-2 pt-2 border-t border-line flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <button
                            type="button"
                            className="btn-ghost btn-sm"
                            onClick={() => openEdit(deal)}
                            aria-label={t('common.edit')}
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn-ghost btn-sm text-danger"
                            onClick={() => setConfirmId(deal.id)}
                            aria-label={t('common.delete')}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                  {canEdit && (
                    <button
                      type="button"
                      className="w-full text-left text-xs text-ink-subtle hover:text-ink px-1 py-1.5 transition-colors"
                      onClick={() => openCreate(stage)}
                    >
                      + {t('crm.deal.add')}
                    </button>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <Modal
        open={form !== null}
        onClose={() => setForm(null)}
        title={isNew ? t('crm.deal.add') : t('crm.deal.edit')}
        size="md"
      >
        {form && (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="field-label">{t('crm.deal.title')}</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">{t('crm.deal.amount')}</label>
              <input
                type="number"
                min={0}
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">{t('crm.deal.client')}</label>
                <select
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">{t('crm.deal.owner')}</label>
                <select
                  value={form.ownerId}
                  onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
                >
                  {users
                    .filter((u) => u.active && u.role !== 'viewer')
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div>
              <label className="field-label">{t('crm.deal.stage')}</label>
              <select
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value as DealStage })}
              >
                {DEAL_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {t(`crm.stage.${s}`)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
              <button type="button" className="btn-secondary" onClick={() => setForm(null)}>
                {t('common.cancel')}
              </button>
              <button type="submit" className="btn-primary">
                {t('common.save')}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
};
