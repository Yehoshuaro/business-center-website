export const uid = (): string =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export const cn = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ');

export const formatNumber = (n: number, locale: string = 'ru-RU'): string =>
  new Intl.NumberFormat(locale).format(n);

export const formatPrice = (
  value: number | null,
  locale: string = 'ru-RU',
  fallback: string = '—'
): string => {
  if (value === null || value === undefined) return fallback;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'KZT',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (iso: string, locale: string = 'ru-RU'): string => {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export const safeJSONParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};
