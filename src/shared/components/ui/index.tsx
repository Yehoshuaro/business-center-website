import { useEffect } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import i18n from '@/i18n';
import { cn, initials } from '@/shared/utils';
import { ICONS } from './icons';

export { Photo } from './Photo';
export { Modal } from './Modal';

// ---------------------------------------------------------------------------
// Dynamic lucide icon by name (used by data-driven services/nav).
// Only icons listed in ./icons are bundled.
// ---------------------------------------------------------------------------
export const Icon = ({ name, ...props }: { name: string } & LucideProps) => {
  const Cmp = ICONS[name] ?? ICONS.Square;
  return <Cmp {...props} />;
};

// ---------------------------------------------------------------------------
// Status / tone badges
// ---------------------------------------------------------------------------
type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'accent';

const TONE_CLASS: Record<Tone, string> = {
  neutral: 'badge-neutral',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  accent: 'badge-accent',
};

export const Badge = ({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) => (
  <span className={TONE_CLASS[tone]}>{children}</span>
);

/** Tone maps per status group. Labels resolve through i18n at `dashboard.status.<group>.<value>`. */
const STATUS_TONES: Record<string, Record<string, Tone>> = {
  space: { available: 'success', reserved: 'warning', occupied: 'neutral' },
  lead: { new: 'accent', contacted: 'warning', touring: 'warning', negotiation: 'warning', won: 'success', lost: 'neutral' },
  booking: { confirmed: 'success', pending: 'warning', cancelled: 'danger' },
  maintenance: { open: 'accent', 'in-progress': 'warning', resolved: 'success', closed: 'neutral' },
  priority: { low: 'neutral', medium: 'warning', high: 'warning', urgent: 'danger' },
  invoice: { paid: 'success', due: 'warning', overdue: 'danger' },
  account: { active: 'success', disabled: 'neutral' },
};

export const StatusBadge = {
  space: (s: string) => badgeFor('space', s),
  lead: (s: string) => badgeFor('lead', s),
  booking: (s: string) => badgeFor('booking', s),
  maintenance: (s: string) => badgeFor('maintenance', s),
  priority: (s: string) => badgeFor('priority', s),
  invoice: (s: string) => badgeFor('invoice', s),
  account: (s: string) => badgeFor('account', s),
};

function badgeFor(group: string, value: string) {
  const tone = STATUS_TONES[group]?.[value] ?? 'neutral';
  const key = `dashboard.status.${group}.${value}`;
  const label = i18n.t(key);
  return <Badge tone={tone}>{label === key ? value : label}</Badge>;
}

// ---------------------------------------------------------------------------
// Section heading (marketing + dashboard)
// ---------------------------------------------------------------------------
interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export const SectionHeading = ({ eyebrow, title, subtitle, center, actions, className }: SectionHeadingProps) => (
  <div
    className={cn(
      'flex flex-col gap-4 md:flex-row md:items-end md:justify-between',
      center && 'md:flex-col md:items-center text-center',
      className,
    )}
  >
    <div className={cn('min-w-0', center && 'max-w-2xl')}>
      {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
      <h2 className="section-title text-balance">{title}</h2>
      {subtitle && <p className="mt-3 max-w-2xl text-ink-muted leading-relaxed">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

// ---------------------------------------------------------------------------
// Dashboard page header (compact)
// ---------------------------------------------------------------------------
export const DashHeader = ({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) => (
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      <h1 className="font-display text-2xl tracking-tight sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

/** Search input with a leading icon. */
export const SearchInput = ({ value, onChange, placeholder = 'Search…' }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div className="relative w-full sm:max-w-xs">
    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-9" />
  </div>
);

// ---------------------------------------------------------------------------
// Metric / stat card
// ---------------------------------------------------------------------------
interface MetricProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: string;
  trend?: { value: string; positive?: boolean };
}

export const Metric = ({ label, value, hint, icon, trend }: MetricProps) => (
  <div className="card p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="eyebrow">{label}</div>
      {icon && <Icon name={icon} className="h-4 w-4 text-ink-subtle" />}
    </div>
    <div className="mt-2 font-display text-3xl tracking-tight">{value}</div>
    <div className="mt-1 flex items-center gap-2 text-xs">
      {trend && (
        <span className={trend.positive ? 'text-success' : 'text-danger'}>
          {trend.positive ? '▲' : '▼'} {trend.value}
        </span>
      )}
      {hint && <span className="text-ink-muted">{hint}</span>}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
export const EmptyState = ({ icon = 'Inbox', title, description, action }: { icon?: string; title: string; description?: string; action?: React.ReactNode }) => (
  <div className="card flex flex-col items-center p-12 text-center">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-ink-subtle">
      <Icon name={icon} className="h-6 w-6" />
    </div>
    <div className="font-display text-xl">{title}</div>
    {description && <p className="mt-2 max-w-sm text-sm text-ink-muted">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

// ---------------------------------------------------------------------------
// Avatar (initials)
// ---------------------------------------------------------------------------
export const Avatar = ({ name, className }: { name: string; className?: string }) => (
  <span
    className={cn(
      'inline-flex shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink text-xs font-medium',
      'h-9 w-9',
      className,
    )}
    aria-hidden="true"
  >
    {initials(name)}
  </span>
);

// ---------------------------------------------------------------------------
// Form field wrapper
// ---------------------------------------------------------------------------
export const Field = ({ label, htmlFor, hint, children, className }: { label: string; htmlFor?: string; hint?: string; children: React.ReactNode; className?: string }) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="field-label">
      {label}
    </label>
    {children}
    {hint && <p className="mt-1 text-xs text-ink-subtle">{hint}</p>}
  </div>
);

// ---------------------------------------------------------------------------
// Confirm dialog
// ---------------------------------------------------------------------------
interface ConfirmProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({ open, title, description, confirmLabel, danger, onConfirm, onCancel }: ConfirmProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="absolute inset-0" onClick={onCancel} aria-hidden="true" />
      <div className="modal-card max-w-md p-6">
        <h3 className="font-display text-xl mb-2">{title}</h3>
        {description && <p className="text-sm text-ink-muted mb-5">{description}</p>}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            {i18n.t('dashboard.actions.cancel')}
          </button>
          <button type="button" className={danger ? 'btn-primary bg-danger border-danger hover:bg-danger/90 hover:border-danger/90' : 'btn-primary'} onClick={onConfirm}>
            {confirmLabel ?? i18n.t('dashboard.actions.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Toast (lightweight, self-dismissing)
// ---------------------------------------------------------------------------
export const Toast = ({ message, onDone }: { message: string; onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2">
      <div className="flex items-center gap-2 bg-accent px-4 py-3 text-sm text-accent-ink shadow-card-hover">
        <CheckCircle2 className="h-4 w-4" />
        {message}
      </div>
    </div>
  );
};
