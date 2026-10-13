import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import { addLine, changeSelection, removeLine, setQty } from '@/domain/cart';
import type { CartLine, Selection } from '@/domain/types';
import { persistOptions } from './persist';

const schema = z.object({
  lines: z.array(z.object({ id: z.string(), catalogItemId: z.string(), selection: z.record(z.string(), z.string()), qty: z.number().int().min(1).max(99) })),
  couponCode: z.string().nullable(),
});

interface CartState {
  lines: CartLine[];
  couponCode: string | null;
  add: (catalogItemId: string, selection: Selection, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  changeSelection: (id: string, selection: Selection) => void;
  remove: (id: string) => void;
  setCoupon: (code: string | null) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      couponCode: null,
      add: (catalogItemId, selection, qty = 1) => set((s) => ({ lines: addLine(s.lines, { catalogItemId, selection, qty }) })),
      setQty: (id, qty) => set((s) => ({ lines: setQty(s.lines, id, qty) })),
      changeSelection: (id, sel) => set((s) => ({ lines: changeSelection(s.lines, id, sel) })),
      remove: (id) => set((s) => ({ lines: removeLine(s.lines, id) })),
      setCoupon: (couponCode) => set({ couponCode }),
      clear: () => set({ lines: [], couponCode: null }),
    }),
    persistOptions<CartState, z.infer<typeof schema>>('cart', schema, (s) => ({ lines: s.lines, couponCode: s.couponCode })),
  ),
);
