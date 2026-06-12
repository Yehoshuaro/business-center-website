import { create } from 'zustand';
import type { Role, Session } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { getAccounts } from './accounts';

const KEY = 'bc.session';

export type SignInResult =
  | { ok: true }
  | { ok: false; error: string };

interface AuthState {
  session: Session | null;
  signIn: (email: string, password: string) => SignInResult;
  signOut: () => void;
}

/** Demo credentials surfaced on the login screen. */
export const DEMO_ACCOUNTS: ReadonlyArray<{ role: Role; email: string; password: string; label: string }> = [
  { role: 'admin', email: 'admin@crm.kz', password: 'admin123', label: 'Administrator — full system access' },
  { role: 'manager', email: 'manager@crm.kz', password: 'manager123', label: 'Manager — CRM & leasing' },
  { role: 'viewer', email: 'viewer@crm.kz', password: 'viewer123', label: 'Tenant — personal dashboard' },
];

export const useAuthStore = create<AuthState>((set) => ({
  session: readPersisted<Session | null>(KEY, null),
  signIn: (email, password) => {
    const normalized = email.trim().toLowerCase();
    const account = getAccounts().find((a) => a.email.toLowerCase() === normalized);

    if (!account || account.password !== password) {
      return { ok: false, error: 'Incorrect email or password.' };
    }
    if (account.status === 'disabled') {
      return { ok: false, error: 'This account has been disabled. Contact an administrator.' };
    }

    const session: Session = {
      id: account.id,
      email: account.email,
      fullName: account.fullName,
      role: account.role,
      tenantId: account.tenantId,
      title: account.title,
      loggedInAt: new Date().toISOString(),
    };
    writePersisted(KEY, session);
    set({ session });
    return { ok: true };
  },
  signOut: () => {
    writePersisted<Session | null>(KEY, null);
    set({ session: null });
  },
}));
