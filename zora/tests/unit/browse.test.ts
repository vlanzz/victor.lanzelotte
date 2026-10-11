import { describe, expect, it } from 'vitest';
import { activeFilterCount, parseBrowse, serializeBrowse } from '@/domain/browse';

const p = (q: string) => parseBrowse(new URLSearchParams(q));

describe('estado da listagem na URL', () => {
  it('lê e escreve filtros de ida e volta', () => {
    const qs = 'q=caneca&cat=home&min=20&max=80.5&color=navy,black&size=m&rating=4&sort=price-asc&page=2';
    const s = p(qs);
    expect(s.filters).toMatchObject({ query: 'caneca', categoryId: 'home', minPrice: 2000, maxPrice: 8050, colors: ['navy', 'black'], sizes: ['m'], minRating: 4 });
    expect(s.sort).toBe('price-asc');
    expect(s.page).toBe(2);
    expect(p(serializeBrowse(s))).toEqual(s);
  });
  it('ignora valores inválidos', () => {
    const s = p('cat=xxx&sort=banana&min=abc&page=-3&max=-1');
    expect(s.filters).toEqual({});
    expect(s.sort).toBe('featured');
    expect(s.page).toBe(1);
  });
  it('não escreve valores padrão e conta filtros ativos', () => {
    expect(serializeBrowse({ filters: {}, sort: 'featured', page: 1 })).toBe('');
    expect(activeFilterCount({ colors: ['a', 'b'], minPrice: 100, minRating: 4 })).toBe(4);
    expect(activeFilterCount({ categoryId: 'home' }, { categoryId: 'home' })).toBe(0);
  });
});
