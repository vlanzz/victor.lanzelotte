import { describe, expect, it } from 'vitest';
import { products } from '@/data/products';
import { fromPrice, resolveSelection, unitPrice } from '@/domain/pricing';
import { selectionLabel } from '@/domain/options';

const mug = products.find((p) => p.slug === 'mug')!;

describe('pricing & variações', () => {
  it('preço = base + acréscimos das opções', () => {
    expect(unitPrice(mug, {}, 'BRL')).toBe(6990);
    expect(unitPrice(mug, { size: '450', color: 'black' }, 'BRL')).toBe(6990 + 1500 + 500);
  });
  it('valores inválidos caem no padrão', () => {
    expect(resolveSelection(mug, { color: 'nope', size: '450' })).toEqual({ color: 'white', size: '450' });
  });
  it('USD usa conversão fixa quando não há preço manual', () => {
    expect(unitPrice(mug, {}, 'USD')).toBe(1270);
    const manual = { ...mug, priceUSD: 1499 };
    expect(unitPrice(manual, {}, 'USD')).toBe(1499);
  });
  it('"a partir de" é o menor preço possível', () => {
    expect(fromPrice(mug, 'BRL')).toBe(6990);
  });
  it('rótulo da variação nos dois idiomas', () => {
    expect(selectionLabel(mug, { color: 'navy', size: '450' })).toEqual({ pt: 'Azul-marinho · 450 ml', en: 'Navy · 450 ml' });
  });
});
