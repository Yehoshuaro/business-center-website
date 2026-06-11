import { create } from 'zustand';
import type { Lead, LeadComment, LeadStatus } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { seedLeads } from '@/data/seed';
import { uid } from '@/shared/utils';

const KEY = 'bc.leads';

interface LeadsState {
  items: Lead[];
  create: (data: Omit<Lead, 'id' | 'createdAt' | 'comments' | 'status'> & { status?: LeadStatus }) => Lead;
  update: (id: string, data: Partial<Lead>) => void;
  remove: (id: string) => void;
  setStatus: (id: string, status: LeadStatus) => void;
  addComment: (id: string, author: string, text: string) => void;
  getById: (id: string) => Lead | undefined;
}

export const useLeadsStore = create<LeadsState>((set, get) => ({
  items: readPersisted<Lead[]>(KEY, seedLeads),
  create: (data) => {
    const lead: Lead = {
      id: uid(),
      createdAt: new Date().toISOString(),
      comments: [],
      status: data.status ?? 'new',
      ...data,
    };
    set((s) => {
      const next = [lead, ...s.items];
      writePersisted(KEY, next);
      return { items: next };
    });
    return lead;
  },
  update: (id, data) => {
    set((s) => {
      const next = s.items.map((l) => (l.id === id ? { ...l, ...data } : l));
      writePersisted(KEY, next);
      return { items: next };
    });
  },
  remove: (id) => {
    set((s) => {
      const next = s.items.filter((l) => l.id !== id);
      writePersisted(KEY, next);
      return { items: next };
    });
  },
  setStatus: (id, status) => {
    set((s) => {
      const next = s.items.map((l) => (l.id === id ? { ...l, status } : l));
      writePersisted(KEY, next);
      return { items: next };
    });
  },
  addComment: (id, author, text) => {
    set((s) => {
      const comment: LeadComment = {
        id: uid(),
        author,
        text,
        createdAt: new Date().toISOString(),
      };
      const next = s.items.map((l) =>
        l.id === id ? { ...l, comments: [...l.comments, comment] } : l
      );
      writePersisted(KEY, next);
      return { items: next };
    });
  },
  getById: (id) => get().items.find((l) => l.id === id),
}));
