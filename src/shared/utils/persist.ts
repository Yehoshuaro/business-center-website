import { safeJSONParse } from '@/shared/utils';

export const readPersisted = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  return safeJSONParse<T>(window.localStorage.getItem(key), fallback);
};

export const writePersisted = <T,>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};
