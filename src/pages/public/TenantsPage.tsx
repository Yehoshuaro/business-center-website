import { ExternalLink } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useTenantsStore } from '@/features/tenants/store';
import { PageHeader, EmptyState } from '@/shared/components/ui';

export const TenantsPage = () => {
  const { t } = useT();
  const tenants = useTenantsStore((s) => s.items).filter((tn) => tn.isPublished);

  // Group by floor for a directory feel
  const byFloor = tenants.reduce<Record<number, typeof tenants>>((acc, tn) => {
    (acc[tn.floor] ??= []).push(tn);
    return acc;
  }, {});
  const floors = Object.keys(byFloor).map(Number).sort((a, b) => b - a);

  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow={t('nav.tenants')}
        title={t('tenants.title')}
        subtitle={t('tenants.subtitle')}
      />

      {tenants.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="border border-line">
          {floors.map((floor, fi) => (
            <div key={floor} className={fi > 0 ? 'border-t border-line' : ''}>
              <div className="bg-surface-2 px-4 sm:px-5 md:px-8 py-3 flex items-center justify-between">
                <span className="eyebrow">
                  {t('common.floor')} {floor}
                </span>
                <span className="text-xs text-ink-muted">{byFloor[floor].length}</span>
              </div>
              <div className="divide-y divide-line">
                {byFloor[floor].map((tn) => (
                  <div
                    key={tn.id}
                    className="grid md:grid-cols-12 gap-3 md:gap-4 px-4 sm:px-5 md:px-8 py-4 sm:py-5 items-start hover:bg-surface-2 transition-colors"
                  >
                    <div className="md:col-span-3 min-w-0">
                      <div className="font-display text-base sm:text-lg tracking-tight break-words">{tn.companyName}</div>
                      <div className="text-xs text-ink-muted mt-1 break-words">{tn.category}</div>
                    </div>
                    <div className="md:col-span-2 text-sm flex md:block items-baseline gap-2">
                      <div className="text-ink-muted text-xs uppercase tracking-wider md:mb-1">
                        {t('common.floor')}
                      </div>
                      <span className="break-words">{tn.floor} · {tn.officeNumber}</span>
                    </div>
                    <div className="md:col-span-5 text-sm text-ink-muted leading-relaxed break-words">
                      {tn.description}
                    </div>
                    <div className="md:col-span-2 text-sm">
                      {tn.website && (
                        <a
                          href={tn.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 link-underline break-all"
                        >
                          {t('tenants.website')} <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
