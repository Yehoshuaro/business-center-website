import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useT } from '@/features/i18n/store';
import { useAuthStore } from '@/features/auth/store';
import { LanguageSwitcher, ThemeSwitcher } from '@/shared/components/layout/Switchers';
import { useSettingsStore } from '@/features/settings/store';

export const LoginPage = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const session = useAuthStore((s) => s.session);
  const signIn = useAuthStore((s) => s.signIn);
  const settings = useSettingsStore((s) => s.settings);

  const [email, setEmail] = useState('admin@business.kz');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(false);

  if (session) return <Navigate to="/site/admin" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = signIn(email, password);
    if (ok) {
      navigate('/site/admin', { replace: true });
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="container-page h-16 flex items-center justify-between gap-3">
        <Link to="/site" className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-accent text-accent-ink font-display text-base font-semibold shrink-0">
            B
          </span>
          <span className="text-sm font-medium tracking-tight truncate">{settings.businessCenterName}</span>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
        <div className="w-full max-w-md">
          <div className="eyebrow mb-3">{t('nav.admin')}</div>
          <h1 className="font-display text-2xl sm:text-3xl tracking-tight mb-2">{t('login.title')}</h1>
          <p className="text-sm text-ink-muted mb-6 sm:mb-8">{t('login.subtitle')}</p>

          <form onSubmit={handleSubmit} className="card p-5 sm:p-6 md:p-8">
            <div className="space-y-4">
              <div>
                <label className="field-label">{t('form.email')}</label>
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
                <label className="field-label">{t('login.password')}</label>
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
                {t('login.invalid')}
              </div>
            )}

            <button type="submit" className="btn-primary w-full mt-6">
              {t('login.submit')}
            </button>
          </form>

          <Link to="/site" className="block mt-6 text-center text-sm text-ink-muted hover:text-ink underline underline-offset-4">
            {t('common.back')}
          </Link>
        </div>
      </div>
    </div>
  );
};
