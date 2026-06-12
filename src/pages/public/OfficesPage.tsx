import { useMemo, useState } from 'react';
import { useOfficesStore } from '@/store/offices';
import type { SpaceStatus, SpaceType } from '@/shared/types';
import { cn } from '@/shared/utils';
import { OfficeCard } from '@/shared/components/marketing/OfficeCard';
import { EmptyState } from '@/shared/components/ui';
import { PageHero, CTASection } from '@/shared/components/marketing/sections';

const TYPE_FILTERS: { value: SpaceType | 'all'; label: string }[] = [
  { value: 'all', label: 'All spaces' },
  { value: 'private-office', label: 'Private offices' },
  { value: 'open-plan', label: 'Open-plan' },
  { value: 'suite', label: 'Suites' },
  { value: 'coworking', label: 'Coworking' },
];

const STATUS_FILTERS: { value: SpaceStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Any status' },
  { value: 'available', label: 'Available' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'occupied', label: 'Occupied' },
];

const SORTS = [
  { value: 'featured', label: 'Featured first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'area-desc', label: 'Largest first' },
] as const;

export const OfficesPage = () => {
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
        eyebrow="Offices & Spaces"
        title="Find the right space for your team"
        subtitle="From single coworking desks to full-floor suites — every space is move-in ready and backed by our on-site service team."
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
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select value={status} onChange={(e) => setStatus(e.target.value as SpaceStatus | 'all')} className="w-auto">
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="w-auto">
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-6 text-sm text-ink-muted">
          {filtered.length} {filtered.length === 1 ? 'space' : 'spaces'} available
        </p>

        {filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState icon="SearchX" title="No spaces match your filters" description="Try widening your search or get in touch — we may have something coming up." />
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((o) => (
              <OfficeCard key={o.id} office={o} to={`/offices/${o.id}`} />
            ))}
          </div>
        )}
      </section>

      <CTASection title="Not sure which space fits?" subtitle="Our leasing team will shortlist options for your team size and budget." />
    </>
  );
};
