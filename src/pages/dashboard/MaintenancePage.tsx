import { useMemo, useState } from 'react';
import { Plus, Send } from 'lucide-react';
import type { MaintenanceRequest, MaintenanceStatus, MaintenanceCategory, MaintenancePriority } from '@/shared/types';
import { useMaintenanceStore } from '@/store/maintenance';
import { useTenantsStore } from '@/store/tenants';
import { useAuthStore } from '@/store/auth';
import { formatRelative, cn } from '@/shared/utils';
import { DashHeader, StatusBadge, Modal, Field, EmptyState, Metric } from '@/shared/components/ui';

const CATEGORIES: MaintenanceCategory[] = ['hvac', 'electrical', 'plumbing', 'cleaning', 'access', 'it', 'other'];
const PRIORITIES: MaintenancePriority[] = ['low', 'medium', 'high', 'urgent'];
const STATUSES: MaintenanceStatus[] = ['open', 'in-progress', 'resolved', 'closed'];

export const MaintenancePage = () => {
  const session = useAuthStore((s) => s.session)!;
  const { items, create, setStatus, addUpdate } = useMaintenanceStore();
  const tenants = useTenantsStore((s) => s.items);
  const isTenant = session.role === 'viewer';

  const [creating, setCreating] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [filter, setFilter] = useState<MaintenanceStatus | 'all'>('all');

  const scoped = useMemo(
    () => items.filter((m) => (isTenant ? m.tenantId === session.tenantId : true)),
    [items, isTenant, session.tenantId],
  );
  const visible = scoped.filter((m) => filter === 'all' || m.status === filter);
  const activeReq = active ? items.find((m) => m.id === active) ?? null : null;
  const tenantName = (id: string) => tenants.find((t) => t.id === id)?.companyName ?? '—';
  const myTenant = tenants.find((t) => t.id === session.tenantId);

  return (
    <>
      <DashHeader
        title="Maintenance"
        subtitle={isTenant ? 'Raise and track facility requests for your space.' : 'Facility requests from all tenants.'}
        actions={<button className="btn-primary" onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> New request</button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Metric label="Total" value={scoped.length} icon="Wrench" />
        <Metric label="Open" value={scoped.filter((m) => m.status === 'open').length} icon="CircleDot" />
        <Metric label="In progress" value={scoped.filter((m) => m.status === 'in-progress').length} icon="Loader" />
        <Metric label="Resolved" value={scoped.filter((m) => m.status === 'resolved' || m.status === 'closed').length} icon="CircleCheck" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', ...STATUSES] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('border px-3 py-1.5 text-sm capitalize', filter === f ? 'border-accent bg-accent text-accent-ink' : 'border-line-strong text-ink-muted hover:bg-surface-2')}>{f.replace('-', ' ')}</button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState icon="Wrench" title="No requests" description={isTenant ? 'Raise a request and the facilities team will respond.' : 'No maintenance requests match this filter.'} />
      ) : (
        <div className="grid gap-3">
          {visible.map((m) => (
            <button key={m.id} onClick={() => setActive(m.id)} className="card flex flex-col gap-2 p-4 text-left transition-shadow hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink-subtle">{m.ref}</span>
                  {StatusBadge.priority(m.priority)}
                </div>
                <div className="mt-1 truncate font-medium">{m.subject}</div>
                <div className="text-sm text-ink-muted">
                  {!isTenant && <>{tenantName(m.tenantId)} · </>}#{m.spaceCode} · <span className="capitalize">{m.category}</span> · {formatRelative(m.createdAt)}
                </div>
              </div>
              <div className="shrink-0">{StatusBadge.maintenance(m.status)}</div>
            </button>
          ))}
        </div>
      )}

      {creating && (
        <RequestForm
          isTenant={isTenant}
          tenants={tenants.map((t) => ({ id: t.id, name: t.companyName, code: t.officeCode }))}
          defaultTenantId={session.tenantId}
          defaultSpaceCode={myTenant?.officeCode ?? ''}
          author={session.fullName}
          onClose={() => setCreating(false)}
          onSave={(data) => { create(data); setCreating(false); }}
        />
      )}

      {activeReq && (
        <RequestDetail
          request={activeReq}
          canManage={!isTenant}
          author={session.fullName}
          onClose={() => setActive(null)}
          onStatus={(s) => setStatus(activeReq.id, s)}
          onUpdate={(text) => addUpdate(activeReq.id, session.fullName, text)}
        />
      )}
    </>
  );
};

