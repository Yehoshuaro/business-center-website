import { useState } from 'react';
import { Check } from 'lucide-react';
import { useT, useI18nStore } from '@/features/i18n/store';
import { useSettingsStore } from '@/features/settings/store';
import { useThemeStore, THEMES } from '@/features/theme/store';
import { LANGUAGES } from '@/features/i18n/dictionaries';
import type { SiteSettings, ThemeName, LanguageCode, LocalizedText } from '@/shared/types';
import { PageHeader } from '@/shared/components/ui';
import { cn } from '@/shared/utils';

export const AdminSettingsPage = () => {
  const { t } = useT();
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.update);
  const setLanguage = useI18nStore((s) => s.setLanguage);
  const setTheme = useThemeStore((s) => s.setTheme);

  const [form, setForm] = useState<SiteSettings>(settings);
  const [contentLang, setContentLang] = useState<LanguageCode>('ru');
  const [saved, setSaved] = useState(false);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    // Apply theme and language immediately
    if (form.theme !== settings.theme) setTheme(form.theme);
    if (form.language !== settings.language) setLanguage(form.language);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const setLocalized = (
    field: 'heroTitle' | 'heroSubtitle' | 'aboutText',
    lang: LanguageCode,
    value: string,
  ) => {
    const updated: LocalizedText = { ...form[field], [lang]: value };
    setForm({ ...form, [field]: updated });
  };

  return (
    <>
      <PageHeader eyebrow={t('admin.settings')} title={t('admin.settings')} />

      <form onSubmit={onSave} className="space-y-6 sm:space-y-8 max-w-4xl">
        {/* GENERAL */}
        <section className="card p-5 sm:p-6">
          <h2 className="font-display text-lg sm:text-xl tracking-tight mb-1">{t('settings.general')}</h2>
          <p className="text-xs text-ink-muted mb-5">{t('contacts.info')}</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="field-label">{t('settings.businessName')}</label>
              <input
                type="text"
                required
                value={form.businessCenterName}
                onChange={(e) => setForm({ ...form, businessCenterName: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">{t('contacts.address')}</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">{t('contacts.phone')}</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">{t('contacts.email')}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">{t('contacts.hours')}</label>
              <input
                type="text"
                value={form.workingHours}
                onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* APPEARANCE */}
        <section className="card p-5 sm:p-6">
          <h2 className="font-display text-lg sm:text-xl tracking-tight mb-5">{t('settings.appearance')}</h2>

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="field-label">{t('common.theme')}</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {THEMES.map((th) => (
                  <button
                    type="button"
                    key={th.value}
                    onClick={() => setForm({ ...form, theme: th.value as ThemeName })}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 text-sm border transition-colors',
                      form.theme === th.value
                        ? 'border-accent bg-surface-2 text-ink'
                        : 'border-line-strong text-ink-muted hover:bg-surface-2',
                    )}
                  >
                    <span className="truncate">{t(th.labelKey)}</span>
                    {form.theme === th.value && <Check size={14} className="shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="field-label">{t('common.language')}</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {LANGUAGES.map((lng) => (
                  <button
                    type="button"
                    key={lng.code}
                    onClick={() => setForm({ ...form, language: lng.code })}
                    className={cn(
                      'flex items-center justify-between gap-2 px-3 py-2 text-sm border transition-colors',
                      form.language === lng.code
                        ? 'border-accent bg-surface-2 text-ink'
                        : 'border-line-strong text-ink-muted hover:bg-surface-2',
                    )}
                  >
                    <span className="truncate">{lng.label}</span>
                    {form.language === lng.code && <Check size={14} className="shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT (multilingual) */}
        <section className="card p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="font-display text-lg sm:text-xl tracking-tight">{t('settings.content')}</h2>
              <p className="text-xs text-ink-muted mt-1">Hero &amp; About — per language</p>
            </div>
            <div className="inline-flex border border-line-strong bg-surface self-start">
              {LANGUAGES.map((lng) => (
                <button
                  key={lng.code}
                  type="button"
                  onClick={() => setContentLang(lng.code)}
                  className={cn(
                    'px-3 py-2 text-xs uppercase tracking-wider min-w-[44px]',
                    contentLang === lng.code
                      ? 'bg-accent text-accent-ink'
                      : 'text-ink-muted hover:bg-surface-2',
                  )}
                >
                  {lng.short}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="field-label">{t('settings.heroTitle')}</label>
              <input
                type="text"
                value={form.heroTitle[contentLang]}
                onChange={(e) => setLocalized('heroTitle', contentLang, e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">{t('settings.heroSubtitle')}</label>
              <textarea
                value={form.heroSubtitle[contentLang]}
                onChange={(e) => setLocalized('heroSubtitle', contentLang, e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">{t('settings.aboutText')}</label>
              <textarea
                className="min-h-[160px]"
                value={form.aboutText[contentLang]}
                onChange={(e) => setLocalized('aboutText', contentLang, e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <button type="submit" className="btn-primary w-full sm:w-auto justify-center">
            {t('common.save')}
          </button>
          {saved && (
            <span className="text-sm text-success inline-flex items-center gap-1.5">
              <Check size={14} /> {t('settings.saved')}
            </span>
          )}
        </div>
      </form>
    </>
  );
};
