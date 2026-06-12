import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useNewsStore } from '@/store/news';
import { formatDay, pickLocale } from '@/shared/utils';
import { Photo, Avatar } from '@/shared/components/ui';

export const NewsDetailPage = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { slug } = useParams();
  const news = useNewsStore((s) => s.items);
  const article = news.find((n) => n.slug === slug && n.isPublished);

  if (!article) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl">{t('platform.news.title')}</h1>
        <Link to="/news" className="btn-primary mt-6">{t('common.viewAllNews')}</Link>
      </div>
    );
  }

  const more = news.filter((n) => n.isPublished && n.id !== article.id).slice(0, 2);

  return (
    <article>
      <div className="container-page pt-8">
        <Link to="/news" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> {t('common.viewAllNews')}
        </Link>
      </div>

      <header className="container-page max-w-3xl py-8 text-center">
        <div className="flex items-center justify-center gap-3 text-xs text-ink-subtle">
          <span className="badge-accent">{pickLocale(article.tag, lang)}</span>
          <span>{formatDay(article.publishedAt)}</span>
        </div>
        <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight text-balance md:text-5xl">{pickLocale(article.title, lang)}</h1>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-muted">
          <Avatar name={article.author} className="h-7 w-7 text-[10px]" /> {article.author}
        </div>
      </header>

      <div className="container-page max-w-4xl">
        <Photo name={article.photo} alt={pickLocale(article.title, lang)} className="aspect-[16/9] ring-soft" />
      </div>

      <div className="container-page max-w-2xl py-10">
        <p className="font-display text-xl leading-relaxed text-ink">{pickLocale(article.excerpt, lang)}</p>
        <div className="mt-6 space-y-5 text-ink-muted leading-relaxed">
          {article.body.map((p, i) => (
            <p key={i}>{pickLocale(p, lang)}</p>
          ))}
        </div>
      </div>

      {more.length > 0 && (
        <section className="border-t border-line bg-surface-2">
          <div className="container-page py-14">
            <h2 className="font-display text-2xl">{t('platform.home.newsTitle')}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {more.map((n) => (
                <Link key={n.id} to={`/news/${n.slug}`} className="group flex gap-4">
                  <Photo name={n.photo} alt={pickLocale(n.title, lang)} className="aspect-square w-28 shrink-0" />
                  <div>
                    <div className="text-xs text-ink-subtle">{formatDay(n.publishedAt)}</div>
                    <h3 className="mt-1 font-display text-lg leading-snug group-hover:underline">{pickLocale(n.title, lang)}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};
