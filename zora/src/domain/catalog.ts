import { fromPrice } from './pricing';
import type {
  Art, CatalogItem, CategoryId, Cents, Currency, L10n, Locale, Niche, Product, ProductType, Review,
} from './types';

export interface CatalogSnapshot {
  types: ProductType[];
  products: Product[];
  arts: Art[];
  items: CatalogItem[];
  reviews: Review[];
  niches: Niche[];
}

/** Item de catálogo já "resolvido" (com arte, produto, tipo e avaliação). */
export interface CatalogEntry {
  item: CatalogItem;
  art: Art;
  product: Product;
  type: ProductType;
  name: L10n;
  categoryId: CategoryId;
  nicheIds: string[];
  rating: number;
  reviewCount: number;
}

export const entryName = (art: Art, product: Product): L10n => ({
  pt: `${product.name.pt} · ${art.title.pt}`,
  en: `${product.name.en} · ${art.title.en}`,
});

export function ratingStats(reviews: Review[]) {
  const pub = reviews.filter((r) => r.status === 'published');
  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of pub) distribution[r.rating]++;
  const avg = pub.length ? pub.reduce((s, r) => s + r.rating, 0) / pub.length : 0;
  return { average: Math.round(avg * 10) / 10, count: pub.length, distribution };
}

/** Monta as entradas ativas. Itens sem arte/produto/tipo (ou rascunhos) ficam de fora. */
export function buildEntries(s: CatalogSnapshot): CatalogEntry[] {
  const arts = new Map(s.arts.map((a) => [a.id, a]));
  const products = new Map(s.products.map((p) => [p.id, p]));
  const types = new Map(s.types.map((t) => [t.id, t]));
  const byItem = new Map<string, Review[]>();
  for (const r of s.reviews) byItem.set(r.catalogItemId, [...(byItem.get(r.catalogItemId) ?? []), r]);

  const out: CatalogEntry[] = [];
  for (const item of s.items) {
    const art = arts.get(item.artId);
    const product = products.get(item.productId);
    const type = product && types.get(product.typeId);
    if (!art || !product || !type) continue;
    if (item.status !== 'active' || art.status !== 'active' || product.status !== 'active') continue;
    const stats = ratingStats(byItem.get(item.id) ?? []);
    out.push({
      item, art, product, type,
      name: entryName(art, product),
      categoryId: type.categoryId,
      nicheIds: art.nicheIds,
      rating: stats.average,
      reviewCount: stats.count,
    });
  }
  return out;
}

/* ---------- Busca ---------- */

export const normalizeText = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export function searchEntries(
  entries: CatalogEntry[],
  query: string,
  niches: Niche[],
): CatalogEntry[] {
  const tokens = normalizeText(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return entries;
  const nicheName = new Map(niches.map((n) => [n.id, `${n.name.pt} ${n.name.en}`]));
  const scored: { e: CatalogEntry; score: number }[] = [];
  for (const e of entries) {
    const primary = normalizeText(`${e.name.pt} ${e.name.en}`);
    const secondary = normalizeText(
      `${e.product.tags.join(' ')} ${e.nicheIds.map((n) => nicheName.get(n) ?? '').join(' ')} ${e.categoryId}`,
    );
    let score = 0;
    let all = true;
    for (const t of tokens) {
      if (primary.includes(t)) score += 3;
      else if (secondary.includes(t)) score += 1;
      else { all = false; break; }
    }
    if (all) scored.push({ e, score: score + e.rating * 0.1 });
  }
  return scored.sort((a, b) => b.score - a.score).map((x) => x.e);
}

/* ---------- Filtros, ordenação e paginação ---------- */

export interface Filters {
  categoryId?: CategoryId;
  nicheId?: string;
  query?: string;
  minPrice?: Cents;
  maxPrice?: Cents;
  /** ids de valores de opção de cor */
  colors?: string[];
  /** ids de valores de opção de tamanho */
  sizes?: string[];
  minRating?: number;
}

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

const hasValue = (e: CatalogEntry, kind: 'color' | 'size', ids: string[]) =>
  e.product.options.some((o) => o.kind === kind && o.values.some((v) => ids.includes(v.id)));

export function filterEntries(
  entries: CatalogEntry[],
  f: Filters,
  ctx: { currency: Currency; niches: Niche[] },
): CatalogEntry[] {
  let list = f.query ? searchEntries(entries, f.query, ctx.niches) : entries;
  list = list.filter((e) => {
    if (f.categoryId && e.categoryId !== f.categoryId) return false;
    if (f.nicheId && !e.nicheIds.includes(f.nicheId)) return false;
    if (f.minRating && e.rating < f.minRating) return false;
    if (f.colors?.length && !hasValue(e, 'color', f.colors)) return false;
    if (f.sizes?.length && !hasValue(e, 'size', f.sizes)) return false;
    const price = fromPrice(e.product, ctx.currency);
    if (f.minPrice !== undefined && price < f.minPrice) return false;
    if (f.maxPrice !== undefined && price > f.maxPrice) return false;
    return true;
  });
  return list;
}

export function sortEntries(entries: CatalogEntry[], sort: SortKey, currency: Currency): CatalogEntry[] {
  const price = (e: CatalogEntry) => fromPrice(e.product, currency);
  const arr = [...entries];
  switch (sort) {
    case 'price-asc': return arr.sort((a, b) => price(a) - price(b));
    case 'price-desc': return arr.sort((a, b) => price(b) - price(a));
    case 'rating': return arr.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'newest': return arr.sort((a, b) => b.item.createdAt.localeCompare(a.item.createdAt));
    default: return arr.sort((a, b) => Number(!!b.item.featured) - Number(!!a.item.featured)); // estável
  }
}

export function paginate<T>(list: T[], page: number, perPage: number) {
  const pages = Math.max(1, Math.ceil(list.length / perPage));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), pages);
  return { items: list.slice((current - 1) * perPage, current * perPage), page: current, pages, total: list.length };
}

export const localized = (t: L10n, locale: Locale) => t[locale];
