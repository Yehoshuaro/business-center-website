import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en } from './locales/en';
import { ru } from './locales/ru';
import { kk } from './locales/kk';

export const LANGUAGES = ['ru', 'kk', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'ru';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      kk: { translation: kk },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: LANGUAGES,
    interpolation: { escapeValue: false },
    detection: {
      // Persist the user's choice; default to Russian on first visit
      // (no navigator lookup, so the default is deterministic).
      order: ['localStorage'],
      lookupLocalStorage: 'bc.lang',
      caches: ['localStorage'],
    },
  });

export default i18n;
