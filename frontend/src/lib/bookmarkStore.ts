import { create } from 'zustand';
import api from './api';

interface BookmarkState {
  bookmarkIds: number[];
  count: number;
  fetchBookmarks: () => Promise<void>;
  toggleBookmark: (vacancyId: number) => Promise<boolean>;
  isBookmarked: (vacancyId: number) => boolean;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarkIds: [],
  count: 0,

  fetchBookmarks: async () => {
    try {
      const { data } = await api.get('/bookmarks');
      const ids = data.map((v: any) => v.id);
      set({ bookmarkIds: ids, count: ids.length });
    } catch (err) {
      console.error('Failed to fetch bookmarks', err);
    }
  },

  toggleBookmark: async (vacancyId: number) => {
    const currentIds = get().bookmarkIds;
    const isCurrentlyBookmarked = currentIds.includes(vacancyId);
    
    // Optimistic Update
    const newIds = isCurrentlyBookmarked 
      ? currentIds.filter(id => id !== vacancyId)
      : [...currentIds, vacancyId];
    
    set({ bookmarkIds: newIds, count: newIds.length });

    try {
      const { data } = await api.post('/bookmarks/toggle', { vacancy_id: vacancyId });
      // Ensure state is synced with server response just in case
      const serverBookmarked = data.is_bookmarked;
      if (serverBookmarked !== !isCurrentlyBookmarked) {
        // If server response differs from our optimistic guess, sync it
        const syncedIds = serverBookmarked 
          ? (currentIds.includes(vacancyId) ? currentIds : [...currentIds, vacancyId])
          : currentIds.filter(id => id !== vacancyId);
        set({ bookmarkIds: syncedIds, count: syncedIds.length });
      }
      return serverBookmarked;
    } catch (err) {
      // Rollback on error
      set({ bookmarkIds: currentIds, count: currentIds.length });
      console.error('Failed to toggle bookmark', err);
      throw err;
    }
  },

  isBookmarked: (vacancyId: number) => {
    return get().bookmarkIds.includes(vacancyId);
  },
}));
