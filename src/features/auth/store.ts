import { create } from 'zustand';
import { readPersisted, writePersisted } from '@/shared/utils/persist';

const KEY = 'bc.session';

export const DEMO_CREDENTIALS = {
  email: 'admin@business.kz',
  password: 'admin123',
};

export interface Session {
  email: string;
  fullName: string;
  role: 'admin';
  loggedInAt: string;
}

interface AuthState {
  session: Session | null;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: readPersisted<Session | null>(KEY, null),
  signIn: (email, password) => {
    if (
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      const session: Session = {
        email: DEMO_CREDENTIALS.email,
        fullName: 'Demo Administrator',
        role: 'admin',
        loggedInAt: new Date().toISOString(),
      };
      writePersisted(KEY, session);
      set({ session });
      return true;
    }
    return false;
  },
  signOut: () => {
    writePersisted<Session | null>(KEY, null);
    set({ session: null });
  },
}));
