import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useConferenceRoomsStore } from '@/features/conferenceRooms/store';
import type { ConferenceRoom, ConferenceStatus } from '@/shared/types';
import { PageHeader, OfficeStatusBadge, ConfirmDialog, EmptyState, Modal } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils';

const STATUSES: ConferenceStatus[] = ['available', 'reserved', 'occupied'];

const emptyForm = (): Omit<ConferenceRoom, 'id'> => ({
  name: '',
  capacity: 10,
  area: 0,
  hourlyPrice: null,
  status: 'available',
  equipment: [],
  description: '',
});

export const AdminConferenceRoomsPage = () => {
  const { t, language } = useT();
  const rooms = useConferenceRoomsStore((s) => s.items);
  const create = useConferenceRoomsStore((s) => s.create);
  const update = useConferenceRoomsStore((s) => s.update);
  const remove = useConferenceRoomsStore((s) => s.remove);

  const [editing, setEditing] = useState<ConferenceRoom | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ConferenceRoom, 'id'>>(emptyForm());
  const [equipmentText, setEquipmentText] = useState('');

  const locale = ({ kk: 'kk-KZ', ru: 'ru-RU', en: 'en-US' } as const)[language];

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setEquipmentText('');
    setCreating(true);
  };

  const startEdit = (room: ConferenceRoom) => {
    setCreating(false);
    setEditing(room);
    const { id: _id, ...rest } = room;
    void _id;
    setForm(rest);
    setEquipmentText(room.equipment.join('\n'));
  };

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      equipment: equipmentText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (editing) update(editing.id, payload);
    else create(payload);
    closeForm();
  };

  const isOpen = creating || editing !== null;

  return (
    <>
      <PageHeader
        eyebrow={t('admin.section.list')}
        title={t('admin.conferenceRooms')}
        actions={
          <button type="button" className="btn-primary btn-sm" onClick={startCreate}>
            <Plus size={14} /> {t('common.create')}
          </button>
        }
      />

      {rooms.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="table-wrap hidden md:block">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('admin.conferenceRooms')}</th>
                  <th>{t('common.capacity')}</th>
                  <th>{t('common.area')}, m²</th>
                  <th>{t('common.status')}</th>
                  <th>{t('common.price')} / hr</th>
                  <th className="text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.id}>
                    <td className="font-medium">{r.name}</td>
                    <td className="text-ink-muted">{r.capacity}</td>
                    <td className="text-ink-muted">{r.area}</td>
                    <td><OfficeStatusBadge status={r.status} /></td>
                    <td className="text-ink-muted whitespace-nowrap">
                      {r.hourlyPrice === null ? t('common.priceOnRequest') : formatPrice(r.hourlyPrice, locale)}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button type="button" className="btn-ghost btn-sm" onClick={() => startEdit(r)}>
                          <Pencil size={14} />
                        </button>
                        <button type="button" className="btn-danger btn-sm" onClick={() => setConfirmId(r.id)}>
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
            {rooms.map((r) => (
              <div key={r.id} className="stack-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-medium text-base break-words min-w-0">{r.name}</div>
                  <OfficeStatusBadge status={r.status} />
                </div>
                <dl className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-ink-muted">
                      {t('common.capacity')}
                    </dt>
                    <dd>{r.capacity}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-ink-muted">
                      {t('common.area')}
                    </dt>
                    <dd>{r.area} m²</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-ink-muted">
                      /hr
                    </dt>
                    <dd className="break-words">
                      {r.hourlyPrice === null ? t('common.priceOnRequest') : formatPrice(r.hourlyPrice, locale)}
                    </dd>
                  </div>
                </dl>
                <div className="stack-card-actions">
                  <button
                    type="button"
                    className="btn-secondary btn-sm flex-1 justify-center"
                    onClick={() => startEdit(r)}
                  >
                    <Pencil size={14} /> {t('common.edit')}
                  </button>
                  <button
                    type="button"
                    className="btn-danger btn-sm"
                    onClick={() => setConfirmId(r.id)}
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
            <button type="submit" form="room-form" className="btn-primary">
              {t('common.save')}
            </button>
          </>
        }
      >
        <form id="room-form" onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="field-label">{t('admin.conferenceRooms')}</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">{t('common.capacity')}</label>
            <input
              type="number"
              required
              min={1}
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
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
            <label className="field-label">{t('common.status')}</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ConferenceStatus })}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{t(`status.${s}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">{t('common.price')} / hr ({t('common.optional')})</label>
            <input
              type="number"
              min={0}
              value={form.hourlyPrice ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  hourlyPrice: e.target.value === '' ? null : Number(e.target.value),
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
            <label className="field-label">{t('common.equipment')}</label>
            <textarea
              value={equipmentText}
              onChange={(e) => setEquipmentText(e.target.value)}
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
