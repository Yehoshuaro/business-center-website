import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryImage } from '@/shared/types';
import { useGalleryStore } from '@/store/gallery';
import { cn, pickLocale } from '@/shared/utils';
import { Photo } from '@/shared/components/ui';
import { PageHero, CTASection } from '@/shared/components/marketing/sections';

const CATEGORIES: { value: GalleryImage['category'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'interiors', label: 'Interiors' },
  { value: 'amenities', label: 'Amenities' },
  { value: 'events', label: 'Events' },
];

export const GalleryPage = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const images = useGalleryStore((s) => s.items);
  const [cat, setCat] = useState<GalleryImage['category'] | 'all'>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const visible = useMemo(
    () => (cat === 'all' ? images : images.filter((i) => i.category === cat)),
    [images, cat],
  );

  const step = (dir: number) =>
    setLightbox((i) => (i === null ? null : (i + dir + visible.length) % visible.length));

  return (
    <>
      <PageHero
        eyebrow={t('platform.gallery.eyebrow')}
        title={t('platform.gallery.title')}
        subtitle={t('platform.gallery.subtitle')}
      />

      <section className="container-page py-10">
        <div className="flex flex-wrap gap-2 border-b border-line pb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={cn(
                'border px-3 py-1.5 text-sm transition-colors',
                cat === c.value ? 'border-accent bg-accent text-accent-ink' : 'border-line-strong text-ink-muted hover:bg-surface-2',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setLightbox(idx)}
              className={cn(
                'group relative overflow-hidden text-left',
                idx % 6 === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square',
              )}
            >
              <Photo name={img.photo} alt={pickLocale(img.title, lang)} className="h-full w-full" imgClassName="transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="font-display text-sm text-white">{pickLocale(img.title, lang)}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {lightbox !== null && visible[lightbox] && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink/90 p-4" role="dialog" aria-modal="true">
          <div className="flex justify-end">
            <button onClick={() => setLightbox(null)} className="p-2 text-white/80 hover:text-white" aria-label="Close">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center gap-3 overflow-hidden">
            <button onClick={() => step(-1)} className="hidden p-2 text-white/70 hover:text-white sm:block" aria-label="Previous">
              <ChevronLeft className="h-8 w-8" />
            </button>
            <figure className="flex max-h-full max-w-4xl flex-col">
              <Photo name={visible[lightbox].photo} alt={pickLocale(visible[lightbox].title, lang)} className="max-h-[70vh] w-full" imgClassName="object-contain" />
              <figcaption className="mt-4 text-center text-white">
                <div className="font-display text-lg">{pickLocale(visible[lightbox].title, lang)}</div>
                <div className="text-sm text-white/70">{pickLocale(visible[lightbox].caption, lang)}</div>
              </figcaption>
            </figure>
            <button onClick={() => step(1)} className="hidden p-2 text-white/70 hover:text-white sm:block" aria-label="Next">
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}

      <CTASection title={t('platform.gallery.ctaTitle')} subtitle={t('platform.gallery.ctaSubtitle')} />
    </>
  );
};
