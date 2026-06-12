import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react';
import type { Account, Role } from '@/shared/types';
import { useAccountsStore } from '@/store/accounts';
import { useTenantsStore } from '@/store/tenants';
import { useAuthStore } from '@/store/auth';
import { formatDay } from '@/shared/utils';
import { ROLE_META } from '@/features/access/roles';
import { DashHeader, SearchInput, Modal, ConfirmDialog, Field, EmptyState, Avatar, StatusBadge, Metric } from '@/shared/components/ui';

const ROLES: Role[] = ['admin', 'manager', 'viewer'];

export const UsersPage = () => {
  const { t } = useTranslation();
  const { items, create, update, remove } = useAccountsStore();
  const tenants = useTenantsStore((s) => s.items);
  const currentId = useAuthStore((s) => s.session?.id);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Account | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Account | null>(null);

  const filtered = useMemo(
    () => items.filter((a) => `${a.fullName} ${a.email}`.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );
  const tenantName = (id?: string) => tenants.find((t) => t.id === id)?.companyName;

  return (
    <>
      <DashHeader
        title={t('dashboard.users.title')}
        subtitle={t('dashboard.users.subtitle')}
        actions={<button className="btn-primary" onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> {t('dashboard.users.add')}</button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {ROLES.map((r) => (
          <Metric key={r} label={t(ROLE_META[r].labelKey)} value={items.filter((a) => a.role === r).length} icon={r === 'admin' ? 'ShieldCheck' : r === 'manager' ? 'Briefcase' : 'User'} />
        ))}
      </div>

      {/* Role reference */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        {ROLES.map((r) => (
          <div key={r} className="card p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span className={ROLE_META[r].badgeClass}>{t(ROLE_META[r].labelKey)}</span>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
              {(t(`dashboard.users.abilities.${r}`, { returnObjects: true }) as string[]).map((a) => <li key={a}>• {a}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="mb-4"><SearchInput value={query} onChange={setQuery} placeholder={t('dashboard.users.searchPlaceholder')} /></div>

      {filtered.length === 0 ? (
        <EmptyState icon="Users" title={t('dashboard.users.noneFound')} />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('dashboard.users.colUser')}</th><th>{t('dashboard.users.colRole')}</th><th>{t('dashboard.users.colTenant')}</th><th>{t('dashboard.users.colCreated')}</th><th>{t('dashboard.users.colStatus')}</th><th></th></tr></thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={a.fullName} />
                      <div><div className="font-medium">{a.fullName}{a.id === currentId && <span className="ml-2 text-xs text-ink-subtle">({t('dashboard.common.you')})</span>}</div><div className="text-xs text-ink-subtle">{a.email}</div></div>
                    </div>
                  </td>
                  <td><span className={ROLE_META[a.role].badgeClass}>{t(ROLE_META[a.role].labelKey)}</span></td>
                  <td>{tenantName(a.tenantId) ?? <span className="text-ink-subtle">—</span>}</td>
                  <td>{formatDay(a.createdAt)}</td>
                  <td>{StatusBadge.account(a.status)}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button className="btn-ghost btn-sm" onClick={() => setEditing(a)} aria-label={t('dashboard.actions.edit')}><Pencil className="h-4 w-4" /></button>
                      <button className="btn-ghost btn-sm text-danger disabled:opacity-30" disabled={a.id === currentId} onClick={() => setDeleting(a)} aria-label={t('dashboard.actions.delete')}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <UserForm
          initial={editing === 'new' ? null : editing}
          tenants={tenants.map((t) => ({ id: t.id, name: t.companyName }))}
          onClose={() => setEditing(null)}
          onSave={(data) => { if (editing === 'new') create(data); else update(editing.id, data); setEditing(null); }}
        />
      )}

      <ConfirmDialog open={!!deleting} title={t('dashboard.users.deleteTitle')} description={deleting ? t('dashboard.users.deleteDesc', { name: deleting.fullName }) : ''} confirmLabel={t('dashboard.actions.delete')} danger
        onConfirm={() => { if (deleting) remove(deleting.id); setDeleting(null); }} onCancel={() => setDeleting(null)} />
    </>
  );
};

const UserForm = ({ initial, tenants, onClose, onSave }: {
  initial: Account | null;
  tenants: { id: string; name: string }[];
  onClose: () => void;
  onSave: (data: Omit<Account, 'id' | 'createdAt'>) => void;
}) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<Omit<Account, 'id' | 'createdAt'>>(
    initial
      ? { email: initial.email, password: initial.password, fullName: initial.fullName, role: initial.role, status: initial.status, tenantId: initial.tenantId, title: initial.title }
      : { email: '', password: '', fullName: '', role: 'manager', status: 'active', title: '' },
  );
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={initial ? t('dashboard.users.editTitle') : t('dashboard.users.addTitle')}
      footer={<><button className="btn-secondary" onClick={onClose}>{t('dashboard.actions.cancel')}</button><button className="btn-primary" disabled={!form.email || !form.password || !form.fullName} onClick={() => onSave({ ...form, tenantId: form.role === 'viewer' ? form.tenantId : undefined })}>{initial ? t('dashboard.actions.save') : t('dashboard.users.createBtn')}</button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('dashboard.users.fFullName')}><input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} /></Field>
        <Field label={t('dashboard.users.fTitle')}><input value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} /></Field>
        <Field label={t('dashboard.users.fEmail')}><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
        <Field label={t('dashboard.users.fPassword')} hint={t('dashboard.users.fPasswordHint')}><input value={form.password} onChange={(e) => set('password', e.target.value)} /></Field>
        <Field label={t('dashboard.users.fRole')}><select value={form.role} onChange={(e) => set('role', e.target.value as Role)}>{ROLES.map((r) => <option key={r} value={r}>{t(ROLE_META[r].labelKey)}</option>)}</select></Field>
        <Field label={t('dashboard.users.fStatus')}><select value={form.status} onChange={(e) => set('status', e.target.value as Account['status'])}><option value="active">{t('dashboard.common.active')}</option><option value="disabled">{t('dashboard.common.disabled')}</option></select></Field>
        {form.role === 'viewer' && (
          <Field label={t('dashboard.users.fTenant')} className="sm:col-span-2">
            <select value={form.tenantId ?? ''} onChange={(e) => set('tenantId', e.target.value || undefined)}>
              <option value="">{t('dashboard.common.none')}</option>
              {tenants.map((t2) => <option key={t2.id} value={t2.id}>{t2.name}</option>)}
            </select>
          </Field>
        )}
      </div>
    </Modal>
  );
};
