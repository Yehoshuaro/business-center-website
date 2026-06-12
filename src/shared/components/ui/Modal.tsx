import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

const SIZES = { md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' } as const;

export const Modal = ({ open, onClose, title, description, children, footer, size = 'lg' }: ModalProps) => {
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
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className={cn('modal-card', SIZES[size])}>
        <div className="modal-head">
          <div className="min-w-0">
            <h2 className="font-display text-xl tracking-tight truncate">{title}</h2>
            {description && <p className="text-sm text-ink-muted mt-0.5">{description}</p>}
          </div>
          <button type="button" className="btn-ghost btn-sm -mr-2" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
};
