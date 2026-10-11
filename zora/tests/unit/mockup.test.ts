import { describe, expect, it } from 'vitest';
import { productTypes, products } from '@/data/products';
import { buildMockupModel, fitBox, isDark, shade } from '@/domain/mockup';

const get = (slug: string) => ({ type: productTypes.find((t) => t.id === slug)!, product: products.find((p) => p.slug === slug)! });

describe('mockup: modelo', () => {
  it('toda a lista 4.1 tem tipo com mockup definido', () => {
    expect(productTypes.length).toBeGreaterThanOrEqual(34);
    for (const t of productTypes) {
      const p = products.find((x) => x.typeId === t.id)!;
      const m = buildMockupModel(t, p);
      expect(m.aspect).toBeGreaterThan(0.2);
      expect(m.aspect).toBeLessThan(4);
    }
  });
  it('tamanho muda a proporção (pôster 21×30 → 60×90 → 30×40)', () => {
    const { type, product } = get('poster');
    expect(buildMockupModel(type, product, { size: '21x30' }).aspect).toBeCloseTo(0.7, 2);
    expect(buildMockupModel(type, product, { size: '60x90' }).aspect).toBeCloseTo(0.667, 2);
    expect(buildMockupModel(type, product, { size: '30x40' }).aspect).toBeCloseTo(0.75, 2);
  });
  it('tamanho maior ocupa mais da cena', () => {
    const { type, product } = get('rug');
    const small = buildMockupModel(type, product, { size: '60x90' }).scale;
    const big = buildMockupModel(type, product, { size: '120x180' }).scale;
    expect(big).toBeGreaterThan(small);
    expect(big).toBeLessThanOrEqual(1);
  });
  it('cor do produto e moldura vêm das variações', () => {
    const tee = get('tshirt');
    expect(buildMockupModel(tee.type, tee.product, { color: 'navy' }).bodyColor).toBe('#26355D');
    const frame = get('decor-frame');
    expect(buildMockupModel(frame.type, frame.product, { frame: 'walnut' }).frameColor).toBe('#6B4A33');
  });
  it('seleção inválida volta ao padrão sem quebrar', () => {
    const { type, product } = get('mug');
    expect(() => buildMockupModel(type, product, { color: 'xxx', size: 'yyy' })).not.toThrow();
  });
  it('utilitários de cor e caixa', () => {
    expect(fitBox(2, 400, 400)).toEqual({ w: 400, h: 200 });
    expect(fitBox(0.5, 400, 400)).toEqual({ w: 200, h: 400 });
    expect(shade('#808080', -0.5)).toBe('#404040');
    expect(isDark('#26355D')).toBe(true);
    expect(isDark('#FBF6EE')).toBe(false);
  });
});
