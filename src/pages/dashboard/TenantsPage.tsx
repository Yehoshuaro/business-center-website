import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Globe, Mail, Phone } from 'lucide-react';
import type { Tenant } from '@/shared/types';
import { useTenantsStore } from '@/store/tenants';
import { formatDay } from '@/shared/utils';
import { DashHeader, SearchInput, Modal, ConfirmDialog, Field, EmptyState, Avatar, Badge, Metric } from '@/shared/components/ui';

const blank: Omit<Tenant, 'id'> = {
  companyName: '', industry: '', logoText: '', floor: 1, officeCode: '', headcount: 1,
  since: new Date().toISOString().slice(0, 10), contactName: '', contactEmail: '', phone: '',
  website: '', description: '', isPublished: true,
};

export const TenantsPage = () => {
  const { items, create, update, remove } = useTenantsStore();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Tenant | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Tenant | null>(null);

  const filtered = useMemo(
    () => items.filter((t) => `${t.companyName} ${t.industry} ${t.officeCode}`.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );

  return (
    <>
      <DashHeader
        title="Tenants"
        subtitle="The companies that call Meridian home."
        actions={<button className="btn-primary" onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> Add tenant</button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric label="Resident companies" value={items.length} icon="Briefcase" />
        <Metric label="Total headcount" value={items.reduce((s, t) => s + t.headcount, 0)} icon="Users" />
        <Metric label="Published on site" value={items.filter((t) => t.isPublished).length} icon="Globe" />
      </div>

      <div className="mb-4"><SearchInput value={query} onChange={setQuery} placeholder="Search tenants…" /></div>

      {filtered.length === 0 ? (
        <EmptyState icon="SearchX" title="No tenants found" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <div key={t.id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between">
                <Avatar name={t.logoText || t.companyName} className="h-11 w-11" />
                {t.isPublished ? <Badge tone="success">Published</Badge> : <Badge tone="neutral">Hidden</Badge>}
              </div>
              <h3 className="mt-3 font-display text-lg">{t.companyName}</h3>
              <div className="text-sm text-ink-muted">{t.industry}</div>
              <div className="mt-3 space-y-1.5 text-sm text-ink-muted">
                <div>Office {t.officeCode} · Floor {t.floor} · {t.headcount} staff</div>
                <div>Tenant since {formatDay(t.since)}</div>
                <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {t.contactEmail}</div>
                <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {t.phone}</div>
                {t.website && <div className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> {t.website.replace('https://', '')}</div>}
              </div>
              <div className="mt-4 flex gap-2 border-t border-line pt-4">
                <button className="btn-secondary btn-sm" onClick={() => setEditing(t)}><Pencil className="h-3.5 w-3.5" /> Edit</button>
                <button className="btn-danger btn-sm" onClick={() => setDeleting(t)}><Trash2 className="h-3.5 w-3.5" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <TenantForm
          initial={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(data) => { if (editing === 'new') create(data); else update(editing.id, data); setEditing(null); }}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete tenant?"
        description={deleting ? `"${deleting.companyName}" will be removed.` : ''}
        confirmLabel="Delete" danger
        onConfirm={() => { if (deleting) remove(deleting.id); setDeleting(null); }}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
};

const TenantForm = ({ initial, onClose, onSave }: { initial: Tenant | null; onClose: () => void; onSave: (data: Omit<Tenant, 'id'>) => void }) => {
  const [form, setForm] = useState<Omit<Tenant, 'id'>>(initial ? { ...initial } : { ...blank });
  const set = <K extends keyof Omit<Tenant, 'id'>>(k: K, v: Omit<Tenant, 'id'>[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={initial ? 'Edit tenant' : 'Add tenant'}
      footer={<><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={() => onSave({ ...form, logoText: form.logoText || form.companyName.slice(0, 2).toUpperCase() })}>{initial ? 'Save changes' : 'Create tenant'}</button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company name"><input value={form.companyName} onChange={(e) => set('companyName', e.target.value)} /></Field>
        <Field label="Industry"><input value={form.industry} onChange={(e) => set('industry', e.target.value)} /></Field>
        <Field label="Office code"><input value={form.officeCode} onChange={(e) => set('officeCode', e.target.value)} placeholder="06-03" /></Field>
        <Field label="Floor"><input type="number" value={form.floor} onChange={(e) => set('floor', Number(e.target.value))} /></Field>
        <Field label="Headcount"><input type="number" value={form.headcount} onChange={(e) => set('headcount', Number(e.target.value))} /></Field>
        <Field label="Tenant since"><input type="date" value={form.since} onChange={(e) => set('since', e.target.value)} /></Field>
        <Field label="Contact name"><input value={form.contactName} onChange={(e) => set('contactName', e.target.value)} /></Field>
        <Field label="Contact email"><input type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} /></Field>
        <Field label="Phone"><input value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
        <Field label="Website"><input value={form.website ?? ''} onChange={(e) => set('website', e.target.value)} placeholder="https://" /></Field>
        <Field label="Published on site">
          <select value={form.isPublished ? 'yes' : 'no'} onChange={(e) => set('isPublished', e.target.value === 'yes')}>
            <option value="yes">Yes</option><option value="no">No</option>
          </select>
        </Field>
      </div>
      <Field label="Description" className="mt-4"><textarea value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
    </Modal>
  );
};
