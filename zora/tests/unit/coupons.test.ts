import { describe, expect, it } from 'vitest';
import { coupons } from '@/data/coupons';
import { validateCoupon } from '@/domain/coupons';

const ctx = { subtotal: 15000, currency: 'BRL' as const, now: new Date('2026-10-10') };

describe('cupons', () => {
  it('aceita código válido, ignorando caixa e espaços', () => {
    const r = validateCoupon('  bemvindo10 ', coupons, ctx);
    expect(r.ok).toBe(true);
  });
  it.each([
    ['', 'empty'],
    ['XXXX', 'not_found'],
    ['PAUSADO', 'inactive'],
    ['NATAL25', 'expired'],
    ['ULTIMAS', 'exhausted'],
    ['WELCOME5', 'wrong_currency'],
  ])('recusa %s com motivo %s', (code, reason) => {
    const r = validateCoupon(code, coupons, ctx);
    expect(r).toMatchObject({ ok: false, reason });
  });
  it('exige subtotal mínimo e informa o valor', () => {
    expect(validateCoupon('ZORA20', coupons, { ...ctx, subtotal: 5000 })).toEqual({ ok: false, reason: 'min_subtotal', min: 10000 });
    expect(validateCoupon('ZORA20', coupons, ctx).ok).toBe(true);
  });
});
