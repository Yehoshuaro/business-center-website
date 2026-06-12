import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/** Business-center statistics band (labels are translated). */
export const StatsBand = () => {
  const { t } = useTranslation();
  const stats = [
    { value: '24,000', label: t('stats.space') },
    { value: '60+', label: t('stats.residents') },
    { value: '9', label: t('stats.floors') },
    { value: '98%', label: t('stats.occupancy') },
  ];
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden border border-line bg-line lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-surface p-6 text-center sm:p-8">
          <div className="font-display text-3xl tracking-tight sm:text-4xl">{s.value}</div>
          <div className="mt-1 text-sm text-ink-muted">{s.label}</div>
        </div>
      ))}
    </div>
  );
};

interface CTAProps {
  title: string;
  subtitle?: string;
  primary?: { to: string; label: string };
  secondary?: { to: string; label: string };
}

/** Full-width call-to-action band on the accent colour. */
export const CTASection = ({ title, subtitle, primary, secondary }: CTAProps) => {
  const { t } = useTranslation();
  const p = primary ?? { to: '/contact', label: t('nav.bookTour') };
  const s = secondary ?? { to: '/offices', label: t('common.browseSpaces') };
  return (
  <section className="bg-accent text-accent-ink">
    <div className="container-page flex flex-col items-center gap-6 py-16 text-center md:py-20">
      <h2 className="max-w-3xl font-display text-3xl leading-tight tracking-tight text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="max-w-xl text-accent-ink/80">{subtitle}</p>}
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          to={p.to}
          className="btn border-accent-ink bg-accent-ink px-6 text-accent hover:bg-accent-ink/90"
        >
          {p.label}
        </Link>
        <Link
          to={s.to}
          className="btn border-accent-ink/40 bg-transparent px-6 text-accent-ink hover:bg-accent-ink/10"
        >
          {s.label}
        </Link>
      </div>
    </div>
  </section>
  );
};

/** Standard top spacing wrapper for inner public pages. */
export const PageHero = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => (
  <section className="border-b border-line bg-surface-2">
    <div className="container-page py-14 md:py-20">
      <div className="eyebrow mb-3">{eyebrow}</div>
      <h1 className="max-w-4xl font-display text-4xl leading-[1.05] tracking-tight text-balance md:text-6xl">
        {title}
      </h1>
      {subtitle && <p className="mt-5 max-w-2xl text-lg text-ink-muted leading-relaxed">{subtitle}</p>}
    </div>
  </section>
);
