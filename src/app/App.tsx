import { useEffect, useRef } from 'react';
import { AppRouter } from './router';
import { useSettingsStore } from '@/features/settings/store';
import { useThemeStore } from '@/features/theme/store';
import { useI18nStore } from '@/features/i18n/store';

/**
 * Top-level component. On first mount it synchronises the theme / language
 * stores with the values saved in site settings — but only if the visitor
 * has no prior personal preference stored in localStorage. This way the
 * theme/language selected in the admin panel acts as a global default that
 * end users can still override via the public header switchers.
 */
export const App = () => {
  const settings = useSettingsStore((s) => s.settings);
  const setTheme = useThemeStore((s) => s.setTheme);
  const setLanguage = useI18nStore((s) => s.setLanguage);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    if (typeof window === 'undefined') return;

    if (!window.localStorage.getItem('bc.theme')) {
      setTheme(settings.theme);
    }
    if (!window.localStorage.getItem('bc.language')) {
      setLanguage(settings.language);
    }
  }, [settings.theme, settings.language, setTheme, setLanguage]);

  return <AppRouter />;
};
