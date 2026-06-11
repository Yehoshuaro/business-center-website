import { create } from 'zustand';
import type { ThemeName } from '@/shared/types';

const STORAGE_KEY = 'bc.theme';

const readInitial = (): ThemeName => {
  if (typeof window === 'undefined') return 'blue';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'blue' || stored === 'brown' || stored === 'black' || stored === 'silver' || stored === 'green') {
    return stored;
  }
  return 'blue';
};

const apply = (theme: ThemeName) => {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
};

interface ThemeState {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: readInitial(),
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
    apply(theme);
    set({ theme });
  },
}));

// Apply on first load
apply(readInitial());

export const THEMES: { value: ThemeName; labelKey: string }[] = [
  { value: 'blue', labelKey: 'settings.theme.blue' },
  { value: 'brown', labelKey: 'settings.theme.brown' },
  { value: 'black', labelKey: 'settings.theme.black' },
  { value: 'silver', labelKey: 'settings.theme.silver' },
  { value: 'green', labelKey: 'settings.theme.green' },
];
