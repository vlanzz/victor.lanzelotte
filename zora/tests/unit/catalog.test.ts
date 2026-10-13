import { describe, expect, it } from 'vitest';
import { categories } from '@/data/categories';
import { seedSnapshot } from '@/services/mock/catalog';
import { buildEntries, filterEntries, normalizeText, paginate, ratingStats, sortEntries } from '@/domain/catalog';

const entries = buildEntries(seedSnapshot);
const ctx = { currency: 'BRL' as const, niches: seedSnapshot.niches };

describe('dados fictícios (requisitos do briefing)', () => {
  it('há ao menos 1 tipo de produto por item da lista 4.1 (34 tipos)', () => {
    expect(seedSnapshot.types.length).toBeGreaterThanOrEqual(34);
    for (const c of categories) expect(seedSnapshot.types.some((t) => t.categoryId === c.id)).toBe(true);
  });
  it('há ao menos 3 artes por nicho', () => {
    for (const n of seedSnapshot.niches) {
      expect(seedSnapshot.arts.filter((a) => a.nicheIds.includes(n.id)).length).toBeGreaterThanOrEqual(3);
    }
  });
  it('há dezenas de itens de catálogo e todo tipo aparece no catálogo', () => {
    expect(entries.length).toBeGreaterThan(100);
    for (const t of seedSnapshot.types) expect(entries.some((e) => e.type.id === t.id)).toBe(true);
  });
  it('ids e slugs são únicos', () => {
    const slugs = entries.map((e) => e.item.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it('todo texto existe em PT e EN', () => {
    for (const e of entries) {
      expect(e.name.pt && e.name.en).toBeTruthy();
      expect(e.product.description.pt && e.product.description.en).toBeTruthy();
    }
  });
});

describe('busca, filtros e ordenação', () => {
  it('busca ignora acentos e caixa, em PT e EN', () => {
    expect(normalizeText('Pôster Café')).toBe('poster cafe');
    expect(filterEntries(entries, { query: 'caneca' }, ctx).length).toBeGreaterThan(0);
    expect(filterEntries(entries, { query: 'MUG' }, ctx).length).toBeGreaterThan(0);
    expect(filterEntries(entries, { query: 'zzzz' }, ctx)).toHaveLength(0);
  });
  it('filtra por categoria e nicho', () => {
    const r = filterEntries(entries, { categoryId: 'pets', nicheId: 'pets' }, ctx);
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((e) => e.categoryId === 'pets' && e.nicheIds.includes('pets'))).toBe(true);
  });
  it('filtra por faixa de preço, cor e tamanho', () => {
    expect(filterEntries(entries, { maxPrice: 3000 }, ctx).every((e) => e.product.priceBRL <= 3500)).toBe(true);
    expect(filterEntries(entries, { colors: ['mustard'] }, ctx).every((e) => e.type.id === 'tshirt')).toBe(true);
    expect(filterEntries(entries, { sizes: ['60x90'] }, ctx).length).toBeGreaterThan(0);
  });
  it('ordena por preço', () => {
    const asc = sortEntries(entries, 'price-asc', 'BRL');
    expect(asc[0]!.product.priceBRL).toBeLessThanOrEqual(asc[asc.length - 1]!.product.priceBRL);
  });
  it('pagina e protege contra página inválida', () => {
    const p = paginate(entries, 999, 12);
    expect(p.page).toBe(p.pages);
    expect(paginate([], 1, 12)).toMatchObject({ pages: 1, total: 0 });
  });
});

describe('avaliações', () => {
  it('média e distribuição só contam publicadas', () => {
    const mk = (rating: 1 | 2 | 3 | 4 | 5, status: 'published' | 'hidden') => ({
      id: String(Math.random()), catalogItemId: 'x', author: 'a', rating, title: { pt: '', en: '' }, body: { pt: '', en: '' }, createdAt: '', status,
    });
    const s = ratingStats([mk(5, 'published'), mk(4, 'published'), mk(1, 'hidden')]);
    expect(s).toMatchObject({ average: 4.5, count: 2 });
    expect(s.distribution[5]).toBe(1);
  });
});
