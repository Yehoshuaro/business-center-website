import { create } from 'zustand';
import type { Account } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { seedAccounts } from '@/data/seed';
import { uid } from '@/shared/utils';

const KEY = 'bc.accounts';

interface AccountsState {
  items: Account[];
  create: (data: Omit<Account, 'id' | 'createdAt'>) => Account;
  update: (id: string, data: Partial<Account>) => void;
  remove: (id: string) => void;
}

export const useAccountsStore = create<AccountsState>((set) => ({
  items: readPersisted<Account[]>(KEY, seedAccounts),
  create: (data) => {
    const account: Account = { id: uid(), createdAt: new Date().toISOString(), ...data };
    set((s) => {
      const next = [account, ...s.items];
      writePersisted(KEY, next);
      return { items: next };
    });
    return account;
  },
  update: (id, data) =>
    set((s) => {
      const next = s.items.map((a) => (a.id === id ? { ...a, ...data } : a));
      writePersisted(KEY, next);
      return { items: next };
    }),
  remove: (id) =>
    set((s) => {
      const next = s.items.filter((a) => a.id !== id);
      writePersisted(KEY, next);
      return { items: next };
    }),
}));

/** Read the current accounts directly (used by the auth store at sign-in). */
export const getAccounts = (): Account[] => useAccountsStore.getState().items;
