import { create } from 'zustand';
import type { GalleryImage } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { seedGallery } from '@/data/seed';

const KEY = 'bc.gallery';

interface GalleryState {
  items: GalleryImage[];
}

export const useGalleryStore = create<GalleryState>(() => ({
  items: readPersisted<GalleryImage[]>(KEY, seedGallery),
}));
