import { create } from 'zustand';
import type { AdminUser, AdminUserStatus } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { seedUsers } from '@/data/seed';
import { uid } from '@/shared/utils';

const KEY = 'bc.users';

interface UsersState {
  items: AdminUser[];
  create: (data: Omit<AdminUser, 'id'>) => AdminUser;
  update: (id: string, data: Partial<AdminUser>) => void;
  remove: (id: string) => void;
  setStatus: (id: string, status: AdminUserStatus) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  items: readPersisted<AdminUser[]>(KEY, seedUsers),
  create: (data) => {
    const user: AdminUser = { id: uid(), ...data };
    set((s) => {
      const next = [user, ...s.items];
      writePersisted(KEY, next);
      return { items: next };
    });
    return user;
  },
  update: (id, data) => {
    set((s) => {
      const next = s.items.map((u) => (u.id === id ? { ...u, ...data } : u));
      writePersisted(KEY, next);
      return { items: next };
    });
  },
  remove: (id) => {
    set((s) => {
      const next = s.items.filter((u) => u.id !== id);
      writePersisted(KEY, next);
      return { items: next };
    });
  },
  setStatus: (id, status) => {
    set((s) => {
      const next = s.items.map((u) => (u.id === id ? { ...u, status } : u));
      writePersisted(KEY, next);
      return { items: next };
    });
  },
}));
