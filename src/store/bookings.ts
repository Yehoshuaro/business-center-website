import { create } from 'zustand';
import type { Booking, BookingStatus } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { seedBookings } from '@/data/seed';
import { uid } from '@/shared/utils';

const KEY = 'bc.bookings';

interface BookingsState {
  items: Booking[];
  create: (data: Omit<Booking, 'id' | 'createdAt' | 'status'> & { status?: BookingStatus }) => Booking;
  setStatus: (id: string, status: BookingStatus) => void;
  remove: (id: string) => void;
}

export const useBookingsStore = create<BookingsState>((set) => ({
  items: readPersisted<Booking[]>(KEY, seedBookings),
  create: ({ status = 'pending', ...data }) => {
    const booking: Booking = { id: uid(), createdAt: new Date().toISOString(), status, ...data };
    set((s) => {
      const next = [booking, ...s.items];
      writePersisted(KEY, next);
      return { items: next };
    });
    return booking;
  },
  setStatus: (id, status) =>
    set((s) => {
      const next = s.items.map((b) => (b.id === id ? { ...b, status } : b));
      writePersisted(KEY, next);
      return { items: next };
    }),
  remove: (id) =>
    set((s) => {
      const next = s.items.filter((b) => b.id !== id);
      writePersisted(KEY, next);
      return { items: next };
    }),
}));
