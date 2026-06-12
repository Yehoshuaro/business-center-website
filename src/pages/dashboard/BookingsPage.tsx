import { useMemo, useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import type { Booking, BookingStatus } from '@/shared/types';
import { useBookingsStore } from '@/store/bookings';
import { useMeetingRoomsStore } from '@/store/meetingRooms';
import { useTenantsStore } from '@/store/tenants';
import { useAuthStore } from '@/store/auth';
import { formatDay, cn } from '@/shared/utils';
import { DashHeader, StatusBadge, Modal, Field, EmptyState, Metric } from '@/shared/components/ui';

export const BookingsPage = () => {
  const { items, create, setStatus, remove } = useBookingsStore();
  const rooms = useMeetingRoomsStore((s) => s.items);
  const tenants = useTenantsStore((s) => s.items);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

  const roomName = (id: string) => rooms.find((r) => r.id === id)?.name ?? '—';
  const tenantName = (id?: string) => tenants.find((t) => t.id === id)?.companyName;

  const sorted = useMemo(
    () =>
      [...items]
        .filter((b) => filter === 'all' || b.status === filter)
        .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime)),
    [items, filter],
  );

  return (
    <>
      <DashHeader
        title="Bookings"
        subtitle="Meeting and conference room reservations across the building."
        actions={<button className="btn-primary" onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> New booking</button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric label="Total bookings" value={items.length} icon="CalendarDays" />
        <Metric label="Pending approval" value={items.filter((b) => b.status === 'pending').length} icon="Clock" />
        <Metric label="Confirmed" value={items.filter((b) => b.status === 'confirmed').length} icon="CalendarCheck" />
      </div>

      <div className="mb-4 flex gap-2">
        {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('border px-3 py-1.5 text-sm capitalize', filter === f ? 'border-accent bg-accent text-accent-ink' : 'border-line-strong text-ink-muted hover:bg-surface-2')}>{f}</button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon="CalendarDays" title="No bookings" description="Create a booking to reserve a room." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Meeting</th><th>Room</th><th>Date</th><th>Time</th><th>Organizer</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {sorted.map((b) => (
                <tr key={b.id}>
                  <td><div className="font-medium">{b.title}</div>{tenantName(b.tenantId) && <div className="text-xs text-ink-subtle">{tenantName(b.tenantId)}</div>}</td>
                  <td>{roomName(b.roomId)}</td>
                  <td>{formatDay(b.date)}</td>
                  <td>{b.startTime}–{b.endTime}</td>
                  <td>{b.organizer}</td>
                  <td>{StatusBadge.booking(b.status)}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      {b.status === 'pending' && <button className="btn-ghost btn-sm text-success" onClick={() => setStatus(b.id, 'confirmed')} aria-label="Confirm"><Check className="h-4 w-4" /></button>}
                      {b.status !== 'cancelled' && <button className="btn-ghost btn-sm text-danger" onClick={() => setStatus(b.id, 'cancelled')} aria-label="Cancel"><X className="h-4 w-4" /></button>}
                      {b.status === 'cancelled' && <button className="btn-ghost btn-sm text-ink-subtle" onClick={() => remove(b.id)} aria-label="Remove">Remove</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {creating && (
        <BookingForm
          rooms={rooms.map((r) => ({ id: r.id, name: r.name }))}
          onClose={() => setCreating(false)}
          onSave={(data) => { create({ ...data, status: 'confirmed' }); setCreating(false); }}
        />
      )}
    </>
  );
};

const BookingForm = ({ rooms, onClose, onSave }: {
  rooms: { id: string; name: string }[];
  onClose: () => void;
  onSave: (data: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
}) => {
  const session = useAuthStore((s) => s.session);
  const [form, setForm] = useState({
    roomId: rooms[0]?.id ?? '', title: '', organizer: session?.fullName ?? '',
    date: new Date().toISOString().slice(0, 10), startTime: '09:00', endTime: '10:00', attendees: 4,
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title="New booking"
      footer={<><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={() => onSave({ ...form, tenantId: session?.tenantId })}>Create booking</button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Meeting title" className="sm:col-span-2"><input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Quarterly review" /></Field>
        <Field label="Room"><select value={form.roomId} onChange={(e) => set('roomId', e.target.value)}>{rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></Field>
        <Field label="Organizer"><input value={form.organizer} onChange={(e) => set('organizer', e.target.value)} /></Field>
        <Field label="Date"><input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} /></Field>
        <Field label="Attendees"><input type="number" value={form.attendees} onChange={(e) => set('attendees', Number(e.target.value))} /></Field>
        <Field label="Start time"><input type="time" value={form.startTime} onChange={(e) => set('startTime', e.target.value)} /></Field>
        <Field label="End time"><input type="time" value={form.endTime} onChange={(e) => set('endTime', e.target.value)} /></Field>
      </div>
    </Modal>
  );
};
