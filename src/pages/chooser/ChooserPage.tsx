import { Link } from 'react-router-dom';
import { useT } from '@/features/i18n/store';
import { LanguageSwitcher, ThemeSwitcher } from '@/shared/components/layout/Switchers';
import { PhotoImg } from '@/shared/components/ui/PhotoImg';
import { PHOTOS } from '@/shared/photos';
import { cn } from '@/shared/utils';

interface Tier {
  id: 'tier1' | 'tier2' | 'tier3';
  to: string;
  photo: { src: string; fallback: string };
  /** price is rendered as "from" only for the top tier */
  openEnded?: boolean;
}

const TIERS: Tier[] = [
  { id: 'tier1', to: '/landing', photo: PHOTOS.lobby },
  { id: 'tier2', to: '/site', photo: PHOTOS.facade },
  { id: 'tier3', to: '/crm/login', photo: PHOTOS.boardroom, openEnded: true },
];

const FEATURE_KEYS = ['f1', 'f2', 'f3', 'f4'] as const;

export const ChooserPage = () => {
  const { t } = useT();

  return (
    <div className="min-h-screen bg-surface text-ink flex flex-col">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 hero-glow" aria-hidden="true" />

      {/* Top bar */}
      <header className="relative z-10 border-b border-line bg-surface/90 backdrop-blur">
        <div className="container-page h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex w-8 h-8 items-center justify-center bg-accent text-accent-ink font-display text-lg leading-none select-none">
              W
            </span>
            <span className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.22em] text-ink truncate">
              Web Atelier
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* Headline */}
        <section className="container-page pt-12 sm:pt-16 md:pt-20 pb-10 sm:pb-14">
          <div className="eyebrow mb-4 sm:mb-5 flex items-center">
            <span className="inline-block w-6 sm:w-8 h-px bg-accent mr-3" />
            {t('chooser.eyebrow')}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.04] tracking-tight max-w-4xl text-balance">
            {t('chooser.title')}
          </h1>
          <p className="mt-5 sm:mt-6 max-w-2xl text-sm sm:text-base text-ink-muted leading-relaxed">
            {t('chooser.subtitle')}
          </p>
        </section>

        {/* Tier cards */}
        <section className="container-page pb-12 sm:pb-16">
          <div className="grid gap-5 md:gap-6 md:grid-cols-3 items-stretch">
            {TIERS.map((tier, i) => (
              <article
                key={tier.id}
                className="group relative flex flex-col bg-surface border border-line shadow-card
                           transition-all duration-300 hover:shadow-card-hover hover:border-line-strong hover:-translate-y-1"
              >
                {/* Photo band */}
                <Link to={tier.to} tabIndex={-1} className="block relative aspect-[16/8] overflow-hidden border-b border-line bg-surface-2">
                  <PhotoImg
                    src={tier.photo.src}
                    fallback={tier.photo.fallback}
                    alt={t(`${tier.id}.name`)}
                    className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0
                               scale-100 group-hover:scale-[1.04] transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <div className="absolute left-4 bottom-3 text-[11px] uppercase tracking-[0.2em] text-white/85">
                    {String(i + 1).padStart(2, '0')} / 03
                  </div>
                </Link>

                {/* Body */}
                <div className="flex flex-col flex-1 p-5 sm:p-6 md:p-7">
                  <h2 className="font-display text-2xl sm:text-3xl tracking-tight leading-tight">
                    {t(`${tier.id}.name`)}
                  </h2>
                  <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">
                    {t(`${tier.id}.tagline`)}
                  </p>

                  {/* Price */}
                  <div className="mt-5 pt-5 border-t border-line flex items-baseline gap-2 flex-wrap">
                    {tier.openEnded && (
                      <span className="text-sm text-ink-muted">{t('chooser.from')}</span>
                    )}
                    <span className="font-display text-4xl sm:text-[2.75rem] leading-none tracking-tight tabular-nums">
                      {t(`${tier.id}.price`)}
                    </span>
                    <span className="text-sm text-ink-muted">
                      {t('chooser.thousandTenge')}
                      {tier.openEnded && ' +'}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="mt-5 sm:mt-6">
                    <div className="eyebrow mb-2">{t('chooser.includes')}</div>
                    <ul>
                      {FEATURE_KEYS.map((f) => (
                        <li
                          key={f}
                          className="py-2.5 text-sm text-ink leading-relaxed border-b border-line last:border-b-0"
                        >
                          {t(`${tier.id}.${f}`)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Timeline */}
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-ink-muted">{t('chooser.timeline')}</span>
                    <span className="text-ink font-medium">{t(`${tier.id}.time`)}</span>
                  </div>

                  {/* CTA pinned to bottom */}
                  <div className="mt-auto pt-6">
                    <Link
                      to={tier.to}
                      className={cn(
                        'w-full',
                        tier.id === 'tier2' ? 'btn-primary' : 'btn-secondary',
                      )}
                    >
                      {t('chooser.open')}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Footer note */}
      <footer className="relative z-10 border-t border-line">
        <div className="container-page py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 justify-between">
          <p className="text-xs text-ink-muted leading-relaxed max-w-xl">{t('chooser.note')}</p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-subtle whitespace-nowrap">
            Web Atelier · Astana · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};
