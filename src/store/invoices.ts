import { create } from 'zustand';
import type { Invoice, InvoiceStatus } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { seedInvoices } from '@/data/seed';

const KEY = 'bc.invoices';

interface InvoicesState {
  items: Invoice[];
  setStatus: (id: string, status: InvoiceStatus) => void;
}

export const useInvoicesStore = create<InvoicesState>((set) => ({
  items: readPersisted<Invoice[]>(KEY, seedInvoices),
  setStatus: (id, status) =>
    set((s) => {
      const next = s.items.map((i) => (i.id === id ? { ...i, status } : i));
      writePersisted(KEY, next);
      return { items: next };
    }),
}));

/** Sum of an invoice's line items. */
export const invoiceTotal = (invoice: Invoice): number =>
  invoice.lines.reduce((sum, line) => sum + line.amount, 0);
