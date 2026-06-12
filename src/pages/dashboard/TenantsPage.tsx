import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        title={t('dashboard.tenants.title')}
        subtitle={t('dashboard.tenants.subtitle')}
        actions={<button className="btn-primary" onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> {t('dashboard.tenants.add')}</button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric label={t('dashboard.tenants.residents')} value={items.length} icon="Briefcase" />
        <Metric label={t('dashboard.tenants.headcount')} value={items.reduce((s, tn) => s + tn.headcount, 0)} icon="Users" />
        <Metric label={t('dashboard.tenants.published')} value={items.filter((tn) => tn.isPublished).length} icon="Globe" />
      </div>

      <div className="mb-4"><SearchInput value={query} onChange={setQuery} placeholder={t('dashboard.tenants.searchPlaceholder')} /></div>

      {filtered.length === 0 ? (
        <EmptyState icon="SearchX" title={t('dashboard.tenants.noneFound')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tn) => (
            <div key={tn.id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between">
                <Avatar name={tn.logoText || tn.companyName} className="h-11 w-11" />
                {tn.isPublished ? <Badge tone="success">{t('dashboard.common.published')}</Badge> : <Badge tone="neutral">{t('dashboard.common.hidden')}</Badge>}
              </div>
              <h3 className="mt-3 font-display text-lg">{tn.companyName}</h3>
              <div className="text-sm text-ink-muted">{tn.industry}</div>
              <div className="mt-3 space-y-1.5 text-sm text-ink-muted">
                <div>{t('dashboard.tenants.officeLine', { code: tn.officeCode, floor: tn.floor, count: tn.headcount })}</div>
                <div>{t('dashboard.tenants.since', { date: formatDay(tn.since) })}</div>
                <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {tn.contactEmail}</div>
                <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {tn.phone}</div>
                {tn.website && <div className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> {tn.website.replace('https://', '')}</div>}
              </div>
              <div className="mt-4 flex gap-2 border-t border-line pt-4">
                <button className="btn-secondary btn-sm" onClick={() => setEditing(tn)}><Pencil className="h-3.5 w-3.5" /> {t('dashboard.actions.edit')}</button>
                <button className="btn-danger btn-sm" onClick={() => setDeleting(tn)}><Trash2 className="h-3.5 w-3.5" /> {t('dashboard.actions.delete')}</button>
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
        title={t('dashboard.tenants.deleteTitle')}
        description={deleting ? t('dashboard.tenants.deleteDesc', { name: deleting.companyName }) : ''}
        confirmLabel={t('dashboard.actions.delete')} danger
        onConfirm={() => { if (deleting) remove(deleting.id); setDeleting(null); }}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
};

const TenantForm = ({ initial, onClose, onSave }: { initial: Tenant | null; onClose: () => void; onSave: (data: Omit<Tenant, 'id'>) => void }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<Omit<Tenant, 'id'>>(initial ? { ...initial } : { ...blank });
  const set = <K extends keyof Omit<Tenant, 'id'>>(k: K, v: Omit<Tenant, 'id'>[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={initial ? t('dashboard.tenants.editTitle') : t('dashboard.tenants.addTitle')}
      footer={<><button className="btn-secondary" onClick={onClose}>{t('dashboard.actions.cancel')}</button><button className="btn-primary" onClick={() => onSave({ ...form, logoText: form.logoText || form.companyName.slice(0, 2).toUpperCase() })}>{initial ? t('dashboard.actions.save') : t('dashboard.tenants.createBtn')}</button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('dashboard.tenants.fCompany')}><input value={form.companyName} onChange={(e) => set('companyName', e.target.value)} /></Field>
        <Field label={t('dashboard.tenants.fIndustry')}><input value={form.industry} onChange={(e) => set('industry', e.target.value)} /></Field>
        <Field label={t('dashboard.tenants.fOfficeCode')}><input value={form.officeCode} onChange={(e) => set('officeCode', e.target.value)} placeholder="06-03" /></Field>
        <Field label={t('dashboard.tenants.fFloor')}><input type="number" value={form.floor} onChange={(e) => set('floor', Number(e.target.value))} /></Field>
        <Field label={t('dashboard.tenants.fHeadcount')}><input type="number" value={form.headcount} onChange={(e) => set('headcount', Number(e.target.value))} /></Field>
        <Field label={t('dashboard.tenants.fSince')}><input type="date" value={form.since} onChange={(e) => set('since', e.target.value)} /></Field>
        <Field label={t('dashboard.tenants.fContactName')}><input value={form.contactName} onChange={(e) => set('contactName', e.target.value)} /></Field>
        <Field label={t('dashboard.tenants.fContactEmail')}><input type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} /></Field>
        <Field label={t('dashboard.tenants.fPhone')}><input value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
        <Field label={t('dashboard.tenants.fWebsite')}><input value={form.website ?? ''} onChange={(e) => set('website', e.target.value)} placeholder="https://" /></Field>
        <Field label={t('dashboard.tenants.fPublished')}>
          <select value={form.isPublished ? 'yes' : 'no'} onChange={(e) => set('isPublished', e.target.value === 'yes')}>
            <option value="yes">{t('dashboard.common.yes')}</option><option value="no">{t('dashboard.common.no')}</option>
          </select>
        </Field>
      </div>
      <Field label={t('dashboard.tenants.fDescription')} className="mt-4"><textarea value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
    </Modal>
  );
};
