import type { Cents, Coupon, Currency } from './types';

export type CouponError =
  | 'empty' | 'not_found' | 'inactive' | 'expired' | 'exhausted' | 'min_subtotal' | 'wrong_currency';

export type CouponResult =
  | { ok: true; coupon: Coupon }
  | { ok: false; reason: CouponError; min?: Cents };

export const normalizeCode = (code: string) => code.trim().toUpperCase();

export function validateCoupon(
  code: string,
  coupons: Coupon[],
  ctx: { subtotal: Cents; currency: Currency; now?: Date },
): CouponResult {
  const norm = normalizeCode(code);
  if (!norm) return { ok: false, reason: 'empty' };
  const coupon = coupons.find((c) => c.code === norm);
  if (!coupon) return { ok: false, reason: 'not_found' };
  if (!coupon.active) return { ok: false, reason: 'inactive' };
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < (ctx.now ?? new Date()).getTime()) {
    return { ok: false, reason: 'expired' };
  }
  if (coupon.maxUses !== undefined && coupon.uses >= coupon.maxUses) return { ok: false, reason: 'exhausted' };
  if (coupon.currency && coupon.currency !== ctx.currency) return { ok: false, reason: 'wrong_currency' };
  if (coupon.minSubtotal !== undefined && ctx.subtotal < coupon.minSubtotal) {
    return { ok: false, reason: 'min_subtotal', min: coupon.minSubtotal };
  }
  return { ok: true, coupon };
}
