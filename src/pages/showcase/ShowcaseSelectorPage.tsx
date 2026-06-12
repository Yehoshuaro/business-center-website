import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, Layers, Globe2, Cpu } from 'lucide-react';
import { cn } from '@/shared/utils';
import { BrandMark } from '@/shared/components/layout/BrandMark';
import { Photo } from '@/shared/components/ui';
import { LanguageSwitcher } from '@/shared/components/common/LanguageSwitcher';
import { ThemeSwitcher } from '@/shared/components/common/ThemeSwitcher';

type Complexity = 'simple' | 'medium' | 'advanced';

interface Pkg {
  id: 'pkg1' | 'pkg2' | 'pkg3';
  to: string;
  photo: string;
  icon: typeof Layers;
  complexity: Complexity;
  accent: boolean;
}

const PACKAGES: Pkg[] = [
  { id: 'pkg1', to: '/landing', photo: 'lobby', icon: Layers, complexity: 'simple', accent: false },
  { id: 'pkg2', to: '/corporate', photo: 'atrium', icon: Globe2, complexity: 'medium', accent: false },
  { id: 'pkg3', to: '/platform', photo: 'facade', icon: Cpu, complexity: 'advanced', accent: true },
];

const COMPLEXITY_TONE: Record<Complexity, string> = {
  simple: 'badge-neutral',
  medium: 'badge-warning',
  advanced: 'badge-accent',
};

export const ShowcaseSelectorPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-full flex-col">
      {/* Top bar */}
      <header className="border-b border-line">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <BrandMark />
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 hero-glow" />
        <div className="container-page relative py-16 text-center md:py-24">
          <div className="mx-auto inline-flex items-center gap-2 border border-line bg-surface px-3 py-1 text-xs text-ink-muted">
            <Layers className="h-3.5 w-3.5" /> {t('selector.badge')}
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl leading-[1.05] tracking-tight text-balance md:text-6xl">
            {t('selector.title')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-muted leading-relaxed">{t('selector.subtitle')}</p>
        </div>
      </section>

      {/* Package cards */}
      <section className="container-page py-14 md:py-20">
        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          {PACKAGES.map((pkg, idx) => (
            <div
              key={pkg.id}
              className={cn(
                'group relative flex flex-col overflow-hidden border bg-surface transition-shadow hover:shadow-card-hover',
                pkg.accent ? 'border-accent ring-1 ring-accent' : 'border-line',
              )}
            >
              <div className="relative aspect-[16/10]">
                <Photo name={pkg.photo} alt={t(`selector.${pkg.id}.name`)} className="h-full w-full" imgClassName="transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center bg-surface/90 text-accent backdrop-blur">
                    <pkg.icon className="h-4 w-4" />
                  </span>
                  <span className="bg-surface/90 px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-ink backdrop-blur">
                    {t(`selector.${pkg.id}.tagline`)}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-2xl tracking-tight">{t(`selector.${pkg.id}.name`)}</h2>
                  <span className={COMPLEXITY_TONE[pkg.complexity]}>{t(`selector.complexity.${pkg.complexity}`)}</span>
                </div>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">{t(`selector.${pkg.id}.desc`)}</p>

                <div className="mt-5 border-t border-line pt-5">
                  <div className="eyebrow mb-3">{t('selector.featuresLabel')}</div>
                  <ul className="space-y-2">
                    {(t(`selector.${pkg.id}.features`, { returnObjects: true }) as unknown as string[]).map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={pkg.to}
                  className={cn('mt-6 w-full', pkg.accent ? 'btn-primary' : 'btn-secondary')}
                >
                  {t('selector.openDemo')} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <span className="absolute right-4 top-4 font-display text-4xl text-white/80 mix-blend-overlay">
                {idx + 1}
              </span>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-ink-subtle">{t('selector.note')}</p>
      </section>

      <footer className="mt-auto border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-subtle sm:flex-row">
          <BrandMark />
          <span>{t('footer.demoNote')}</span>
        </div>
      </footer>
    </div>
  );
};