const RequestForm = ({ isTenant, tenants, defaultTenantId, defaultSpaceCode, author, onClose, onSave }: {
  isTenant: boolean;
  tenants: { id: string; name: string; code: string }[];
  defaultTenantId?: string;
  defaultSpaceCode: string;
  author: string;
  onClose: () => void;
  onSave: (data: Omit<MaintenanceRequest, 'id' | 'ref' | 'createdAt' | 'status' | 'updates'>) => void;
}) => {
  const [form, setForm] = useState({
    tenantId: defaultTenantId ?? tenants[0]?.id ?? '',
    spaceCode: defaultSpaceCode || tenants[0]?.code || '',
    category: 'hvac' as MaintenanceCategory,
    priority: 'medium' as MaintenancePriority,
    subject: '', description: '',
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title="New maintenance request"
      footer={<><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={!form.subject.trim()} onClick={() => onSave({ ...form, createdBy: author })}>Submit request</button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        {!isTenant && (
          <Field label="Tenant">
            <select value={form.tenantId} onChange={(e) => { const t = tenants.find((x) => x.id === e.target.value); set('tenantId', e.target.value); if (t) set('spaceCode', t.code); }}>
              {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>
        )}
        <Field label="Space code"><input value={form.spaceCode} onChange={(e) => set('spaceCode', e.target.value)} /></Field>
        <Field label="Category"><select value={form.category} onChange={(e) => set('category', e.target.value as MaintenanceCategory)} className="capitalize">{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></Field>
        <Field label="Priority"><select value={form.priority} onChange={(e) => set('priority', e.target.value as MaintenancePriority)} className="capitalize">{PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}</select></Field>
      </div>
      <Field label="Subject" className="mt-4"><input value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="Briefly describe the issue" /></Field>
      <Field label="Description" className="mt-4"><textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Add any details that help us resolve it faster." /></Field>
    </Modal>
  );
};

const RequestDetail = ({ request, canManage, onClose, onStatus, onUpdate }: {
  request: MaintenanceRequest; canManage: boolean; author: string;
  onClose: () => void; onStatus: (s: MaintenanceStatus) => void; onUpdate: (text: string) => void;
}) => {
  const [text, setText] = useState('');
  return (
    <Modal open onClose={onClose} title={request.subject} description={`${request.ref} · #${request.spaceCode}`}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          {StatusBadge.maintenance(request.status)}
          {StatusBadge.priority(request.priority)}
          <span className="badge-neutral capitalize">{request.category}</span>
        </div>
        <p className="border border-line bg-surface-2 p-3 text-sm">{request.description}</p>

        {canManage && (
          <Field label="Update status">
            <select value={request.status} onChange={(e) => onStatus(e.target.value as MaintenanceStatus)} className="capitalize">
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
            </select>
          </Field>
        )}

        <div>
          <div className="eyebrow mb-2">Activity</div>
          <div className="space-y-2">
            <div className="border-l-2 border-line pl-3 text-sm"><span className="text-ink-muted">{request.createdBy}</span> opened this request {formatRelative(request.createdAt)}</div>
            {request.updates.map((u) => (
              <div key={u.id} className="border-l-2 border-accent/40 pl-3 text-sm">
                <div className="flex justify-between text-xs text-ink-subtle"><span>{u.author}</span><span>{formatRelative(u.createdAt)}</span></div>
                <p>{u.text}</p>
              </div>
            ))}
          </div>
          {canManage && (
            <div className="mt-3 flex gap-2">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Post an update…" onKeyDown={(e) => { if (e.key === 'Enter' && text.trim()) { onUpdate(text.trim()); setText(''); } }} />
              <button className="btn-primary shrink-0" disabled={!text.trim()} onClick={() => { onUpdate(text.trim()); setText(''); }}><Send className="h-4 w-4" /></button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
