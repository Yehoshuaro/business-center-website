import { create } from 'zustand';
import type { Office } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { seedOffices } from '@/data/seed';
import { uid } from '@/shared/utils';

const KEY = 'bc.offices';

interface OfficesState {
  items: Office[];
  create: (data: Omit<Office, 'id'>) => Office;
  update: (id: string, data: Partial<Office>) => void;
  remove: (id: string) => void;
  getById: (id: string) => Office | undefined;
}

export const useOfficesStore = create<OfficesState>((set, get) => ({
  items: readPersisted<Office[]>(KEY, seedOffices),
  create: (data) => {
    const office: Office = { id: uid(), ...data };
    set((s) => {
      const next = [office, ...s.items];
      writePersisted(KEY, next);
      return { items: next };
    });
    return office;
  },
  update: (id, data) => {
    set((s) => {
      const next = s.items.map((o) => (o.id === id ? { ...o, ...data } : o));
      writePersisted(KEY, next);
      return { items: next };
    });
  },
  remove: (id) => {
    set((s) => {
      const next = s.items.filter((o) => o.id !== id);
      writePersisted(KEY, next);
      return { items: next };
    });
  },
  getById: (id) => get().items.find((o) => o.id === id),
}));
