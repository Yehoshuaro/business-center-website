import { useMemo } from 'react';
import { useT } from '@/features/i18n/store';
import { useCrmStore, DEAL_STAGES } from '@/features/crm/store';
import { PageHeader, MetricCard } from '@/shared/components/ui';
import { formatDate } from '@/shared/utils';

const LOCALE: Record<string, string> = { kk: 'kk-KZ', ru: 'ru-RU', en: 'en-GB' };

const fmtMoney = (n: number, locale: string) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n) + ' ₸';

export const CrmDashboardPage = () => {
  const { t, language } = useT();
  const deals = useCrmStore((s) => s.deals);
  const tasks = useCrmStore((s) => s.tasks);
  const activity = useCrmStore((s) => s.activity);
  const locale = LOCALE[language] ?? 'ru-RU';

  const stats = useMemo(() => {
    const open = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');
    const pipeline = open.reduce((sum, d) => sum + d.amount, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const wonMonth = deals
      .filter((d) => d.stage === 'won' && new Date(d.updatedAt) >= monthStart)
      .reduce((sum, d) => sum + d.amount, 0);

    const closed = deals.filter((d) => d.stage === 'won' || d.stage === 'lost');
    const conversion = closed.length
      ? Math.round((deals.filter((d) => d.stage === 'won').length / closed.length) * 100)
      : 0;

    const openTasks = tasks.filter((tk) => tk.status !== 'done').length;
    return { pipeline, wonMonth, conversion, openTasks };
  }, [deals, tasks]);

  const byStage = useMemo(
    () => DEAL_STAGES.map((stage) => ({ stage, count: deals.filter((d) => d.stage === stage).length })),
    [deals],
  );
  const maxCount = Math.max(1, ...byStage.map((s) => s.count));

  // Synthetic-but-stable monthly revenue series derived from won deals plus a base curve
  const revenue = useMemo(() => {
    const months: { label: string; value: number }[] = [];
    const base = [9.4, 11.2, 10.1, 12.8, 13.5, 12.2];
    const wonTotal = deals.filter((d) => d.stage === 'won').reduce((s, d) => s + d.amount, 0) / 1_000_000;
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = new Intl.DateTimeFormat(locale, { month: 'short' }).format(d);
      const idx = 5 - i;
      const value = Math.round((base[idx] + (idx === 5 ? wonTotal : 0)) * 10) / 10;
      months.push({ label, value });
    }
    return months;
  }, [deals, locale]);
  const maxRevenue = Math.max(1, ...revenue.map((m) => m.value));

  return (
    <>
      <PageHeader title={t('crm.nav.dashboard')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <MetricCard label={t('crm.kpi.pipeline')} value={fmtMoney(stats.pipeline, locale)} />
        <MetricCard label={t('crm.kpi.wonMonth')} value={fmtMoney(stats.wonMonth, locale)} />
        <MetricCard label={t('crm.kpi.conversion')} value={`${stats.conversion}%`} />
        <MetricCard label={t('crm.kpi.activeTasks')} value={stats.openTasks} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Deals by stage */}
        <div className="card p-5 sm:p-6">
          <div className="eyebrow mb-5">{t('crm.chart.byStage')}</div>
          <div className="space-y-3">
            {byStage.map(({ stage, count }) => (
              <div key={stage} className="flex items-center gap-3">
                <div className="w-28 sm:w-32 shrink-0 text-xs text-ink-muted truncate">
                  {t(`crm.stage.${stage}`)}
                </div>
                <div className="flex-1 h-6 bg-surface-2 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-500"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <div className="w-6 text-right text-sm font-medium tabular-nums">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly revenue */}
        <div className="card p-5 sm:p-6">
          <div className="eyebrow mb-5">{t('crm.chart.revenue')}</div>
          <svg viewBox="0 0 360 180" className="w-full h-auto" role="img" aria-label={t('crm.chart.revenue')}>
            {revenue.map((m, i) => {
              const barW = 36;
              const gap = (360 - revenue.length * barW) / (revenue.length + 1);
              const x = gap + i * (barW + gap);
              const h = (m.value / maxRevenue) * 130;
              const y = 150 - h;
              return (
                <g key={m.label + i}>
                  <rect x={x} y={y} width={barW} height={h} className="fill-accent" opacity={0.9} />
                  <text x={x + barW / 2} y={y - 6} textAnchor="middle" className="fill-ink" fontSize="11">
                    {m.value}
                  </text>
                  <text x={x + barW / 2} y={168} textAnchor="middle" className="fill-ink-muted" fontSize="10">
                    {m.label}
                  </text>
                </g>
              );
            })}
            <line x1="0" y1="150" x2="360" y2="150" className="stroke-line" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Recent activity */}
      <div className="card p-5 sm:p-6">
        <div className="eyebrow mb-4">{t('crm.recentActivity')}</div>
        <ul className="divide-y divide-line">
          {activity.slice(0, 8).map((a) => (
            <li key={a.id} className="py-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <span className="text-xs text-ink-muted shrink-0 sm:w-36 tabular-nums">
                {formatDate(a.createdAt, locale)}
              </span>
              <span className="text-sm leading-relaxed">{a.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
