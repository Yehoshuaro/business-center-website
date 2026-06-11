import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useCrmStore } from '@/features/crm/store';
import { PageHeader, ConfirmDialog } from '@/shared/components/ui';
import { LanguageSwitcher, ThemeSwitcher } from '@/shared/components/layout/Switchers';

export const CrmSettingsPage = () => {
  const { t } = useT();
  const session = useCrmStore((s) => s.session);
  const resetDemoData = useCrmStore((s) => s.resetDemoData);
  const log = useCrmStore((s) => s.log);

  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  if (session?.role !== 'admin') return <Navigate to="/crm" replace />;

  const doReset = () => {
    resetDemoData();
    log(t('crm.settings.resetDone'));
    setConfirmReset(false);
    setResetDone(true);
    window.setTimeout(() => setResetDone(false), 4000);
  };

  return (
    <>
      <PageHeader title={t('crm.settings.title')} />

      <div className="grid gap-4 max-w-2xl">
        <section className="card p-5 sm:p-6">
          <div className="eyebrow mb-4">{t('crm.settings.appearance')}</div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </section>

        <section className="card p-5 sm:p-6">
          <div className="eyebrow mb-2">{t('crm.settings.resetData')}</div>
          <p className="text-sm text-ink-muted leading-relaxed mb-4">{t('crm.settings.resetHint')}</p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-secondary" onClick={() => setConfirmReset(true)}>
              <RotateCcw size={15} /> {t('crm.settings.resetData')}
            </button>
            {resetDone && <span className="badge-success">{t('crm.settings.resetDone')}</span>}
          </div>
        </section>

        <p className="text-xs text-ink-muted leading-relaxed px-1">{t('crm.login.demoNote')}</p>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title={t('crm.settings.resetData')}
        description={t('crm.settings.resetHint')}
        onConfirm={doReset}
        onCancel={() => setConfirmReset(false)}
      />
    </>
  );
};
