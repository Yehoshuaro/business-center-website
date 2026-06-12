import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Office, SpaceStatus, SpaceType } from '@/shared/types';
import { useOfficesStore } from '@/store/offices';
import { useTenantsStore } from '@/store/tenants';
import { formatKzt } from '@/shared/utils';
import { DashHeader, SearchInput, StatusBadge, Modal, ConfirmDialog, Field, EmptyState, Metric } from '@/shared/components/ui';

const TYPES: SpaceType[] = ['private-office', 'open-plan', 'suite', 'coworking'];
const STATUSES: SpaceStatus[] = ['available', 'reserved', 'occupied'];
const PHOTO_KEYS = ['office', 'openspace', 'desk', 'coworking', 'lounge', 'lobby'];

const blank: Omit<Office, 'id'> = {
  code: '', title: '', floor: 1, area: 50, capacity: 4, type: 'private-office',
  status: 'available', monthlyPrice: 500000, description: '', features: [], photo: 'office', featured: false,
};

export const SpacesPage = () => {
  const { items, create, update, remove } = useOfficesStore();
  const tenants = useTenantsStore((s) => s.items);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SpaceStatus | 'all'>('all');
  const [editing, setEditing] = useState<Office | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Office | null>(null);

  const filtered = useMemo(
    () =>
      items.filter(
        (o) =>
          (statusFilter === 'all' || o.status === statusFilter) &&
          (o.title.toLowerCase().includes(query.toLowerCase()) || o.code.includes(query)),
      ),
    [items, query, statusFilter],
  );

  const tenantName = (id?: string) => tenants.find((t) => t.id === id)?.companyName;

  return (
    <>
      <DashHeader
        title="Spaces"
        subtitle="Manage the office and space inventory of the building."
        actions={<button className="btn-primary" onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> Add space</button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric label="Total spaces" value={items.length} icon="Building" />
        <Metric label="Available" value={items.filter((o) => o.status === 'available').length} icon="DoorOpen" />
        <Metric label="Occupied" value={items.filter((o) => o.status === 'occupied').length} icon="Lock" />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by name or code…" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as SpaceStatus | 'all')} className="w-auto">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="SearchX" title="No spaces found" description="Adjust your search or add a new space." />
      ) : (
        <div className="table-wrap hidden md:block">
          <table className="data-table">
            <thead>
              <tr>
                <th>Space</th><th>Type</th><th>Floor</th><th>Area</th><th>Price / mo</th><th>Occupant</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td><div className="font-medium">{o.title}</div><div className="text-xs text-ink-subtle">#{o.code}</div></td>
                  <td className="capitalize">{o.type.replace('-', ' ')}</td>
                  <td>{o.floor}</td>
                  <td>{o.area > 0 ? `${o.area} m²` : '—'}</td>
                  <td>{formatKzt(o.monthlyPrice)}</td>
                  <td>{tenantName(o.tenantId) ?? <span className="text-ink-subtle">—</span>}</td>
                  <td>{StatusBadge.space(o.status)}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button className="btn-ghost btn-sm" onClick={() => setEditing(o)} aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                      <button className="btn-ghost btn-sm text-danger" onClick={() => setDeleting(o)} aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      <div className="stack-cards md:hidden">
        {filtered.map((o) => (
          <div key={o.id} className="stack-card">
            <div className="flex items-start justify-between">
              <div><div className="font-medium">{o.title}</div><div className="text-xs text-ink-subtle">#{o.code} · Floor {o.floor}</div></div>
              {StatusBadge.space(o.status)}
            </div>
            <div className="text-sm text-ink-muted">{o.area > 0 ? `${o.area} m² · ` : ''}{formatKzt(o.monthlyPrice)}</div>
            <div className="stack-card-actions">
              <button className="btn-secondary btn-sm" onClick={() => setEditing(o)}><Pencil className="h-3.5 w-3.5" /> Edit</button>
              <button className="btn-danger btn-sm" onClick={() => setDeleting(o)}><Trash2 className="h-3.5 w-3.5" /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <SpaceForm
          initial={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing === 'new') create(data);
            else update(editing.id, data);
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete this space?"
        description={deleting ? `"${deleting.title}" will be permanently removed from the inventory.` : ''}
        confirmLabel="Delete"
        danger
        onConfirm={() => { if (deleting) remove(deleting.id); setDeleting(null); }}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
};

const SpaceForm = ({ initial, onClose, onSave }: { initial: Office | null; onClose: () => void; onSave: (data: Omit<Office, 'id'>) => void }) => {
  const [form, setForm] = useState<Omit<Office, 'id'>>(initial ? { ...initial } : { ...blank });
  const set = <K extends keyof Omit<Office, 'id'>>(k: K, v: Omit<Office, 'id'>[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal
      open
      onClose={onClose}
      title={initial ? 'Edit space' : 'Add space'}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave(form)}>{initial ? 'Save changes' : 'Create space'}</button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title"><input value={form.title} onChange={(e) => set('title', e.target.value)} /></Field>
        <Field label="Code"><input value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="08-02" /></Field>
        <Field label="Type">
          <select value={form.type} onChange={(e) => set('type', e.target.value as SpaceType)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={(e) => set('status', e.target.value as SpaceStatus)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Floor"><input type="number" value={form.floor} onChange={(e) => set('floor', Number(e.target.value))} /></Field>
        <Field label="Area (m²)"><input type="number" value={form.area} onChange={(e) => set('area', Number(e.target.value))} /></Field>
        <Field label="Capacity (seats)"><input type="number" value={form.capacity} onChange={(e) => set('capacity', Number(e.target.value))} /></Field>
        <Field label="Monthly price (₸, blank = on request)">
          <input type="number" value={form.monthlyPrice ?? ''} onChange={(e) => set('monthlyPrice', e.target.value === '' ? null : Number(e.target.value))} />
        </Field>
        <Field label="Photo">
          <select value={form.photo} onChange={(e) => set('photo', e.target.value)}>
            {PHOTO_KEYS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Featured on site">
          <select value={form.featured ? 'yes' : 'no'} onChange={(e) => set('featured', e.target.value === 'yes')}>
            <option value="no">No</option><option value="yes">Yes</option>
          </select>
        </Field>
      </div>
      <Field label="Description" className="mt-4"><textarea value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
      <Field label="Features (comma separated)" className="mt-4">
        <input value={form.features.join(', ')} onChange={(e) => set('features', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
      </Field>
    </Modal>
  );
};
