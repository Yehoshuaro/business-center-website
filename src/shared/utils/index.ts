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

/** KZT currency, no fractional part. Accepts null → "On request". */
export const formatKzt = (value: number | null, onNull = 'On request'): string => {
  if (value === null || value === undefined) return onNull;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KZT',
    maximumFractionDigits: 0,
  }).format(value);
};

/** Compact KZT, e.g. "₸3.9M". */
export const formatKztCompact = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KZT',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

/** Date only, e.g. "11 Jun 2026". */
export const formatDay = (iso: string): string => {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

/** Relative phrasing like "today", "3 days ago". */
export const formatRelative = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
};

/** Initials from a full name. */
export const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
