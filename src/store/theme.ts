import { create } from 'zustand';
import type { ThemeName } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';

const KEY = 'bc.theme';

/** The six selectable colour themes, in display order. `swatch` drives the dropdown preview. */
export const THEMES: { value: ThemeName; labelKey: string; swatch: string }[] = [
  { value: 'blue', labelKey: 'theme.blue', swatch: 'rgb(26 54 93)' },
  { value: 'green', labelKey: 'theme.green', swatch: 'rgb(26 66 46)' },
  { value: 'gold', labelKey: 'theme.gold', swatch: 'rgb(146 104 28)' },
  { value: 'black', labelKey: 'theme.black', swatch: 'rgb(20 22 26)' },
  { value: 'silver', labelKey: 'theme.silver', swatch: 'rgb(60 70 84)' },
  { value: 'brown', labelKey: 'theme.brown', swatch: 'rgb(76 47 26)' },
];

export const DEFAULT_THEME: ThemeName = 'blue';

interface ThemeState {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: readPersisted<ThemeName>(KEY, DEFAULT_THEME),
  setTheme: (theme) => {
    writePersisted(KEY, theme);
    set({ theme });
  },
}));
