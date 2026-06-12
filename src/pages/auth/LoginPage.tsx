import { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuthStore, DEMO_ACCOUNTS } from '@/store/auth';
import { ROLE_META } from '@/features/access/roles';
import { BrandMark } from '@/shared/components/layout/BrandMark';
import { LanguageSwitcher } from '@/shared/components/common/LanguageSwitcher';
import { Field, Photo } from '@/shared/components/ui';

export const LoginPage = () => {
  const { t } = useTranslation();
  const session = useAuthStore((s) => s.session);
  const signIn = useAuthStore((s) => s.signIn);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  if (session) return <Navigate to="/dashboard" replace />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = signIn(email, password);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  const useDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="grid min-h-full lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between gap-3">
          <Link to="/platform"><BrandMark /></Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/platform" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink">
              <ArrowLeft className="h-4 w-4" /> {t('auth.backToSite')}
            </Link>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="font-display text-3xl tracking-tight">{t('auth.title')}</h1>
            <p className="mt-2 text-sm text-ink-muted">{t('auth.subtitle')}</p>

            {error && (
              <div className="mt-6 flex items-center gap-2 border border-danger/40 bg-danger/5 px-3 py-2.5 text-sm text-danger">
                <AlertCircle className="h-4 w-4 shrink-0" /> {t(error)}
              </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
              <Field label={t('auth.email')} htmlFor="email">
                <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
              </Field>
              <Field label={t('auth.password')} htmlFor="password">
                <div className="relative">
                  <input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pr-10" />
                  <button type="button" onClick={() => setShow((v) => !v)} className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-subtle hover:text-ink" aria-label={show ? t('auth.hidePassword') : t('auth.showPassword')}>
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
              <button type="submit" className="btn-primary w-full">
                <LogIn className="h-4 w-4" /> {t('auth.signIn')}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-8">
              <div className="flex items-center gap-3">
                <span className="hairline flex-1" />
                <span className="eyebrow">{t('auth.demoAccounts')}</span>
                <span className="hairline flex-1" />
              </div>
              <div className="mt-4 space-y-2">
                {DEMO_ACCOUNTS.map((d) => (
                  <button
                    key={d.email}
                    type="button"
                    onClick={() => useDemo(d.email, d.password)}
                    className="flex w-full items-center justify-between gap-3 border border-line px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-2"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{d.email}</span>
                      <span className="block truncate text-xs text-ink-muted">{t(d.labelKey)}</span>
                    </span>
                    <span className={ROLE_META[d.role].badgeClass}>{t(ROLE_META[d.role].labelKey)}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-ink-subtle">{t('auth.demoHint')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual side */}
      <div className="relative hidden lg:block">
        <Photo name="night" alt="Meridian at night" className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/40" />
        <div className="absolute bottom-0 left-0 p-12 text-white">
          <div className="font-display text-3xl leading-tight">Meridian Business Center</div>
          <p className="mt-3 max-w-md text-white/80">{t('auth.heroText')}</p>
        </div>
      </div>
    </div>
  );
};
