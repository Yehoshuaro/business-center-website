import { useEffect } from 'react';
import { cn } from '@/shared/utils';
import type { OfficeStatus, LeadStatus, AdminUserStatus, ConferenceStatus } from '@/shared/types';
import { useT } from '@/features/i18n/store';

export { Modal } from './Modal';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader = ({ eyebrow, title, subtitle, actions }: PageHeaderProps) => (
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 sm:mb-8">
    <div className="min-w-0">
      {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-tight text-balance break-words">{title}</h1>
      {subtitle && (
        <p className="mt-2 max-w-2xl text-ink-muted text-sm md:text-base leading-relaxed">{subtitle}</p>
      )}
    </div>
    {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
  </div>
);

export const SectionDivider = ({ label }: { label?: string }) => (
  <div className="my-12 flex items-center gap-4">
    <span className="flex-1 hairline" />
    {label && <span className="eyebrow">{label}</span>}
    <span className="flex-1 hairline" />
  </div>
);

// Status badges with translated labels and themed colors
export const OfficeStatusBadge = ({ status }: { status: OfficeStatus | ConferenceStatus }) => {
  const { t } = useT();
  const label = t(`status.${status}`);
  const cls =
    status === 'available'
      ? 'badge-success'
      : status === 'reserved'
        ? 'badge-warning'
        : 'badge-danger';
  return <span className={cls}>{label}</span>;
};

export const LeadStatusBadge = ({ status }: { status: LeadStatus }) => {
  const { t } = useT();
  const map: Record<LeadStatus, string> = {
    new: 'badge-accent',
    contacted: 'badge-warning',
    inProgress: 'badge-warning',
    closed: 'badge-neutral',
  };
  return <span className={map[status]}>{t(`leadStatus.${status}`)}</span>;
};

export const UserStatusBadge = ({ status }: { status: AdminUserStatus }) => {
  const { t } = useT();
  return (
    <span className={status === 'active' ? 'badge-success' : 'badge-neutral'}>
      {t(`userStatus.${status}`)}
    </span>
  );
};

interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
}

export const MetricCard = ({ label, value, hint, className }: MetricCardProps) => (
  <div className={cn('card p-5', className)}>
    <div className="eyebrow">{label}</div>
    <div className="mt-2 font-display text-3xl tracking-tight">{value}</div>
    {hint && <div className="mt-1 text-xs text-ink-muted">{hint}</div>}
  </div>
);

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  const { t } = useT();
  return (
    <div className="card p-10 text-center">
      <div className="font-display text-xl mb-2">{title ?? t('common.empty')}</div>
      {description && <p className="text-sm text-ink-muted mb-4">{description}</p>}
      {action}
    </div>
  );
};

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const { t } = useT();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40" role="dialog" aria-modal="true">
      <div className="absolute inset-0" onClick={onCancel} aria-hidden="true" />
      <div className="relative w-full max-w-md card p-5 sm:p-6">
        <h3 className="font-display text-lg sm:text-xl mb-2">{title ?? t('admin.confirmDelete')}</h3>
        {description && <p className="text-sm text-ink-muted mb-5">{description}</p>}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            {cancelLabel ?? t('common.cancel')}
          </button>
          <button type="button" className="btn-primary" onClick={onConfirm}>
            {confirmLabel ?? t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};
