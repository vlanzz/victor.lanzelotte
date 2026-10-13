'use client';
import { useEffect } from 'react';
import { useCart } from '@/store/cart';
import { useHydration } from '@/store/hydration';
import { usePreferences } from '@/store/preferences';
import { useSession } from '@/store/session';
import { useWishlist } from '@/store/wishlist';

/** Lê os dados persistidos depois da primeira renderização (mantém servidor e cliente iguais). */
export function StoreHydrator() {
  useEffect(() => {
    void Promise.all([useCart.persist.rehydrate(), useWishlist.persist.rehydrate(), usePreferences.persist.rehydrate(), useSession.getState().refresh()]).then(() =>
      useHydration.setState({ done: true }),
    );
  }, []);
  return null;
}
