import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        title={t('dashboard.spaces.title')}
        subtitle={t('dashboard.spaces.subtitle')}
        actions={<button className="btn-primary" onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> {t('dashboard.spaces.add')}</button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric label={t('dashboard.spaces.total')} value={items.length} icon="Building" />
        <Metric label={t('dashboard.spaces.available')} value={items.filter((o) => o.status === 'available').length} icon="DoorOpen" />
        <Metric label={t('dashboard.spaces.occupied')} value={items.filter((o) => o.status === 'occupied').length} icon="Lock" />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={query} onChange={setQuery} placeholder={t('dashboard.spaces.searchPlaceholder')} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as SpaceStatus | 'all')} className="w-auto">
          <option value="all">{t('dashboard.common.allStatuses')}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{t(`dashboard.status.space.${s}`)}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="SearchX" title={t('dashboard.spaces.noneFound')} description={t('dashboard.spaces.noneFoundDesc')} />
      ) : (
        <div className="table-wrap hidden md:block">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('dashboard.spaces.colSpace')}</th><th>{t('dashboard.spaces.colType')}</th><th>{t('dashboard.spaces.colFloor')}</th><th>{t('dashboard.spaces.colArea')}</th><th>{t('dashboard.spaces.colPrice')}</th><th>{t('dashboard.spaces.colOccupant')}</th><th>{t('dashboard.spaces.colStatus')}</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td><div className="font-medium">{o.title}</div><div className="text-xs text-ink-subtle">#{o.code}</div></td>
                  <td>{t(`dashboard.spaceType.${o.type}`)}</td>
                  <td>{o.floor}</td>
                  <td>{o.area > 0 ? `${o.area} m²` : '—'}</td>
                  <td>{formatKzt(o.monthlyPrice)}</td>
                  <td>{tenantName(o.tenantId) ?? <span className="text-ink-subtle">—</span>}</td>
                  <td>{StatusBadge.space(o.status)}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button className="btn-ghost btn-sm" onClick={() => setEditing(o)} aria-label={t('dashboard.actions.edit')}><Pencil className="h-4 w-4" /></button>
                      <button className="btn-ghost btn-sm text-danger" onClick={() => setDeleting(o)} aria-label={t('dashboard.actions.delete')}><Trash2 className="h-4 w-4" /></button>
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
              <div><div className="font-medium">{o.title}</div><div className="text-xs text-ink-subtle">#{o.code} · {t('dashboard.common.floor')} {o.floor}</div></div>
              {StatusBadge.space(o.status)}
            </div>
            <div className="text-sm text-ink-muted">{o.area > 0 ? `${o.area} m² · ` : ''}{formatKzt(o.monthlyPrice)}</div>
            <div className="stack-card-actions">
              <button className="btn-secondary btn-sm" onClick={() => setEditing(o)}><Pencil className="h-3.5 w-3.5" /> {t('dashboard.actions.edit')}</button>
              <button className="btn-danger btn-sm" onClick={() => setDeleting(o)}><Trash2 className="h-3.5 w-3.5" /> {t('dashboard.actions.delete')}</button>
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
        title={t('dashboard.spaces.deleteTitle')}
        description={deleting ? t('dashboard.spaces.deleteDesc', { name: deleting.title }) : ''}
        confirmLabel={t('dashboard.actions.delete')}
        danger
        onConfirm={() => { if (deleting) remove(deleting.id); setDeleting(null); }}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
};

const SpaceForm = ({ initial, onClose, onSave }: { initial: Office | null; onClose: () => void; onSave: (data: Omit<Office, 'id'>) => void }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<Omit<Office, 'id'>>(initial ? { ...initial } : { ...blank });
  const set = <K extends keyof Omit<Office, 'id'>>(k: K, v: Omit<Office, 'id'>[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal
      open
      onClose={onClose}
      title={initial ? t('dashboard.spaces.editTitle') : t('dashboard.spaces.addTitle')}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>{t('dashboard.actions.cancel')}</button>
          <button className="btn-primary" onClick={() => onSave(form)}>{initial ? t('dashboard.actions.save') : t('dashboard.spaces.createBtn')}</button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('dashboard.spaces.fTitle')}><input value={form.title} onChange={(e) => set('title', e.target.value)} /></Field>
        <Field label={t('dashboard.spaces.fCode')}><input value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="08-02" /></Field>
        <Field label={t('dashboard.spaces.fType')}>
          <select value={form.type} onChange={(e) => set('type', e.target.value as SpaceType)}>
            {TYPES.map((ty) => <option key={ty} value={ty}>{t(`dashboard.spaceType.${ty}`)}</option>)}
          </select>
        </Field>
        <Field label={t('dashboard.spaces.fStatus')}>
          <select value={form.status} onChange={(e) => set('status', e.target.value as SpaceStatus)}>
            {STATUSES.map((s) => <option key={s} value={s}>{t(`dashboard.status.space.${s}`)}</option>)}
          </select>
        </Field>
        <Field label={t('dashboard.spaces.colFloor')}><input type="number" value={form.floor} onChange={(e) => set('floor', Number(e.target.value))} /></Field>
        <Field label={t('dashboard.spaces.fArea')}><input type="number" value={form.area} onChange={(e) => set('area', Number(e.target.value))} /></Field>
        <Field label={t('dashboard.spaces.fCapacity')}><input type="number" value={form.capacity} onChange={(e) => set('capacity', Number(e.target.value))} /></Field>
        <Field label={t('dashboard.spaces.fPrice')}>
          <input type="number" value={form.monthlyPrice ?? ''} onChange={(e) => set('monthlyPrice', e.target.value === '' ? null : Number(e.target.value))} />
        </Field>
        <Field label={t('dashboard.spaces.fPhoto')}>
          <select value={form.photo} onChange={(e) => set('photo', e.target.value)}>
            {PHOTO_KEYS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>
        <Field label={t('dashboard.spaces.fFeatured')}>
          <select value={form.featured ? 'yes' : 'no'} onChange={(e) => set('featured', e.target.value === 'yes')}>
            <option value="no">{t('dashboard.common.no')}</option><option value="yes">{t('dashboard.common.yes')}</option>
          </select>
        </Field>
      </div>
      <Field label={t('dashboard.spaces.fDescription')} className="mt-4"><textarea value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
      <Field label={t('dashboard.spaces.fFeatures')} className="mt-4">
        <input value={form.features.join(', ')} onChange={(e) => set('features', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
      </Field>
    </Modal>
  );
};
