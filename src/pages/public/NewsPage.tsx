import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useNewsStore } from '@/store/news';
import { formatDay } from '@/shared/utils';
import { Photo } from '@/shared/components/ui';
import { PageHero } from '@/shared/components/marketing/sections';

export const NewsPage = () => {
  const news = useNewsStore((s) => s.items);
  const published = [...news]
    .filter((n) => n.isPublished)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  const [lead, ...rest] = published;

  return (
    <>
      <PageHero eyebrow="News" title="What's happening at Meridian" subtitle="Announcements, resident stories and events from the business center." />

      <section className="container-page py-12">
        {lead && (
          <Link to={`/news/${lead.slug}`} className="group grid items-center gap-8 border-b border-line pb-12 lg:grid-cols-2">
            <Photo name={lead.photo} alt={lead.title} className="aspect-[16/10]" imgClassName="transition-transform duration-500 group-hover:scale-105" />
            <div>
              <div className="flex items-center gap-3 text-xs text-ink-subtle">
                <span className="badge-accent">{lead.tag}</span>
                <span>{formatDay(lead.publishedAt)}</span>
              </div>
              <h2 className="mt-4 font-display text-3xl leading-tight group-hover:underline md:text-4xl">{lead.title}</h2>
              <p className="mt-4 text-ink-muted leading-relaxed">{lead.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
                Read article <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        )}

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((n) => (
            <Link key={n.id} to={`/news/${n.slug}`} className="group flex flex-col">
              <Photo name={n.photo} alt={n.title} className="aspect-[16/10]" imgClassName="transition-transform duration-500 group-hover:scale-105" />
              <div className="mt-4 flex items-center gap-3 text-xs text-ink-subtle">
                <span className="badge-neutral">{n.tag}</span>
                <span>{formatDay(n.publishedAt)}</span>
              </div>
              <h3 className="mt-2 font-display text-xl leading-snug group-hover:underline">{n.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{n.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};
