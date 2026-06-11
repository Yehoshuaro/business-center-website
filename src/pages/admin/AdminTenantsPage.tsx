import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useTenantsStore } from '@/features/tenants/store';
import type { Tenant } from '@/shared/types';
import { PageHeader, ConfirmDialog, EmptyState, Modal } from '@/shared/components/ui';

const emptyForm = (): Omit<Tenant, 'id'> => ({
  companyName: '',
  category: '',
  floor: 1,
  officeNumber: '',
  description: '',
  website: '',
  contactEmail: '',
  phone: '',
  isPublished: true,
});

export const AdminTenantsPage = () => {
  const { t } = useT();
  const tenants = useTenantsStore((s) => s.items);
  const create = useTenantsStore((s) => s.create);
  const update = useTenantsStore((s) => s.update);
  const remove = useTenantsStore((s) => s.remove);
  const togglePublished = useTenantsStore((s) => s.togglePublished);

  const [editing, setEditing] = useState<Tenant | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Tenant, 'id'>>(emptyForm());

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setCreating(true);
  };

  const startEdit = (tenant: Tenant) => {
    setCreating(false);
    setEditing(tenant);
    const { id: _id, ...rest } = tenant;
    void _id;
    setForm(rest);
  };

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) update(editing.id, form);
    else create(form);
    closeForm();
  };

  const isOpen = creating || editing !== null;

  return (
    <>
      <PageHeader
        eyebrow={t('admin.section.list')}
        title={t('admin.tenants')}
        actions={
          <button type="button" className="btn-primary btn-sm" onClick={startCreate}>
            <Plus size={14} /> {t('common.create')}
          </button>
        }
      />

      {tenants.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="table-wrap hidden md:block">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('admin.tenants')}</th>
                  <th>{t('tenants.category')}</th>
                  <th>{t('common.floor')}</th>
                  <th>{t('tenants.office')}</th>
                  <th>{t('common.status')}</th>
                  <th className="text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id}>
                    <td>
                      <div className="font-medium">{tenant.companyName}</div>
                      {tenant.website && (
                        <div className="text-xs text-ink-subtle break-all">{tenant.website}</div>
                      )}
                    </td>
                    <td className="text-ink-muted">{tenant.category}</td>
                    <td className="text-ink-muted">{tenant.floor}</td>
                    <td className="text-ink-muted">{tenant.officeNumber}</td>
                    <td>
                      <span
                        className={tenant.isPublished ? 'badge-success' : 'badge-neutral'}
                      >
                        {tenant.isPublished ? t('common.published') : t('common.unpublished')}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          className="btn-ghost btn-sm"
                          onClick={() => togglePublished(tenant.id)}
                          aria-label={t('common.published')}
                        >
                          {tenant.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button type="button" className="btn-ghost btn-sm" onClick={() => startEdit(tenant)}>
                          <Pencil size={14} />
                        </button>
                        <button type="button" className="btn-danger btn-sm" onClick={() => setConfirmId(tenant.id)}>
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
            {tenants.map((tenant) => (
              <div key={tenant.id} className="stack-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-base break-words">{tenant.companyName}</div>
                    <div className="text-xs text-ink-muted mt-1 break-words">{tenant.category}</div>
                  </div>
                  <span className={tenant.isPublished ? 'badge-success' : 'badge-neutral'}>
                    {tenant.isPublished ? t('common.published') : t('common.unpublished')}
                  </span>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-ink-muted">
                      {t('common.floor')}
                    </dt>
                    <dd>{tenant.floor}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-ink-muted">
                      {t('tenants.office')}
                    </dt>
                    <dd className="break-words">{tenant.officeNumber}</dd>
                  </div>
                </dl>
                <div className="stack-card-actions">
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => togglePublished(tenant.id)}
                    aria-label={t('common.published')}
                  >
                    {tenant.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary btn-sm flex-1 justify-center"
                    onClick={() => startEdit(tenant)}
                  >
                    <Pencil size={14} /> {t('common.edit')}
                  </button>
                  <button
                    type="button"
                    className="btn-danger btn-sm"
                    onClick={() => setConfirmId(tenant.id)}
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
            <button type="submit" form="tenant-form" className="btn-primary">
              {t('common.save')}
            </button>
          </>
        }
      >
        <form id="tenant-form" onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="field-label">{t('admin.tenants')}</label>
            <input
              type="text"
              required
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">{t('tenants.category')}</label>
            <input
              type="text"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
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
            <label className="field-label">{t('tenants.office')}</label>
            <input
              type="text"
              value={form.officeNumber}
              onChange={(e) => setForm({ ...form, officeNumber: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">{t('form.phone')}</label>
            <input
              type="text"
              value={form.phone ?? ''}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">{t('form.email')}</label>
            <input
              type="email"
              value={form.contactEmail ?? ''}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Website</label>
            <input
              type="text"
              value={form.website ?? ''}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">{t('common.description')}</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              id="isPublished"
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isPublished" className="text-sm">
              {t('common.published')}
            </label>
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
