import type { CategoryId } from './types';
import type { Filters, SortKey } from './catalog';

export const PER_PAGE = 12;
const SORTS: SortKey[] = ['featured', 'newest', 'price-asc', 'price-desc', 'rating'];
const CATS: CategoryId[] = ['home', 'stationery', 'apparel', 'tech', 'pets', 'other'];

export interface BrowseState {
  filters: Filters;
  sort: SortKey;
  page: number;
}

type Params = { get(name: string): string | null };

const num = (v: string | null) => {
  if (v === null || v.trim() === '') return undefined;
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};
const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);

/** Lê o estado da listagem a partir da URL (valores inválidos são ignorados). Preços na URL ficam em unidades (ex.: 50 = R$ 50). */
export function parseBrowse(p: Params): BrowseState {
  const cat = p.get('cat') as CategoryId | null;
  const sort = p.get('sort') as SortKey | null;
  const min = num(p.get('min'));
  const max = num(p.get('max'));
  const rating = num(p.get('rating'));
  const colors = list(p.get('color'));
  const sizes = list(p.get('size'));
  const q = p.get('q')?.trim();
  const niche = p.get('niche');
  return {
    filters: {
      ...(q ? { query: q } : {}),
      ...(cat && CATS.includes(cat) ? { categoryId: cat } : {}),
      ...(niche ? { nicheId: niche } : {}),
      ...(min !== undefined ? { minPrice: Math.round(min * 100) } : {}),
      ...(max !== undefined ? { maxPrice: Math.round(max * 100) } : {}),
      ...(colors.length ? { colors } : {}),
      ...(sizes.length ? { sizes } : {}),
      ...(rating ? { minRating: rating } : {}),
    },
    sort: sort && SORTS.includes(sort) ? sort : 'featured',
    page: Math.max(1, Math.floor(num(p.get('page')) ?? 1)),
  };
}

/** Inverso de parseBrowse: gera a query string (sem valores padrão). */
export function serializeBrowse(s: BrowseState): string {
  const p = new URLSearchParams();
  const f = s.filters;
  if (f.query) p.set('q', f.query);
  if (f.categoryId) p.set('cat', f.categoryId);
  if (f.nicheId) p.set('niche', f.nicheId);
  if (f.minPrice !== undefined) p.set('min', String(f.minPrice / 100));
  if (f.maxPrice !== undefined) p.set('max', String(f.maxPrice / 100));
  if (f.colors?.length) p.set('color', f.colors.join(','));
  if (f.sizes?.length) p.set('size', f.sizes.join(','));
  if (f.minRating) p.set('rating', String(f.minRating));
  if (s.sort !== 'featured') p.set('sort', s.sort);
  if (s.page > 1) p.set('page', String(s.page));
  return p.toString();
}

export function activeFilterCount(f: Filters, fixed: { categoryId?: CategoryId; nicheId?: string } = {}): number {
  let n = 0;
  if (f.categoryId && !fixed.categoryId) n++;
  if (f.nicheId && !fixed.nicheId) n++;
  if (f.minPrice !== undefined || f.maxPrice !== undefined) n++;
  n += f.colors?.length ?? 0;
  n += f.sizes?.length ?? 0;
  if (f.minRating) n++;
  return n;
}
