import { create } from 'zustand';
import type { GalleryImage } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { seedGallery } from '@/data/seed';
import { uid } from '@/shared/utils';

const KEY = 'bc.gallery';

interface GalleryState {
  items: GalleryImage[];
  create: (data: Omit<GalleryImage, 'id'>) => GalleryImage;
  update: (id: string, data: Partial<GalleryImage>) => void;
  remove: (id: string) => void;
  reorder: (id: string, direction: 'up' | 'down') => void;
  getById: (id: string) => GalleryImage | undefined;
}

const sortByOrder = (a: GalleryImage, b: GalleryImage) => a.order - b.order;

export const useGalleryStore = create<GalleryState>((set, get) => ({
  items: readPersisted<GalleryImage[]>(KEY, seedGallery).sort(sortByOrder),
  create: (data) => {
    const item: GalleryImage = { id: uid(), ...data };
    set((s) => {
      const next = [...s.items, item].sort(sortByOrder);
      writePersisted(KEY, next);
      return { items: next };
    });
    return item;
  },
  update: (id, data) => {
    set((s) => {
      const next = s.items
        .map((i) => (i.id === id ? { ...i, ...data } : i))
        .sort(sortByOrder);
      writePersisted(KEY, next);
      return { items: next };
    });
  },
  remove: (id) => {
    set((s) => {
      const next = s.items.filter((i) => i.id !== id);
      writePersisted(KEY, next);
      return { items: next };
    });
  },
  reorder: (id, direction) => {
    set((s) => {
      const sorted = [...s.items].sort(sortByOrder);
      const idx = sorted.findIndex((i) => i.id === id);
      if (idx === -1) return s;
      const swapWith = direction === 'up' ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= sorted.length) return s;
      const a = sorted[idx];
      const b = sorted[swapWith];
      const next = sorted.map((it) => {
        if (it.id === a.id) return { ...it, order: b.order };
        if (it.id === b.id) return { ...it, order: a.order };
        return it;
      }).sort(sortByOrder);
      writePersisted(KEY, next);
      return { items: next };
    });
  },
  getById: (id) => get().items.find((i) => i.id === id),
}));
