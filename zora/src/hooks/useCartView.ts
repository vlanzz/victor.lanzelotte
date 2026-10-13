'use client';
import { useMemo } from 'react';
import type { ShippingMethod } from '@/config/shipping';
import { validateCoupon } from '@/domain/coupons';
import { cartTotals, priceLines } from '@/domain/orders';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { useCart } from '@/store/cart';
import { useMoney } from './useMoney';

/** Carrinho "resolvido": linhas com preço, cupom validado na moeda atual e totais. */
export function useCartView(method: ShippingMethod = 'standard') {
  const lines = useCart((s) => s.lines);
  const couponCode = useCart((s) => s.couponCode);
  const { byId, coupons } = useCatalog();
  const { currency } = useMoney();
  return useMemo(() => {
    const priced = priceLines(lines, byId, currency);
    const base = cartTotals(priced, currency, null, method);
    const result = couponCode ? validateCoupon(couponCode, coupons, { subtotal: base.subtotal, currency }) : null;
    const coupon = result?.ok ? result.coupon : null;
    return { priced, coupon, couponError: result && !result.ok ? result : null, couponCode, totals: cartTotals(priced, currency, coupon, method), currency };
  }, [lines, couponCode, byId, coupons, currency, method]);
}
