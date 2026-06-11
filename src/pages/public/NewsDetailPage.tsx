import { Link, useParams, Navigate } from 'react-router-dom';
import { ChevronLeft, ArrowUpRight } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { PhotoImg } from '@/shared/components/ui/PhotoImg';
import { useNewsStore } from '@/features/news/store';
import { formatDate } from '@/shared/utils';

export const NewsDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useT();
  const article = useNewsStore((s) => s.items.find((n) => n.slug === slug && n.isPublished));
  const others = useNewsStore((s) => s.items)
    .filter((n) => n.isPublished && n.slug !== slug)
    .slice(0, 3);
  const locale = ({ kk: 'kk-KZ', ru: 'ru-RU', en: 'en-US' } as const)[language];

  if (!article) return <Navigate to="/site/news" replace />;

  return (
    <div className="container-page py-12 md:py-16">
      <Link
        to="/site/news"
        className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink mb-8"
      >
        <ChevronLeft size={16} /> {t('common.back')}
      </Link>

      <article className="max-w-3xl">
        <div className="flex items-center gap-3 mb-5 text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          <span>{article.tag}</span>
          <span className="w-1 h-1 rounded-full bg-line-strong" />
          <span>{formatDate(article.publishedAt, locale)}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-balance break-words">
          {article.title[language] || article.title.ru}
        </h1>

        <p className="mt-5 sm:mt-6 text-base sm:text-lg text-ink-muted leading-relaxed max-w-2xl">
          {article.excerpt[language] || article.excerpt.ru}
        </p>

        <div className="mt-8 sm:mt-10 aspect-[16/9] border border-line overflow-hidden bg-surface-2">
          <PhotoImg
            src={article.cover}
            fallback={article.coverFallback}
            alt={article.title[language] || article.title.ru}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-8 sm:mt-10 prose-bc">
          {(article.body[language] || article.body.ru)
            .split(/\n\s*\n/)
            .map((p, i) => (
              <p key={i} className="text-base md:text-lg leading-relaxed text-ink mb-5">
                {p}
              </p>
            ))}
        </div>
      </article>

      {others.length > 0 && (
        <section className="mt-14 sm:mt-20 border-t border-line pt-10 sm:pt-12">
          <div className="eyebrow mb-6">{t('news.more')}</div>
          <div className="grid gap-px bg-line border border-line sm:grid-cols-2 lg:grid-cols-3">
            {others.map((n) => (
              <Link
                key={n.id}
                to={`/site/news/${n.slug}`}
                className="bg-surface p-6 hover:bg-surface-2 transition-colors group"
              >
                <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted mb-3">
                  {formatDate(n.publishedAt, locale)}
                </div>
                <div className="font-display text-xl tracking-tight leading-snug mb-3">
                  {n.title[language] || n.title.ru}
                </div>
                <div className="inline-flex items-center gap-1 text-sm text-ink-muted group-hover:text-accent transition-colors">
                  {t('common.details')} <ArrowUpRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
