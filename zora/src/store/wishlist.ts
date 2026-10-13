import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import { persistOptions } from './persist';

const schema = z.object({ ids: z.array(z.string()) });

interface WishlistState {
  ids: string[];
  toggle: (id: string) => boolean;
  has: (id: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const adding = !get().ids.includes(id);
        set((s) => ({ ids: adding ? [...s.ids, id] : s.ids.filter((x) => x !== id) }));
        return adding;
      },
      has: (id) => get().ids.includes(id),
    }),
    persistOptions<WishlistState, z.infer<typeof schema>>('wishlist', schema, (s) => ({ ids: s.ids })),
  ),
);
