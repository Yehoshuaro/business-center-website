import { create } from 'zustand';
import type { LanguageCode } from '@/shared/types';
import { dict } from './dictionaries';

const STORAGE_KEY = 'bc.language';

const readInitial = (): LanguageCode => {
  if (typeof window === 'undefined') return 'ru';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'kk' || stored === 'ru' || stored === 'en') return stored;
  return 'ru';
};

interface I18nState {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

export const useI18nStore = create<I18nState>((set, get) => ({
  language: readInitial(),
  setLanguage: (lang) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    }
    set({ language: lang });
  },
  t: (key) => {
    const entry = dict[key];
    const lang = get().language;
    if (!entry) {
      if (import.meta.env.DEV) console.warn(`[i18n] Missing key: ${key}`);
      return key;
    }
    return entry[lang] ?? entry.ru ?? key;
  },
}));

// Convenience hook returning t function and current language
export const useT = () => {
  const t = useI18nStore((s) => s.t);
  const language = useI18nStore((s) => s.language);
  return { t, language };
};

// Init on first load — set <html lang>
if (typeof document !== 'undefined') {
  document.documentElement.lang = readInitial();
}
