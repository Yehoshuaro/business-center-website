import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, Check } from 'lucide-react';
import { THEMES, useThemeStore } from '@/store/theme';
import { cn } from '@/shared/utils';

export const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const [open, setOpen] = useState(false);
  const active = THEMES.find((x) => x.value === theme) ?? THEMES[0];

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 border border-line px-2.5 py-1.5 text-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
        aria-label={t('theme.label')}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Palette className="h-4 w-4" />
        <span className="h-3.5 w-3.5 rounded-full border border-line" style={{ background: active.swatch }} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-44 border border-line bg-surface shadow-card-hover" role="listbox">
            <div className="border-b border-line px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-subtle">
              {t('theme.label')}
            </div>
            {THEMES.map((th) => (
              <button
                key={th.value}
                onClick={() => { setTheme(th.value); setOpen(false); }}
                className={cn(
                  'flex w-full items-center justify-between gap-2 whitespace-nowrap px-3 py-2 text-sm transition-colors hover:bg-surface-2',
                  theme === th.value ? 'text-ink' : 'text-ink-muted',
                )}
                role="option"
                aria-selected={theme === th.value}
              >
                <span className="flex items-center gap-2.5">
                  <span className="h-4 w-4 shrink-0 rounded-full border border-line" style={{ background: th.swatch }} />
                  {t(th.labelKey)}
                </span>
                {theme === th.value && <Check className="h-4 w-4 shrink-0 text-accent" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
