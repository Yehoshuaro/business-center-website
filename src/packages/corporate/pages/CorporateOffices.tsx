import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Maximize, Users, Building, Check } from 'lucide-react';
import type { Office, SpaceType } from '@/shared/types';
import { useOfficesStore } from '@/store/offices';
import { formatKzt, cn } from '@/shared/utils';
import { Photo, StatusBadge, Modal, EmptyState } from '@/shared/components/ui';
import { OfficeCard } from '@/shared/components/marketing/OfficeCard';
import { PageHero } from '@/shared/components/marketing/sections';

const TYPES: (SpaceType | 'all')[] = ['all', 'private-office', 'open-plan', 'suite', 'coworking'];

export const CorporateOffices = () => {
  const { t } = useTranslation();
  const offices = useOfficesStore((s) => s.items);
  const [type, setType] = useState<SpaceType | 'all'>('all');
  const [active, setActive] = useState<Office | null>(null);

  const filtered = useMemo(() => (type === 'all' ? offices : offices.filter((o) => o.type === type)), [offices, type]);

  return (
    <>
      <PageHero eyebrow={t('nav.officesSpaces')} title={t('corporate.offices.title')} subtitle={t('corporate.offices.subtitle')} />

      <section className="container-page py-10">
        <div className="flex flex-wrap gap-2 border-b border-line pb-6">
          {TYPES.map((tp) => (
            <button key={tp} onClick={() => setType(tp)}
              className={cn('border px-3 py-1.5 text-sm transition-colors', type === tp ? 'border-accent bg-accent text-accent-ink' : 'border-line-strong text-ink-muted hover:bg-surface-2')}>
              {tp === 'all' ? t('office.allSpaces') : t(`office.type.${tp}`)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8"><EmptyState icon="SearchX" title={t('office.allSpaces')} /></div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((o) => (
              <button key={o.id} onClick={() => setActive(o)} className="text-left transition-shadow hover:shadow-card-hover">
                <OfficeCard office={o} />
              </button>
            ))}
          </div>
        )}
      </section>

      {active && (
        <Modal open onClose={() => setActive(null)} title={active.title} description={`#${active.code} · ${t(`office.type.${active.type}`)}`} size="xl"
          footer={<Link to="/corporate/contact" className="btn-primary" onClick={() => setActive(null)}>{t('lead.submit')}</Link>}>
          <Photo name={active.photo} alt={active.title} className="aspect-[16/9]" />
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {StatusBadge.space(active.status)}
            <span className="font-display text-2xl">{formatKzt(active.monthlyPrice, t('office.onRequest'))}</span>
            {active.monthlyPrice !== null && <span className="text-sm text-ink-muted">/ {t('office.perMonth')}</span>}
          </div>
          <p className="mt-3 text-ink-muted leading-relaxed">{active.description}</p>
          <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden border border-line bg-line">
            <Fact icon={<Maximize className="h-4 w-4" />} value={active.area > 0 ? `${active.area} m²` : '—'} />
            <Fact icon={<Users className="h-4 w-4" />} value={`${active.capacity} ${t(active.capacity === 1 ? 'office.seat' : 'office.seats')}`} />
            <Fact icon={<Building className="h-4 w-4" />} value={`${t('office.level')} ${active.floor}`} />
          </div>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {active.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-ink-muted"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {f}</li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  );
};

const Fact = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
  <div className="bg-surface p-4">
    <span className="text-ink-subtle">{icon}</span>
    <div className="mt-2 font-display text-lg">{value}</div>
  </div>
);
