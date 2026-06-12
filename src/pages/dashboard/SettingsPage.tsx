import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, RotateCcw, Check } from 'lucide-react';
import type { SiteSettings, ThemeName } from '@/shared/types';
import { useSettingsStore } from '@/store/settings';
import { useThemeStore, THEMES } from '@/store/theme';
import { cn } from '@/shared/utils';
import { DashHeader, Field, Toast } from '@/shared/components/ui';

export const SettingsPage = () => {
  const { t: tr } = useTranslation();
  const { settings, update } = useSettingsStore();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const [form, setForm] = useState<SiteSettings>({ ...settings });
  const [toast, setToast] = useState('');
  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => { update(form); setToast(tr('dashboard.settings.saved')); };
  const applyTheme = (name: ThemeName) => { setTheme(name); set('theme', name); update({ theme: name }); };

  const resetDemo = () => {
    Object.keys(localStorage).filter((k) => k.startsWith('bc.')).forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <>
      <DashHeader
        title={tr('dashboard.settings.title')}
        subtitle={tr('dashboard.settings.subtitle')}
        actions={<button className="btn-primary" onClick={save}><Save className="h-4 w-4" /> {tr('dashboard.actions.save')}</button>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Identity */}
          <section className="card p-6">
            <h2 className="font-display text-lg">{tr('dashboard.settings.center')}</h2>
            <p className="text-sm text-ink-muted">{tr('dashboard.settings.centerHint')}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label={tr('dashboard.settings.fCenterName')} className="sm:col-span-2"><input value={form.centerName} onChange={(e) => set('centerName', e.target.value)} /></Field>
              <Field label={tr('dashboard.settings.fTagline')} className="sm:col-span-2"><input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} /></Field>
              <Field label={tr('dashboard.settings.fFounded')}><input type="number" value={form.foundedYear} onChange={(e) => set('foundedYear', Number(e.target.value))} /></Field>
              <Field label={tr('dashboard.settings.fHours')}><input value={form.workingHours} onChange={(e) => set('workingHours', e.target.value)} /></Field>
            </div>
          </section>

          {/* Contact */}
          <section className="card p-6">
            <h2 className="font-display text-lg">{tr('dashboard.settings.contact')}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label={tr('dashboard.settings.fAddress')}><input value={form.address} onChange={(e) => set('address', e.target.value)} /></Field>
              <Field label={tr('dashboard.settings.fCity')}><input value={form.city} onChange={(e) => set('city', e.target.value)} /></Field>
              <Field label={tr('dashboard.settings.fPhone')}><input value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
              <Field label={tr('dashboard.settings.fEmail')}><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <section className="card p-6">
            <h2 className="font-display text-lg">{tr('dashboard.settings.appearance')}</h2>
            <p className="text-sm text-ink-muted">{tr('dashboard.settings.appearanceHint')}</p>
            <div className="mt-5 space-y-2">
              {THEMES.map((th) => (
                <button key={th.value} onClick={() => applyTheme(th.value)} className={cn('flex w-full items-center justify-between border px-3 py-2.5 text-sm transition-colors', theme === th.value ? 'border-accent bg-surface-2' : 'border-line hover:bg-surface-2')}>
                  <span className="flex items-center gap-3">
                    <span className="h-5 w-5 rounded-full border border-line" style={{ background: th.swatch }} />
                    {tr(th.labelKey)}
                  </span>
                  {theme === th.value && <Check className="h-4 w-4 text-accent" />}
                </button>
              ))}
            </div>
          </section>

          {/* Danger zone */}
          <section className="card border-danger/30 p-6">
            <h2 className="font-display text-lg">{tr('dashboard.settings.demoData')}</h2>
            <p className="mt-1 text-sm text-ink-muted">{tr('dashboard.settings.demoDataHint')}</p>
            <button className="btn-danger mt-4 w-full" onClick={resetDemo}><RotateCcw className="h-4 w-4" /> {tr('dashboard.settings.reset')}</button>
          </section>
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </>
  );
};
