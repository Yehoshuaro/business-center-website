import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { PhotoImg } from '@/shared/components/ui/PhotoImg';
import { useNewsStore } from '@/features/news/store';
import { PageHeader, EmptyState } from '@/shared/components/ui';
import { formatDate } from '@/shared/utils';

export const NewsPage = () => {
  const { t, language } = useT();
  const items = useNewsStore((s) => s.items).filter((n) => n.isPublished);
  const locale = ({ kk: 'kk-KZ', ru: 'ru-RU', en: 'en-US' } as const)[language];

  return (
    <div className="container-page py-12 md:py-16">
      <PageHeader
        eyebrow={t('nav.news')}
        title={t('news.title')}
        subtitle={t('news.subtitle')}
      />

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-px bg-line border border-line sm:grid-cols-2 lg:grid-cols-3">
          {items.map((n) => (
            <Link
              key={n.id}
              to={`/site/news/${n.slug}`}
              className="bg-surface flex flex-col hover:bg-surface-2 transition-colors group"
            >
              <div className="aspect-[16/10] overflow-hidden bg-surface-2 border-b border-line">
                <PhotoImg
                  src={n.cover}
                  fallback={n.coverFallback}
                  alt={n.title[language] || n.title.ru}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3 text-[11px] uppercase tracking-[0.18em] text-ink-muted flex-wrap">
                  <span>{n.tag}</span>
                  <span className="w-1 h-1 rounded-full bg-line-strong" />
                  <span>{formatDate(n.publishedAt, locale)}</span>
                </div>
                <div className="font-display text-xl sm:text-2xl tracking-tight leading-snug mb-3 text-balance">
                  {n.title[language] || n.title.ru}
                </div>
                <p className="text-sm text-ink-muted leading-relaxed flex-1">
                  {n.excerpt[language] || n.excerpt.ru}
                </p>
                <div className="mt-5 inline-flex items-center gap-1 text-sm text-ink group-hover:text-accent transition-colors">
                  {t('common.details')} <ArrowUpRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
