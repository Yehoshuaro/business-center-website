import { create } from 'zustand';
import type { NewsArticle } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { seedNews } from '@/data/seed';
import { uid } from '@/shared/utils';

const KEY = 'bc.news';

interface NewsState {
  items: NewsArticle[];
  create: (data: Omit<NewsArticle, 'id'>) => NewsArticle;
  update: (id: string, data: Partial<NewsArticle>) => void;
  remove: (id: string) => void;
  getById: (id: string) => NewsArticle | undefined;
  getBySlug: (slug: string) => NewsArticle | undefined;
}

const sortByDate = (a: NewsArticle, b: NewsArticle) =>
  +new Date(b.publishedAt) - +new Date(a.publishedAt);

export const useNewsStore = create<NewsState>((set, get) => ({
  items: readPersisted<NewsArticle[]>(KEY, seedNews).sort(sortByDate),
  create: (data) => {
    const item: NewsArticle = { id: uid(), ...data };
    set((s) => {
      const next = [item, ...s.items].sort(sortByDate);
      writePersisted(KEY, next);
      return { items: next };
    });
    return item;
  },
  update: (id, data) => {
    set((s) => {
      const next = s.items
        .map((i) => (i.id === id ? { ...i, ...data } : i))
        .sort(sortByDate);
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
  getById: (id) => get().items.find((i) => i.id === id),
  getBySlug: (slug) => get().items.find((i) => i.slug === slug),
}));
