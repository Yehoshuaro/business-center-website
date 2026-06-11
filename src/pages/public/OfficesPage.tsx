import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useOfficesStore } from '@/features/offices/store';
import { OfficeStatusBadge, PageHeader, EmptyState } from '@/shared/components/ui';
import type { OfficeStatus, OfficeType } from '@/shared/types';
import { formatNumber, formatPrice } from '@/shared/utils';

export const OfficesPage = () => {
  const { t, language } = useT();
  const offices = useOfficesStore((s) => s.items);

  const [areaFrom, setAreaFrom] = useState('');
  const [areaTo, setAreaTo] = useState('');
  const [floor, setFloor] = useState('');
  const [status, setStatus] = useState<'all' | OfficeStatus>('all');
  const [type, setType] = useState<'all' | OfficeType>('all');

  const localeMap = { kk: 'kk-KZ', ru: 'ru-RU', en: 'en-US' } as const;
  const locale = localeMap[language];

  const filtered = useMemo(() => {
    return offices.filter((o) => {
      if (areaFrom && o.area < Number(areaFrom)) return false;
      if (areaTo && o.area > Number(areaTo)) return false;
      if (floor && o.floor !== Number(floor)) return false;
      if (status !== 'all' && o.status !== status) return false;
      if (type !== 'all' && o.type !== type) return false;
      return true;
    });
  }, [offices, areaFrom, areaTo, floor, status, type]);

  const reset = () => {
    setAreaFrom('');
    setAreaTo('');
    setFloor('');
    setStatus('all');
    setType('all');
  };

  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow={t('nav.offices')}
        title={t('offices.title')}
        subtitle={t('offices.subtitle')}
      />

      {/* Filters */}
      <div className="card p-4 md:p-5 mb-6 sm:mb-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="field-label">{t('offices.filter.areaFrom')}</label>
            <input type="number" min={0} value={areaFrom} onChange={(e) => setAreaFrom(e.target.value)} />
          </div>
          <div>
            <label className="field-label">{t('offices.filter.areaTo')}</label>
            <input type="number" min={0} value={areaTo} onChange={(e) => setAreaTo(e.target.value)} />
          </div>
          <div>
            <label className="field-label">{t('offices.filter.floor')}</label>
            <input type="number" min={1} value={floor} onChange={(e) => setFloor(e.target.value)} />
          </div>
          <div>
            <label className="field-label">{t('offices.filter.status')}</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as 'all' | OfficeStatus)}>
              <option value="all">{t('common.all')}</option>
              <option value="available">{t('status.available')}</option>
              <option value="reserved">{t('status.reserved')}</option>
              <option value="occupied">{t('status.occupied')}</option>
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="field-label">{t('offices.filter.type')}</label>
            <select value={type} onChange={(e) => setType(e.target.value as 'all' | OfficeType)}>
              <option value="all">{t('common.all')}</option>
              <option value="openSpace">{t('officeType.openSpace')}</option>
              <option value="cabinet">{t('officeType.cabinet')}</option>
              <option value="block">{t('officeType.block')}</option>
              <option value="mixed">{t('officeType.mixed')}</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm gap-3">
          <span className="text-ink-muted">{filtered.length} / {offices.length}</span>
          <button type="button" onClick={reset} className="text-ink-muted hover:text-ink underline underline-offset-4">
            {t('common.reset')}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState description={t('offices.empty')} />
      ) : (
        <div className="grid gap-px bg-line border border-line sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((office) => (
            <Link
              key={office.id}
              to={`/site/offices/${office.id}`}
              className="bg-surface p-5 sm:p-6 hover:bg-surface-2 transition-colors group flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <span className="text-xs uppercase tracking-wider text-ink-muted">
                  {t('common.floor')} {office.floor}
                </span>
                <OfficeStatusBadge status={office.status} />
              </div>
              <div className="font-display text-xl sm:text-2xl tracking-tight mb-2 break-words">{office.title}</div>
              <div className="text-sm text-ink-muted mb-4">
                {formatNumber(office.area)} м² · {t(`officeType.${office.type}`)}
              </div>
              <p className="text-sm text-ink-muted line-clamp-2 leading-relaxed mb-4 flex-1">
                {office.description}
              </p>
              <div className="hairline mb-4" />
              <div className="flex items-end justify-between gap-2">
                <span className="text-sm font-medium break-words">
                  {office.price !== null ? formatPrice(office.price, locale) : t('common.priceOnRequest')}
                </span>
                <ArrowUpRight size={16} className="text-ink-muted group-hover:text-accent transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
