import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOfficesStore } from '@/store/offices';
import type { SpaceStatus, SpaceType } from '@/shared/types';
import { cn } from '@/shared/utils';
import { OfficeCard } from '@/shared/components/marketing/OfficeCard';
import { EmptyState } from '@/shared/components/ui';
import { PageHero, CTASection } from '@/shared/components/marketing/sections';

const TYPE_FILTERS: { value: SpaceType | 'all'; key: string }[] = [
  { value: 'all', key: 'platform.offices.typeAll' },
  { value: 'private-office', key: 'platform.offices.typePrivate' },
  { value: 'open-plan', key: 'platform.offices.typeOpen' },
  { value: 'suite', key: 'platform.offices.typeSuite' },
  { value: 'coworking', key: 'platform.offices.typeCoworking' },
];

const STATUS_FILTERS: { value: SpaceStatus | 'all'; key: string }[] = [
  { value: 'all', key: 'platform.offices.statusAny' },
  { value: 'available', key: 'dashboard.status.space.available' },
  { value: 'reserved', key: 'dashboard.status.space.reserved' },
  { value: 'occupied', key: 'dashboard.status.space.occupied' },
];

const SORTS = [
  { value: 'featured', key: 'platform.offices.sortFeatured' },
  { value: 'price-asc', key: 'platform.offices.sortPriceAsc' },
  { value: 'price-desc', key: 'platform.offices.sortPriceDesc' },
  { value: 'area-desc', key: 'platform.offices.sortAreaDesc' },
] as const;

export const OfficesPage = () => {
  const { t } = useTranslation();
  const offices = useOfficesStore((s) => s.items);
  const [type, setType] = useState<SpaceType | 'all'>('all');
  const [status, setStatus] = useState<SpaceStatus | 'all'>('all');
  const [sort, setSort] = useState<(typeof SORTS)[number]['value']>('featured');

  const filtered = useMemo(() => {
    const list = offices.filter(
      (o) => (type === 'all' || o.type === type) && (status === 'all' || o.status === status),
    );
    const price = (v: number | null) => (v === null ? Number.MAX_SAFE_INTEGER : v);
    return [...list].sort((a, b) => {
      switch (sort) {
        case 'price-asc': return price(a.monthlyPrice) - price(b.monthlyPrice);
        case 'price-desc': return price(b.monthlyPrice) - price(a.monthlyPrice);
        case 'area-desc': return b.area - a.area;
        default: return Number(b.featured) - Number(a.featured);
      }
    });
  }, [offices, type, status, sort]);

  return (
    <>
      <PageHero
        eyebrow={t('platform.offices.eyebrow')}
        title={t('platform.offices.title')}
        subtitle={t('platform.offices.subtitle')}
      />

      <section className="container-page py-10">
        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setType(f.value)}
                className={cn(
                  'border px-3 py-1.5 text-sm transition-colors',
                  type === f.value ? 'border-accent bg-accent text-accent-ink' : 'border-line-strong text-ink-muted hover:bg-surface-2',
                )}
              >
                {t(f.key)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select value={status} onChange={(e) => setStatus(e.target.value as SpaceStatus | 'all')} className="w-auto">
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{t(f.key)}</option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="w-auto">
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{t(s.key)}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-6 text-sm text-ink-muted">
          {filtered.length === 1 ? t('platform.offices.countOne', { count: filtered.length }) : t('platform.offices.countMany', { count: filtered.length })}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState icon="SearchX" title={t('platform.offices.emptyTitle')} description={t('platform.offices.emptyDesc')} />
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((o) => (
              <OfficeCard key={o.id} office={o} to={`/offices/${o.id}`} />
            ))}
          </div>
        )}
      </section>

      <CTASection title={t('platform.offices.ctaTitle')} subtitle={t('platform.offices.ctaSubtitle')} />
    </>
  );
};
