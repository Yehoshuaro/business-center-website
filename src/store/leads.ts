import { create } from 'zustand';
import type { Lead, LeadStatus, LeadNote } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { seedLeads } from '@/data/seed';
import { uid } from '@/shared/utils';

const KEY = 'bc.leads';

interface LeadsState {
  items: Lead[];
  create: (data: Omit<Lead, 'id' | 'createdAt' | 'notes' | 'status'>) => Lead;
  setStatus: (id: string, status: LeadStatus) => void;
  addNote: (id: string, author: string, text: string) => void;
  remove: (id: string) => void;
}

export const useLeadsStore = create<LeadsState>((set) => ({
  items: readPersisted<Lead[]>(KEY, seedLeads),
  create: (data) => {
    const lead: Lead = {
      id: uid(),
      createdAt: new Date().toISOString(),
      status: 'new',
      notes: [],
      ...data,
    };
    set((s) => {
      const next = [lead, ...s.items];
      writePersisted(KEY, next);
      return { items: next };
    });
    return lead;
  },
  setStatus: (id, status) =>
    set((s) => {
      const next = s.items.map((l) => (l.id === id ? { ...l, status } : l));
      writePersisted(KEY, next);
      return { items: next };
    }),
  addNote: (id, author, text) =>
    set((s) => {
      const note: LeadNote = { id: uid(), author, text, createdAt: new Date().toISOString() };
      const next = s.items.map((l) => (l.id === id ? { ...l, notes: [...l.notes, note] } : l));
      writePersisted(KEY, next);
      return { items: next };
    }),
  remove: (id) =>
    set((s) => {
      const next = s.items.filter((l) => l.id !== id);
      writePersisted(KEY, next);
      return { items: next };
    }),
}));
