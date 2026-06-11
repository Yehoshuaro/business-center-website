import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useCrmStore, useCrmCanEdit, type CrmClient } from '@/features/crm/store';
import { PageHeader, Modal, ConfirmDialog, EmptyState } from '@/shared/components/ui';
import { uid } from '@/shared/utils';

const emptyClient = (): CrmClient => ({
  id: uid(),
  company: '',
  contact: '',
  phone: '+7 ',
  email: '',
  industry: '',
});

export const CrmClientsPage = () => {
  const { t } = useT();
  const canEdit = useCrmCanEdit();
  const clients = useCrmStore((s) => s.clients);
  const deals = useCrmStore((s) => s.deals);
  const upsertClient = useCrmStore((s) => s.upsertClient);
  const removeClient = useCrmStore((s) => s.removeClient);
  const log = useCrmStore((s) => s.log);

  const [query, setQuery] = useState('');
  const [form, setForm] = useState<CrmClient | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const dealCount = useMemo(() => {
    const map = new Map<string, number>();
    deals.forEach((d) => map.set(d.clientId, (map.get(d.clientId) ?? 0) + 1));
    return (id: string) => map.get(id) ?? 0;
  }, [deals]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) =>
      [c.company, c.contact, c.email, c.industry].some((v) => v.toLowerCase().includes(q)),
    );
  }, [clients, query]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    upsertClient({ ...form, company: form.company.trim(), contact: form.contact.trim() });
    log(`${isNew ? t('crm.client.add') : t('crm.client.edit')}: ${form.company.trim()}`);
    setForm(null);
  };

  const confirmDelete = () => {
    if (!confirmId) return;
    const c = clients.find((x) => x.id === confirmId);
    removeClient(confirmId);
    if (c) log(`${t('common.delete')}: ${c.company}`);
    setConfirmId(null);
  };

  return (
    <>
      <PageHeader
        title={t('crm.nav.clients')}
        actions={
          canEdit ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setIsNew(true);
                setForm(emptyClient());
              }}
            >
              <Plus size={16} /> {t('crm.client.add')}
            </button>
          ) : undefined
        }
      />

      <div className="mb-4 max-w-sm">
        <input
          type="search"
          placeholder={t('crm.search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={t('crm.noResults')} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('crm.client.company')}</th>
                  <th>{t('crm.client.contact')}</th>
                  <th>{t('crm.client.phone')}</th>
                  <th>{t('crm.client.email')}</th>
                  <th>{t('crm.client.industry')}</th>
                  <th className="text-right">{t('crm.client.deals')}</th>
                  {canEdit && <th className="text-right">{t('common.actions')}</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td className="font-medium">{c.company}</td>
                    <td>{c.contact}</td>
                    <td className="whitespace-nowrap tabular-nums">{c.phone}</td>
                    <td className="text-ink-muted">{c.email}</td>
                    <td>
                      <span className="badge-neutral">{c.industry}</span>
                    </td>
                    <td className="text-right tabular-nums">{dealCount(c.id)}</td>
                    {canEdit && (
                      <td className="text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="btn-ghost btn-sm"
                          onClick={() => {
                            setIsNew(false);
                            setForm({ ...c });
                          }}
                          aria-label={t('common.edit')}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn-ghost btn-sm text-danger"
                          onClick={() => setConfirmId(c.id)}
                          aria-label={t('common.delete')}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden stack-cards">
            {filtered.map((c) => (
              <div key={c.id} className="stack-card">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="font-medium">{c.company}</div>
                  <span className="badge-neutral shrink-0">{c.industry}</span>
                </div>
                <dl>
                  <div className="stack-card-row">
                    <dt>{t('crm.client.contact')}</dt>
                    <dd>{c.contact}</dd>
                  </div>
                  <div className="stack-card-row">
                    <dt>{t('crm.client.phone')}</dt>
                    <dd className="tabular-nums">{c.phone}</dd>
                  </div>
                  <div className="stack-card-row">
                    <dt>{t('crm.client.email')}</dt>
                    <dd className="break-all">{c.email}</dd>
                  </div>
                  <div className="stack-card-row">
                    <dt>{t('crm.client.deals')}</dt>
                    <dd>{dealCount(c.id)}</dd>
                  </div>
                </dl>
                {canEdit && (
                  <div className="stack-card-actions">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => {
                        setIsNew(false);
                        setForm({ ...c });
                      }}
                    >
                      <Pencil size={13} /> {t('common.edit')}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary btn-sm text-danger"
                      onClick={() => setConfirmId(c.id)}
                    >
                      <Trash2 size={13} /> {t('common.delete')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        open={form !== null}
        onClose={() => setForm(null)}
        title={isNew ? t('crm.client.add') : t('crm.client.edit')}
        size="md"
      >
        {form && (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="field-label">{t('crm.client.company')}</label>
              <input
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">{t('crm.client.contact')}</label>
                <input
                  required
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">{t('crm.client.industry')}</label>
                <input
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">{t('crm.client.phone')}</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">{t('crm.client.email')}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
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
