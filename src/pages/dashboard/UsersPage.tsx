import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react';
import type { Account, Role } from '@/shared/types';
import { useAccountsStore } from '@/store/accounts';
import { useTenantsStore } from '@/store/tenants';
import { useAuthStore } from '@/store/auth';
import { formatDay } from '@/shared/utils';
import { ROLE_META } from '@/features/access/roles';
import { DashHeader, SearchInput, Modal, ConfirmDialog, Field, EmptyState, Avatar, StatusBadge, Metric } from '@/shared/components/ui';

const ROLES: Role[] = ['admin', 'manager', 'viewer'];

const ROLE_ABILITIES: Record<Role, string[]> = {
  admin: ['Full system access', 'User & role management', 'System settings', 'All CRM modules'],
  manager: ['CRM dashboard', 'Manage spaces, tenants & leads', 'Bookings & maintenance', 'No user management'],
  viewer: ['Tenant dashboard', 'View leased spaces & invoices', 'Submit maintenance requests', 'No CRM access'],
};

export const UsersPage = () => {
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
        title="Users & Roles"
        subtitle="Manage who can access the platform and what they can do."
        actions={<button className="btn-primary" onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> Add user</button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {ROLES.map((r) => (
          <Metric key={r} label={ROLE_META[r].label + 's'} value={items.filter((a) => a.role === r).length} icon={r === 'admin' ? 'ShieldCheck' : r === 'manager' ? 'Briefcase' : 'User'} />
        ))}
      </div>

      {/* Role reference */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        {ROLES.map((r) => (
          <div key={r} className="card p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span className={ROLE_META[r].badgeClass}>{ROLE_META[r].label}</span>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
              {ROLE_ABILITIES[r].map((a) => <li key={a}>• {a}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="mb-4"><SearchInput value={query} onChange={setQuery} placeholder="Search users…" /></div>

      {filtered.length === 0 ? (
        <EmptyState icon="Users" title="No users found" />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>User</th><th>Role</th><th>Linked tenant</th><th>Created</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={a.fullName} />
                      <div><div className="font-medium">{a.fullName}{a.id === currentId && <span className="ml-2 text-xs text-ink-subtle">(you)</span>}</div><div className="text-xs text-ink-subtle">{a.email}</div></div>
                    </div>
                  </td>
                  <td><span className={ROLE_META[a.role].badgeClass}>{ROLE_META[a.role].label}</span></td>
                  <td>{tenantName(a.tenantId) ?? <span className="text-ink-subtle">—</span>}</td>
                  <td>{formatDay(a.createdAt)}</td>
                  <td>{StatusBadge.account(a.status)}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button className="btn-ghost btn-sm" onClick={() => setEditing(a)} aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                      <button className="btn-ghost btn-sm text-danger disabled:opacity-30" disabled={a.id === currentId} onClick={() => setDeleting(a)} aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
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

      <ConfirmDialog open={!!deleting} title="Delete user?" description={deleting ? `${deleting.fullName} will lose access immediately.` : ''} confirmLabel="Delete" danger
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
  const [form, setForm] = useState<Omit<Account, 'id' | 'createdAt'>>(
    initial
      ? { email: initial.email, password: initial.password, fullName: initial.fullName, role: initial.role, status: initial.status, tenantId: initial.tenantId, title: initial.title }
      : { email: '', password: '', fullName: '', role: 'manager', status: 'active', title: '' },
  );
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={initial ? 'Edit user' : 'Add user'}
      footer={<><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={!form.email || !form.password || !form.fullName} onClick={() => onSave({ ...form, tenantId: form.role === 'viewer' ? form.tenantId : undefined })}>{initial ? 'Save changes' : 'Create user'}</button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name"><input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} /></Field>
        <Field label="Job title"><input value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} /></Field>
        <Field label="Email"><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
        <Field label="Password" hint="Demo only — stored locally."><input value={form.password} onChange={(e) => set('password', e.target.value)} /></Field>
        <Field label="Role"><select value={form.role} onChange={(e) => set('role', e.target.value as Role)}>{ROLES.map((r) => <option key={r} value={r}>{ROLE_META[r].label}</option>)}</select></Field>
        <Field label="Status"><select value={form.status} onChange={(e) => set('status', e.target.value as Account['status'])}><option value="active">Active</option><option value="disabled">Disabled</option></select></Field>
        {form.role === 'viewer' && (
          <Field label="Linked tenant" className="sm:col-span-2">
            <select value={form.tenantId ?? ''} onChange={(e) => set('tenantId', e.target.value || undefined)}>
              <option value="">— none —</option>
              {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>
        )}
      </div>
    </Modal>
  );
};
