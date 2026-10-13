import { describe, expect, it } from 'vitest';
import { coupons } from '@/data/coupons';
import { buildEntries } from '@/domain/catalog';
import { cartTotals, luhn, priceLines, toOrderLines, validExpiry } from '@/domain/orders';
import { seedSnapshot } from '@/services/mock/catalog';

const entries = buildEntries(seedSnapshot);
const byId = (id: string) => entries.find((e) => e.item.id === id);

describe('pedido', () => {
  const first = entries[0]!;
  const lines = [{ id: 'x', catalogItemId: first.item.id, selection: {}, qty: 2 }, { id: 'y', catalogItemId: 'nao-existe', selection: {}, qty: 1 }];
  it('ignora itens que saíram do catálogo e precifica na moeda', () => {
    const p = priceLines(lines, byId, 'USD');
    expect(p).toHaveLength(1);
    expect(p[0]!.unitPrice).toBeGreaterThan(0);
  });
  it('totais batem com as linhas do pedido (snapshot)', () => {
    const p = priceLines(lines, byId, 'BRL');
    const t = cartTotals(p, 'BRL', coupons.find((c) => c.code === 'BEMVINDO10')!);
    const ol = toOrderLines(p);
    expect(ol.reduce((s, l) => s + l.unitPrice * l.qty, 0)).toBe(t.subtotal);
    expect(t.total).toBe(t.subtotal - t.discount + t.shipping);
    expect(ol[0]!.optionsLabel.pt.length).toBeGreaterThan(0);
  });
  it('luhn e validade do cartão', () => {
    expect(luhn('4242 4242 4242 4242')).toBe(true);
    expect(luhn('4242 4242 4242 4243')).toBe(false);
    expect(luhn('123')).toBe(false);
    expect(validExpiry('12/99')).toBe(true);
    expect(validExpiry('01/20')).toBe(false);
    expect(validExpiry('13/30')).toBe(false);
    expect(validExpiry('abc')).toBe(false);
  });
});
