import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Power } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useCrmStore, type CrmUser, type CrmRole } from '@/features/crm/store';
import { PageHeader, Modal, ConfirmDialog } from '@/shared/components/ui';
import { uid } from '@/shared/utils';

const ROLES: CrmRole[] = ['admin', 'manager', 'viewer'];

const emptyUser = (): CrmUser => ({
  id: uid(),
  name: '',
  email: '',
  password: 'demo123',
  role: 'manager',
  active: true,
});

export const CrmUsersPage = () => {
  const { t } = useT();
  const session = useCrmStore((s) => s.session);
  const users = useCrmStore((s) => s.users);
  const upsertUser = useCrmStore((s) => s.upsertUser);
  const removeUser = useCrmStore((s) => s.removeUser);
  const log = useCrmStore((s) => s.log);

  const [form, setForm] = useState<CrmUser | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (session?.role !== 'admin') return <Navigate to="/crm" replace />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    upsertUser({ ...form, name: form.name.trim(), email: form.email.trim() });
    log(`${isNew ? t('crm.user.add') : t('crm.user.edit')}: ${form.name.trim()}`);
    setForm(null);
  };

  const toggleActive = (user: CrmUser) => {
    if (user.id === session.userId) return;
    upsertUser({ ...user, active: !user.active });
  };

  const confirmDelete = () => {
    if (!confirmId) return;
    const u = users.find((x) => x.id === confirmId);
    removeUser(confirmId);
    if (u) log(`${t('common.delete')}: ${u.name}`);
    setConfirmId(null);
  };

  return (
    <>
      <PageHeader
        title={t('crm.nav.users')}
        actions={
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setIsNew(true);
              setForm(emptyUser());
            }}
          >
            <Plus size={16} /> {t('crm.user.add')}
          </button>
        }
      />

      {/* Desktop table */}
      <div className="hidden md:block card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('crm.user.name')}</th>
              <th>{t('crm.login.email')}</th>
              <th>{t('crm.user.role')}</th>
              <th>{t('common.status')}</th>
              <th className="text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="font-medium">{u.name}</td>
                <td className="text-ink-muted">{u.email}</td>
                <td>
                  <span className="badge-accent">{t(`crm.role.${u.role}`)}</span>
                </td>
                <td>
                  <span className={u.active ? 'badge-success' : 'badge-neutral'}>
                    {u.active ? t('crm.user.active') : t('crm.user.disabled')}
                  </span>
                </td>
                <td className="text-right whitespace-nowrap">
                  <button
                    type="button"
                    className="btn-ghost btn-sm"
                    disabled={u.id === session.userId}
                    onClick={() => toggleActive(u)}
                    aria-label={t('common.status')}
                  >
                    <Power size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn-ghost btn-sm"
                    onClick={() => {
                      setIsNew(false);
                      setForm({ ...u });
                    }}
                    aria-label={t('common.edit')}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn-ghost btn-sm text-danger"
                    disabled={u.id === session.userId}
                    onClick={() => setConfirmId(u.id)}
                    aria-label={t('common.delete')}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden stack-cards">
        {users.map((u) => (
          <div key={u.id} className="stack-card">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <div className="font-medium truncate">{u.name}</div>
                <div className="text-xs text-ink-muted break-all">{u.email}</div>
              </div>
              <span className={u.active ? 'badge-success shrink-0' : 'badge-neutral shrink-0'}>
                {u.active ? t('crm.user.active') : t('crm.user.disabled')}
              </span>
            </div>
            <div className="mb-3">
              <span className="badge-accent">{t(`crm.role.${u.role}`)}</span>
            </div>
            <div className="stack-card-actions">
              <button
                type="button"
                className="btn-secondary btn-sm"
                disabled={u.id === session.userId}
                onClick={() => toggleActive(u)}
              >
                <Power size={13} /> {t('common.status')}
              </button>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => {
                  setIsNew(false);
                  setForm({ ...u });
                }}
              >
                <Pencil size={13} /> {t('common.edit')}
              </button>
              <button
                type="button"
                className="btn-secondary btn-sm text-danger"
                disabled={u.id === session.userId}
                onClick={() => setConfirmId(u.id)}
              >
                <Trash2 size={13} /> {t('common.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={form !== null}
        onClose={() => setForm(null)}
        title={isNew ? t('crm.user.add') : t('crm.user.edit')}
        size="md"
      >
        {form && (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="field-label">{t('crm.user.name')}</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">{t('crm.login.email')}</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">{t('crm.login.password')}</label>
                <input
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="field-label">{t('crm.user.role')}</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as CrmRole })}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {t(`crm.role.${r}`)}
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
