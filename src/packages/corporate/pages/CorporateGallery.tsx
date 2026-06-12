import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GalleryImage } from '@/shared/types';
import { useGalleryStore } from '@/store/gallery';
import { cn, pickLocale } from '@/shared/utils';
import { Photo, Modal } from '@/shared/components/ui';
import { PageHero } from '@/shared/components/marketing/sections';

const CATEGORIES: (GalleryImage['category'] | 'all')[] = ['all', 'architecture', 'interiors', 'amenities', 'events'];
const CAT_LABEL: Record<string, string> = {
  all: 'All', architecture: 'Architecture', interiors: 'Interiors', amenities: 'Amenities', events: 'Events',
};

export const CorporateGallery = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const images = useGalleryStore((s) => s.items);
  const [cat, setCat] = useState<GalleryImage['category'] | 'all'>('all');
  const [active, setActive] = useState<GalleryImage | null>(null);

  const visible = useMemo(() => (cat === 'all' ? images : images.filter((i) => i.category === cat)), [images, cat]);

  return (
    <>
      <PageHero eyebrow={t('nav.gallery')} title={t('corporate.gallery.title')} subtitle={t('corporate.gallery.subtitle')} />

      <section className="container-page py-10">
        <div className="flex flex-wrap gap-2 border-b border-line pb-6">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={cn('border px-3 py-1.5 text-sm transition-colors', cat === c ? 'border-accent bg-accent text-accent-ink' : 'border-line-strong text-ink-muted hover:bg-surface-2')}>
              {CAT_LABEL[c]}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((img) => (
            <button key={img.id} onClick={() => setActive(img)} className="group relative overflow-hidden">
              <Photo name={img.photo} alt={pickLocale(img.title, lang)} className="aspect-square" imgClassName="transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="font-display text-sm text-white">{pickLocale(img.title, lang)}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {active && (
        <Modal open onClose={() => setActive(null)} title={pickLocale(active.title, lang)} description={pickLocale(active.caption, lang)} size="xl">
          <Photo name={active.photo} alt={pickLocale(active.title, lang)} className="aspect-[16/10]" imgClassName="object-contain" />
        </Modal>
      )}
    </>
  );
};
