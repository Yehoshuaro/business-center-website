import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { LANGUAGES, type Language } from '@/i18n';
import { cn } from '@/shared/utils';

export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = (LANGUAGES.includes(i18n.language as Language) ? i18n.language : 'ru') as Language;

  const choose = (lng: Language) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 border border-line px-2.5 py-1.5 text-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
        aria-label={t('lang.label')}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{current}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-40 border border-line bg-surface shadow-card-hover" role="listbox">
            {LANGUAGES.map((lng) => (
              <button
                key={lng}
                onClick={() => choose(lng)}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-surface-2',
                  current === lng ? 'text-ink' : 'text-ink-muted',
                )}
                role="option"
                aria-selected={current === lng}
              >
                {t(`lang.${lng}`)}
                {current === lng && <Check className="h-4 w-4 text-accent" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
