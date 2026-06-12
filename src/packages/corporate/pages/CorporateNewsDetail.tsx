import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useNewsStore } from '@/store/news';
import { formatDay, pickLocale } from '@/shared/utils';
import { Photo, Avatar } from '@/shared/components/ui';

export const CorporateNewsDetail = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { slug } = useParams();
  const news = useNewsStore((s) => s.items);
  const article = news.find((n) => n.slug === slug && n.isPublished);

  if (!article) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl">404</h1>
        <Link to="/corporate/news" className="btn-primary mt-6">{t('nav.news')}</Link>
      </div>
    );
  }

  return (
    <article>
      <div className="container-page pt-8">
        <Link to="/corporate/news" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> {t('nav.news')}
        </Link>
      </div>
      <header className="container-page max-w-3xl py-8 text-center">
        <div className="flex items-center justify-center gap-3 text-xs text-ink-subtle">
          <span className="badge-accent">{pickLocale(article.tag, lang)}</span><span>{formatDay(article.publishedAt)}</span>
        </div>
        <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight text-balance md:text-5xl">{pickLocale(article.title, lang)}</h1>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-muted">
          <Avatar name={article.author} className="h-7 w-7 text-[10px]" /> {article.author}
        </div>
      </header>
      <div className="container-page max-w-4xl"><Photo name={article.photo} alt={pickLocale(article.title, lang)} className="aspect-[16/9] ring-soft" /></div>
      <div className="container-page max-w-2xl py-10">
        <p className="font-display text-xl leading-relaxed text-ink">{pickLocale(article.excerpt, lang)}</p>
        <div className="mt-6 space-y-5 text-ink-muted leading-relaxed">
          {article.body.map((p, i) => <p key={i}>{pickLocale(p, lang)}</p>)}
        </div>
      </div>
    </article>
  );
};
