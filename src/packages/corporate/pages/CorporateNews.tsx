import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useNewsStore } from '@/store/news';
import { formatDay, pickLocale } from '@/shared/utils';
import { Photo } from '@/shared/components/ui';
import { PageHero } from '@/shared/components/marketing/sections';

export const CorporateNews = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const news = useNewsStore((s) => s.items);
  const published = [...news].filter((n) => n.isPublished).sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  const [lead, ...rest] = published;

  return (
    <>
      <PageHero eyebrow={t('nav.news')} title={t('corporate.news.title')} subtitle={t('corporate.news.subtitle')} />

      <section className="container-page py-12">
        {lead && (
          <Link to={`/corporate/news/${lead.slug}`} className="group grid items-center gap-8 border-b border-line pb-12 lg:grid-cols-2">
            <Photo name={lead.photo} alt={pickLocale(lead.title, lang)} className="aspect-[16/10]" imgClassName="transition-transform duration-500 group-hover:scale-105" />
            <div>
              <div className="flex items-center gap-3 text-xs text-ink-subtle">
                <span className="badge-accent">{pickLocale(lead.tag, lang)}</span><span>{formatDay(lead.publishedAt)}</span>
              </div>
              <h2 className="mt-4 font-display text-3xl leading-tight group-hover:underline md:text-4xl">{pickLocale(lead.title, lang)}</h2>
              <p className="mt-4 text-ink-muted leading-relaxed">{pickLocale(lead.excerpt, lang)}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">{t('common.readArticle')} <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Link>
        )}

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((n) => (
            <Link key={n.id} to={`/corporate/news/${n.slug}`} className="group flex flex-col">
              <Photo name={n.photo} alt={pickLocale(n.title, lang)} className="aspect-[16/10]" imgClassName="transition-transform duration-500 group-hover:scale-105" />
              <div className="mt-4 flex items-center gap-3 text-xs text-ink-subtle"><span className="badge-neutral">{pickLocale(n.tag, lang)}</span><span>{formatDay(n.publishedAt)}</span></div>
              <h3 className="mt-2 font-display text-xl leading-snug group-hover:underline">{pickLocale(n.title, lang)}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{pickLocale(n.excerpt, lang)}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};
