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
}

export const useNewsStore = create<NewsState>((set) => ({
  items: readPersisted<NewsArticle[]>(KEY, seedNews),
  create: (data) => {
    const article: NewsArticle = { id: uid(), ...data };
    set((s) => {
      const next = [article, ...s.items];
      writePersisted(KEY, next);
      return { items: next };
    });
    return article;
  },
  update: (id, data) =>
    set((s) => {
      const next = s.items.map((n) => (n.id === id ? { ...n, ...data } : n));
      writePersisted(KEY, next);
      return { items: next };
    }),
  remove: (id) =>
    set((s) => {
      const next = s.items.filter((n) => n.id !== id);
      writePersisted(KEY, next);
      return { items: next };
    }),
}));
