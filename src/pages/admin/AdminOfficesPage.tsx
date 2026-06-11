import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useOfficesStore } from '@/features/offices/store';
import type { Office, OfficeStatus, OfficeType } from '@/shared/types';
import { PageHeader, OfficeStatusBadge, ConfirmDialog, EmptyState, Modal } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils';

const STATUSES: OfficeStatus[] = ['available', 'reserved', 'occupied'];
const TYPES: OfficeType[] = ['openSpace', 'cabinet', 'block', 'mixed'];

const emptyForm = (): Omit<Office, 'id'> => ({
  title: '',
  floor: 1,
  area: 0,
  type: 'cabinet',
  status: 'available',
  price: null,
  description: '',
  features: [],
  images: [],
});

export const AdminOfficesPage = () => {
  const { t, language } = useT();
  const offices = useOfficesStore((s) => s.items);
  const create = useOfficesStore((s) => s.create);
  const update = useOfficesStore((s) => s.update);
  const remove = useOfficesStore((s) => s.remove);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OfficeStatus | 'all'>('all');
  const [editing, setEditing] = useState<Office | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Office, 'id'>>(emptyForm());
  const [featuresText, setFeaturesText] = useState('');

  const locale = ({ kk: 'kk-KZ', ru: 'ru-RU', en: 'en-US' } as const)[language];

  const filtered = useMemo(() => {
    return offices.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (search && !o.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [offices, search, statusFilter]);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setFeaturesText('');
    setCreating(true);
  };

  const startEdit = (office: Office) => {
    setCreating(false);
    setEditing(office);
    const { id: _id, ...rest } = office;
    void _id;
    setForm(rest);
    setFeaturesText(office.features.join('\n'));
  };

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      features: featuresText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (editing) {
      update(editing.id, payload);
    } else {
      create(payload);
    }
    closeForm();
  };

  const isOpen = creating || editing !== null;

  return (
    <>
      <PageHeader
        eyebrow={t('admin.section.list')}
        title={t('admin.offices')}
        actions={
          <button type="button" className="btn-primary btn-sm" onClick={startCreate}>
            <Plus size={14} /> {t('common.create')}
          </button>
        }
      />

      <div className="card p-4 mb-6 grid gap-3 sm:grid-cols-2 lg:flex lg:flex-row lg:items-end">
        <div className="lg:max-w-xs lg:flex-1">
          <label className="field-label">{t('common.search')}</label>
          <input
            type="text"
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="lg:max-w-[220px]">
          <label className="field-label">{t('common.status')}</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OfficeStatus | 'all')}
          >
            <option value="all">{t('common.all')}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`status.${s}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="table-wrap hidden md:block">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('admin.offices')}</th>
                  <th>{t('common.floor')}</th>
                  <th>{t('common.area')}, m²</th>
                  <th>{t('common.type')}</th>
                  <th>{t('common.status')}</th>
                  <th>{t('common.price')}</th>
                  <th className="text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td className="font-medium">{o.title}</td>
                    <td className="text-ink-muted">{o.floor}</td>
                    <td className="text-ink-muted">{o.area}</td>
                    <td className="text-ink-muted">{t(`officeType.${o.type}`)}</td>
                    <td><OfficeStatusBadge status={o.status} /></td>
                    <td className="text-ink-muted whitespace-nowrap">
                      {o.price === null ? t('common.priceOnRequest') : formatPrice(o.price, locale)}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          className="btn-ghost btn-sm"
                          onClick={() => startEdit(o)}
                          aria-label={t('common.edit')}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn-danger btn-sm"
                          onClick={() => setConfirmId(o.id)}
                          aria-label={t('common.delete')}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="stack-cards md:hidden">
            {filtered.map((o) => (
              <div key={o.id} className="stack-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-base break-words">{o.title}</div>
                    <div className="text-xs text-ink-muted mt-1">
                      {t('common.floor')} {o.floor} · {t(`officeType.${o.type}`)}
                    </div>
                  </div>
                  <OfficeStatusBadge status={o.status} />
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-ink-muted">
                      {t('common.area')}
                    </dt>
                    <dd>{o.area} m²</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-ink-muted">
                      {t('common.price')}
                    </dt>
                    <dd className="break-words">
                      {o.price === null ? t('common.priceOnRequest') : formatPrice(o.price, locale)}
                    </dd>
                  </div>
                </dl>
                <div className="stack-card-actions">
                  <button
                    type="button"
                    className="btn-secondary btn-sm flex-1 justify-center"
                    onClick={() => startEdit(o)}
                  >
                    <Pencil size={14} /> {t('common.edit')}
                  </button>
                  <button
                    type="button"
                    className="btn-danger btn-sm"
                    onClick={() => setConfirmId(o.id)}
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
        open={isOpen}
        onClose={closeForm}
        size="lg"
        title={editing ? t('admin.section.editing') : t('admin.section.create')}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={closeForm}>
              {t('common.cancel')}
            </button>
            <button type="submit" form="office-form" className="btn-primary">
              {t('common.save')}
            </button>
          </>
        }
      >
        <form id="office-form" onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="field-label">{t('admin.offices')}</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">{t('common.floor')}</label>
            <input
              type="number"
              required
              min={0}
              value={form.floor}
              onChange={(e) => setForm({ ...form, floor: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="field-label">{t('common.area')}, m²</label>
            <input
              type="number"
              required
              min={0}
              value={form.area}
              onChange={(e) => setForm({ ...form, area: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="field-label">{t('common.type')}</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as OfficeType })}
            >
              {TYPES.map((tp) => (
                <option key={tp} value={tp}>{t(`officeType.${tp}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">{t('common.status')}</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as OfficeStatus })}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{t(`status.${s}`)}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">
              {t('common.price')} ({t('common.optional')})
            </label>
            <input
              type="number"
              min={0}
              value={form.price ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value === '' ? null : Number(e.target.value),
                })
              }
              placeholder={t('common.priceOnRequest')}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">{t('common.description')}</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">{t('common.features')}</label>
            <textarea
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder={'• one per line'}
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmId !== null}
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) remove(confirmId);
          setConfirmId(null);
        }}
      />
    </>
  );
};
