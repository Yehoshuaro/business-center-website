import { create } from 'zustand';
import type { ConferenceRoom } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { seedConferenceRooms } from '@/data/seed';
import { uid } from '@/shared/utils';

const KEY = 'bc.conferenceRooms';

interface RoomsState {
  items: ConferenceRoom[];
  create: (data: Omit<ConferenceRoom, 'id'>) => ConferenceRoom;
  update: (id: string, data: Partial<ConferenceRoom>) => void;
  remove: (id: string) => void;
  getById: (id: string) => ConferenceRoom | undefined;
}

export const useConferenceRoomsStore = create<RoomsState>((set, get) => ({
  items: readPersisted<ConferenceRoom[]>(KEY, seedConferenceRooms),
  create: (data) => {
    const room: ConferenceRoom = { id: uid(), ...data };
    set((s) => {
      const next = [room, ...s.items];
      writePersisted(KEY, next);
      return { items: next };
    });
    return room;
  },
  update: (id, data) => {
    set((s) => {
      const next = s.items.map((r) => (r.id === id ? { ...r, ...data } : r));
      writePersisted(KEY, next);
      return { items: next };
    });
  },
  remove: (id) => {
    set((s) => {
      const next = s.items.filter((r) => r.id !== id);
      writePersisted(KEY, next);
      return { items: next };
    });
  },
  getById: (id) => get().items.find((r) => r.id === id),
}));
