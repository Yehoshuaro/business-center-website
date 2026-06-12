import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppRouter } from './router';
import { useThemeStore } from '@/store/theme';

/**
 * Root component. Applies the selected colour theme to the document and keeps
 * the <html lang> attribute in sync with the active language, then renders
 * routes. Theme + language are persisted in localStorage and shared across all
 * three showcase packages.
 */
export const App = () => {
  const theme = useThemeStore((s) => s.theme);
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language]);

  return <AppRouter />;
};
