import { create } from 'zustand';
import type { Tenant } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { seedTenants } from '@/data/seed';
import { uid } from '@/shared/utils';

const KEY = 'bc.tenants';

interface TenantsState {
  items: Tenant[];
  create: (data: Omit<Tenant, 'id'>) => Tenant;
  update: (id: string, data: Partial<Tenant>) => void;
  remove: (id: string) => void;
  togglePublished: (id: string) => void;
}

export const useTenantsStore = create<TenantsState>((set) => ({
  items: readPersisted<Tenant[]>(KEY, seedTenants),
  create: (data) => {
    const tenant: Tenant = { id: uid(), ...data };
    set((s) => {
      const next = [tenant, ...s.items];
      writePersisted(KEY, next);
      return { items: next };
    });
    return tenant;
  },
  update: (id, data) => {
    set((s) => {
      const next = s.items.map((t) => (t.id === id ? { ...t, ...data } : t));
      writePersisted(KEY, next);
      return { items: next };
    });
  },
  remove: (id) => {
    set((s) => {
      const next = s.items.filter((t) => t.id !== id);
      writePersisted(KEY, next);
      return { items: next };
    });
  },
  togglePublished: (id) => {
    set((s) => {
      const next = s.items.map((t) => (t.id === id ? { ...t, isPublished: !t.isPublished } : t));
      writePersisted(KEY, next);
      return { items: next };
    });
  },
}));
