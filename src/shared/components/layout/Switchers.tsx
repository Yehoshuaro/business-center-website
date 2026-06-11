import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useI18nStore } from '@/features/i18n/store';
import { LANGUAGES } from '@/features/i18n/dictionaries';
import { useThemeStore, THEMES } from '@/features/theme/store';
import { useT } from '@/features/i18n/store';
import { cn } from '@/shared/utils';

interface DropdownProps {
  label: string;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

const Dropdown = ({ label, children, align = 'right' }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium tracking-wider uppercase
                   text-ink-muted hover:text-ink border border-line hover:border-line-strong transition-colors"
      >
        {label}
        <ChevronDown size={14} strokeWidth={2} />
      </button>
      {open && (
        <div
          className={cn(
            'absolute top-full mt-1 z-50 min-w-[160px] bg-surface border border-line shadow-card py-1',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const LanguageSwitcher = () => {
  const language = useI18nStore((s) => s.language);
  const setLanguage = useI18nStore((s) => s.setLanguage);
  const active = LANGUAGES.find((l) => l.code === language)!;

  return (
    <Dropdown label={active.short}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => setLanguage(lang.code)}
          className={cn(
            'block w-full text-left px-3 py-2 text-sm hover:bg-surface-2 transition-colors',
            lang.code === language ? 'text-accent font-medium' : 'text-ink'
          )}
        >
          {lang.label}
        </button>
      ))}
    </Dropdown>
  );
};

export const ThemeSwitcher = () => {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const { t } = useT();
  const activeLabel = THEMES.find((th) => th.value === theme)?.labelKey ?? 'settings.theme.blue';

  return (
    <Dropdown label={t(activeLabel)}>
      {THEMES.map((th) => (
        <button
          key={th.value}
          type="button"
          onClick={() => setTheme(th.value)}
          className={cn(
            'flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-surface-2 transition-colors text-left',
            th.value === theme ? 'text-accent font-medium' : 'text-ink'
          )}
        >
          <span
            className={cn(
              'inline-block w-3.5 h-3.5 border border-line-strong',
              th.value === 'blue' && 'bg-[#1a365d]',
              th.value === 'brown' && 'bg-[#4c2f1a]',
              th.value === 'black' && 'bg-[#0b0d10]',
              th.value === 'silver' && 'bg-[#3c4654]',
              th.value === 'green' && 'bg-[#1a422e]'
            )}
          />
          {t(th.labelKey)}
        </button>
      ))}
    </Dropdown>
  );
};
