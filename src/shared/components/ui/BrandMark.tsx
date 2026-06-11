import { cn } from '@/shared/utils';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { box: 'w-8 h-8', text: 'text-[11px]', rule: 'w-5', spacing: 'tracking-[0.06em]' },
  md: { box: 'w-9 h-9', text: 'text-[12px]', rule: 'w-6', spacing: 'tracking-[0.08em]' },
  lg: { box: 'w-12 h-12', text: 'text-base', rule: 'w-8', spacing: 'tracking-[0.1em]' },
};

/**
 * Serif "BC" monogram with hairline above and below — used as the brand avatar
 * in the navbar, footer and admin sidebar.
 */
export const BrandMark = ({ size = 'md', className }: BrandMarkProps) => {
  const s = SIZES[size];
  return (
    <span
      className={cn(
        'relative inline-flex items-center justify-center bg-accent text-accent-ink',
        'shadow-card overflow-hidden select-none',
        s.box,
        className,
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          'font-display font-semibold leading-none flex items-baseline',
          s.text,
          s.spacing,
        )}
      >
        <span>B</span>
        <span>C</span>
      </span>
      <span
        className={cn(
          'absolute left-1/2 -translate-x-1/2 bottom-1 h-px bg-accent-ink/40',
          s.rule,
        )}
      />
    </span>
  );
};
