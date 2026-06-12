import { create } from 'zustand';
import type { MeetingRoom } from '@/shared/types';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { seedMeetingRooms } from '@/data/seed';

const KEY = 'bc.rooms';

interface MeetingRoomsState {
  items: MeetingRoom[];
}

export const useMeetingRoomsStore = create<MeetingRoomsState>(() => ({
  items: readPersisted<MeetingRoom[]>(KEY, seedMeetingRooms),
}));
