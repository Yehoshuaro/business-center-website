import { create } from 'zustand';
import type { SiteSettings } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { seedSettings } from '@/data/seed';

const KEY = 'bc.settings';

interface SettingsState {
  settings: SiteSettings;
  update: (patch: Partial<SiteSettings>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: readPersisted<SiteSettings>(KEY, seedSettings),
  update: (patch) => {
    set((s) => {
      const next = { ...s.settings, ...patch };
      writePersisted(KEY, next);
      return { settings: next };
    });
  },
}));
