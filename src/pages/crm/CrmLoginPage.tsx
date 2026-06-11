import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useCrmStore, CRM_DEMO_ACCOUNTS } from '@/features/crm/store';
import { LanguageSwitcher, ThemeSwitcher } from '@/shared/components/layout/Switchers';

export const CrmLoginPage = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const session = useCrmStore((s) => s.session);
  const signIn = useCrmStore((s) => s.signIn);

  const [email, setEmail] = useState('admin@crm.kz');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(false);

  if (session) return <Navigate to="/crm" replace />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signIn(email, password)) navigate('/crm', { replace: true });
    else setError(true);
  };

  const useAccount = (acc: { email: string; password: string }) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError(false);
  };

  return (
    <div className="min-h-screen bg-surface-2 flex flex-col">
      <header className="container-page h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2.5 min-w-0 text-ink-muted hover:text-ink transition-colors">
          <ArrowLeft size={15} />
          <span className="text-sm tracking-tight truncate">{t('common.exitDemo')}</span>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
        <div className="w-full max-w-3xl grid lg:grid-cols-[1fr_minmax(0,360px)] gap-8 lg:gap-12 items-start">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-9 h-9 bg-accent text-accent-ink font-display text-lg font-semibold shrink-0">
                Q
              </span>
              <span className="font-display text-lg tracking-tight">{t('crm.product')}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-3">{t('crm.login.title')}</h1>
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed mb-8 max-w-md">
              {t('crm.login.subtitle')}
            </p>

            <form onSubmit={submit} className="card p-5 sm:p-6 max-w-md">
              <div className="space-y-4">
                <div>
                  <label className="field-label">{t('crm.login.email')}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(false);
                    }}
                  />
                </div>
                <div>
                  <label className="field-label">{t('crm.login.password')}</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(false);
                    }}
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 text-sm text-danger border-l-2 border-danger pl-3 py-1">
                  {t('crm.login.error')}
                </div>
              )}

              <button type="submit" className="btn-primary w-full mt-6">
                {t('crm.login.signIn')}
              </button>
            </form>
          </div>

          <aside className="card p-5 sm:p-6">
            <div className="eyebrow mb-4">{t('crm.login.demoAccounts')}</div>
            <ul className="space-y-3">
              {CRM_DEMO_ACCOUNTS.map((acc) => (
                <li key={acc.email} className="border border-line bg-surface-2 p-3.5">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="badge-accent">{t(`crm.role.${acc.role}`)}</span>
                    <button
                      type="button"
                      className="text-xs underline underline-offset-4 text-ink-muted hover:text-ink"
                      onClick={() => useAccount(acc)}
                    >
                      {t('crm.login.use')}
                    </button>
                  </div>
                  <div className="text-sm font-medium break-all">{acc.email}</div>
                  <div className="text-xs text-ink-muted font-mono mt-0.5">{acc.password}</div>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-ink-muted leading-relaxed border-t border-line pt-4">
              {t('crm.login.demoNote')}
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};
