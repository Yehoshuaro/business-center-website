import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  /**
   * When true the modal renders the body without padding so callers
   * (e.g. forms) can manage their own structure inside.
   */
  bodyClassName?: string;
}

const SIZE_MAX = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl',
} as const;

/**
 * Shared modal shell — overlay, header with close, scrollable body, sticky footer.
 * Locks body scroll while open, closes on Escape and overlay click.
 */
export const Modal = ({ open, onClose, title, size = 'lg', children, footer, bodyClassName }: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={cn('modal-card', SIZE_MAX[size])}>
        <div className="modal-head">
          <h2 className="font-display text-lg sm:text-2xl tracking-tight truncate">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-10 h-10 -mr-2 shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className={cn('modal-body', bodyClassName)}>{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
};
