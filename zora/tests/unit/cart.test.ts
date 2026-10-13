import { describe, expect, it } from 'vitest';
import { addLine, changeSelection, computeTotals, lineId, MAX_QTY, removeLine, setQty } from '@/domain/cart';
import type { CartLine, Coupon } from '@/domain/types';

const sel = { color: 'white', size: '325' };
const base = (): CartLine[] => addLine([], { catalogItemId: 'a', selection: sel, qty: 1 });

describe('carrinho', () => {
  it('soma quantidade de linhas idênticas', () => {
    const l = addLine(base(), { catalogItemId: 'a', selection: { size: '325', color: 'white' }, qty: 2 });
    expect(l).toHaveLength(1);
    expect(l[0]?.qty).toBe(3);
  });
  it('variações diferentes viram linhas diferentes', () => {
    expect(addLine(base(), { catalogItemId: 'a', selection: { ...sel, size: '450' }, qty: 1 })).toHaveLength(2);
  });
  it('limita a quantidade e remove com 0', () => {
    expect(setQty(base(), lineId('a', sel), 999)[0]?.qty).toBe(MAX_QTY);
    expect(setQty(base(), lineId('a', sel), 0)).toHaveLength(0);
    expect(setQty(base(), lineId('a', sel), Number.NaN)).toHaveLength(0);
  });
  it('trocar variação funde com linha existente', () => {
    let l = addLine(base(), { catalogItemId: 'a', selection: { ...sel, size: '450' }, qty: 2 });
    l = changeSelection(l, lineId('a', sel), { ...sel, size: '450' });
    expect(l).toHaveLength(1);
    expect(l[0]?.qty).toBe(3);
  });
  it('remove linha', () => {
    expect(removeLine(base(), lineId('a', sel))).toEqual([]);
  });
});

describe('totais', () => {
  const lines = [{ unitPrice: 6990, qty: 2 }, { unitPrice: 2990, qty: 1 }]; // 16970
  const pct: Coupon = { code: 'P', type: 'percent', value: 10, description: { pt: '', en: '' }, uses: 0, active: true };
  const fixed: Coupon = { ...pct, code: 'F', type: 'fixed', value: 2000 };
  const free: Coupon = { ...pct, code: 'S', type: 'freeShipping', value: 0 };

  it('sem cupom: subtotal + frete padrão', () => {
    expect(computeTotals(lines, { currency: 'BRL' })).toMatchObject({ subtotal: 16970, discount: 0, shipping: 1990, total: 18960 });
  });
  it('percentual arredonda para baixo', () => {
    expect(computeTotals(lines, { currency: 'BRL', coupon: pct }).discount).toBe(1697);
  });
  it('valor fixo não passa do subtotal', () => {
    expect(computeTotals([{ unitPrice: 1000, qty: 1 }], { currency: 'BRL', coupon: fixed }).discount).toBe(1000);
  });
  it('cupom de frete grátis zera o frete', () => {
    const t = computeTotals(lines, { currency: 'BRL', coupon: free });
    expect(t.shipping).toBe(0);
    expect(t.freeShippingApplied).toBe(true);
  });
  it('frete padrão grátis acima do limite; expresso não', () => {
    expect(computeTotals([{ unitPrice: 30000, qty: 1 }], { currency: 'BRL' }).shipping).toBe(0);
    expect(computeTotals([{ unitPrice: 30000, qty: 1 }], { currency: 'BRL', method: 'express' }).shipping).toBe(3490);
  });
  it('carrinho vazio não cobra frete', () => {
    expect(computeTotals([], { currency: 'USD' })).toMatchObject({ subtotal: 0, shipping: 0, total: 0 });
  });
});
