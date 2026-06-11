import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import {
  useCrmStore,
  useCrmCanEdit,
  type CrmTask,
  type TaskStatus,
  type TaskPriority,
} from '@/features/crm/store';
import { PageHeader, Modal, ConfirmDialog } from '@/shared/components/ui';
import { uid, cn } from '@/shared/utils';

const STATUSES: TaskStatus[] = ['todo', 'inProgress', 'done'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
const LOCALE: Record<string, string> = { kk: 'kk-KZ', ru: 'ru-RU', en: 'en-GB' };

const PRIORITY_BADGE: Record<TaskPriority, string> = {
  low: 'badge-neutral',
  medium: 'badge-warning',
  high: 'badge-danger',
};

const emptyTask = (assigneeId: string): CrmTask => ({
  id: uid(),
  title: '',
  assigneeId,
  due: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
  status: 'todo',
  priority: 'medium',
});

export const CrmTasksPage = () => {
  const { t, language } = useT();
  const locale = LOCALE[language] ?? 'ru-RU';
  const canEdit = useCrmCanEdit();

  const tasks = useCrmStore((s) => s.tasks);
  const users = useCrmStore((s) => s.users);
  const upsertTask = useCrmStore((s) => s.upsertTask);
  const removeTask = useCrmStore((s) => s.removeTask);
  const log = useCrmStore((s) => s.log);

  const [form, setForm] = useState<CrmTask | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const userName = useMemo(() => {
    const map = new Map(users.map((u) => [u.id, u.name]));
    return (id: string) => map.get(id) ?? '?';
  }, [users]);

  const fmtDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short' }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const isOverdue = (task: CrmTask) =>
    task.status !== 'done' && new Date(task.due).getTime() < Date.now() - 86_400_000;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    upsertTask({ ...form, title: form.title.trim() });
    log(`${isNew ? t('crm.task.add') : t('crm.task.edit')}: ${form.title.trim()}`);
    setForm(null);
  };

  const markDone = (task: CrmTask) => {
    upsertTask({ ...task, status: 'done' });
    log(`${t('crm.task.status.done')}: ${task.title}`);
  };

  const confirmDelete = () => {
    if (!confirmId) return;
    const task = tasks.find((x) => x.id === confirmId);
    removeTask(confirmId);
    if (task) log(`${t('common.delete')}: ${task.title}`);
    setConfirmId(null);
  };

  return (
    <>
      <PageHeader
        title={t('crm.nav.tasks')}
        actions={
          canEdit ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setIsNew(true);
                setForm(emptyTask(users.find((u) => u.role === 'manager')?.id ?? users[0]?.id ?? ''));
              }}
            >
              <Plus size={16} /> {t('crm.task.add')}
            </button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATUSES.map((status) => {
          const items = tasks.filter((task) => task.status === status);
          return (
            <section key={status} className="card flex flex-col">
              <header className="px-4 pt-4 pb-2 flex items-baseline justify-between gap-2">
                <h2 className="text-xs uppercase tracking-wider text-ink-muted">
                  {t(`crm.task.status.${status}`)}
                </h2>
                <span className="text-xs text-ink-subtle tabular-nums">{items.length}</span>
              </header>
              <div className="px-3 pb-3 space-y-2">
                {items.length === 0 && (
                  <div className="px-1 py-3 text-xs text-ink-subtle">{t('common.empty')}</div>
                )}
                {items.map((task) => {
                  const overdue = isOverdue(task);
                  return (
                    <article
                      key={task.id}
                      className={cn(
                        'border border-line bg-surface-2 p-3',
                        overdue && 'border-l-2 border-l-danger',
                      )}
                    >
                      <div
                        className={cn(
                          'text-sm font-medium leading-snug mb-2',
                          task.status === 'done' && 'line-through text-ink-muted',
                        )}
                      >
                        {task.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-muted">
                        <span className={PRIORITY_BADGE[task.priority]}>
                          {t(`crm.task.priority.${task.priority}`)}
                        </span>
                        <span className={cn('tabular-nums', overdue && 'text-danger font-medium')}>
                          {fmtDate(task.due)}
                          {overdue && ` · ${t('crm.task.overdue')}`}
                        </span>
                        <span className="truncate">{userName(task.assigneeId)}</span>
                      </div>
                      {canEdit && (
                        <div className="mt-2.5 pt-2.5 border-t border-line flex flex-wrap gap-1.5">
                          {task.status !== 'done' && (
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={() => markDone(task)}
                            >
                              <Check size={13} /> {t('crm.task.status.done')}
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn-ghost btn-sm"
                            onClick={() => {
                              setIsNew(false);
                              setForm({ ...task, due: task.due.slice(0, 10) });
                            }}
                            aria-label={t('common.edit')}
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn-ghost btn-sm text-danger"
                            onClick={() => setConfirmId(task.id)}
                            aria-label={t('common.delete')}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <Modal
        open={form !== null}
        onClose={() => setForm(null)}
        title={isNew ? t('crm.task.add') : t('crm.task.edit')}
        size="md"
      >
        {form && (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="field-label">{t('crm.task.title')}</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">{t('crm.task.assignee')}</label>
                <select
                  value={form.assigneeId}
                  onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
                >
                  {users
                    .filter((u) => u.active)
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="field-label">{t('crm.task.due')}</label>
                <input
                  type="date"
                  required
                  value={form.due.slice(0, 10)}
                  onChange={(e) => setForm({ ...form, due: e.target.value })}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">{t('common.status')}</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {t(`crm.task.status.${s}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">{t('crm.task.priority')}</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {t(`crm.task.priority.${p}`)}
                    </option>
                  ))}
                </select>
              </div>
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
