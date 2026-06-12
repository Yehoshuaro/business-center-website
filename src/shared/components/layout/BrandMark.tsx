import { cn } from '@/shared/utils';

/** Meridian wordmark: a geometric monogram + name. */
export const BrandMark = ({ className, light }: { className?: string; light?: boolean }) => (
  <span className={cn('inline-flex items-center gap-2.5', className)}>
    <span
      className={cn(
        'grid h-8 w-8 place-items-center border',
        light ? 'border-accent-ink/40 text-accent-ink' : 'border-accent text-accent',
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 21V7l9-4 9 4v14" />
        <path d="M9 21v-6h6v6" />
        <path d="M3 11h18" />
      </svg>
    </span>
    <span className="flex flex-col leading-none">
      <span className={cn('font-display text-lg tracking-tight', light && 'text-accent-ink')}>Meridian</span>
      <span className={cn('text-[10px] uppercase tracking-[0.22em] text-ink-subtle', light && 'text-accent-ink/70')}>
        Business Center
      </span>
    </span>
  </span>
);
