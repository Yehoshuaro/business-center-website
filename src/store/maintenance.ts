import { create } from 'zustand';
import type { MaintenanceRequest, MaintenanceStatus, MaintenanceUpdate } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { seedMaintenance } from '@/data/seed';
import { uid } from '@/shared/utils';

const KEY = 'bc.maintenance';

let refCounter = 1043;

interface MaintenanceState {
  items: MaintenanceRequest[];
  create: (data: Omit<MaintenanceRequest, 'id' | 'ref' | 'createdAt' | 'status' | 'updates'>) => MaintenanceRequest;
  setStatus: (id: string, status: MaintenanceStatus) => void;
  addUpdate: (id: string, author: string, text: string) => void;
  remove: (id: string) => void;
}

export const useMaintenanceStore = create<MaintenanceState>((set) => ({
  items: readPersisted<MaintenanceRequest[]>(KEY, seedMaintenance),
  create: (data) => {
    const request: MaintenanceRequest = {
      id: uid(),
      ref: `MR-${refCounter++}`,
      createdAt: new Date().toISOString(),
      status: 'open',
      updates: [],
      ...data,
    };
    set((s) => {
      const next = [request, ...s.items];
      writePersisted(KEY, next);
      return { items: next };
    });
    return request;
  },
  setStatus: (id, status) =>
    set((s) => {
      const next = s.items.map((r) => (r.id === id ? { ...r, status } : r));
      writePersisted(KEY, next);
      return { items: next };
    }),
  addUpdate: (id, author, text) =>
    set((s) => {
      const update: MaintenanceUpdate = { id: uid(), author, text, createdAt: new Date().toISOString() };
      const next = s.items.map((r) => (r.id === id ? { ...r, updates: [...r.updates, update] } : r));
      writePersisted(KEY, next);
      return { items: next };
    }),
  remove: (id) =>
    set((s) => {
      const next = s.items.filter((r) => r.id !== id);
      writePersisted(KEY, next);
      return { items: next };
    }),
}));
