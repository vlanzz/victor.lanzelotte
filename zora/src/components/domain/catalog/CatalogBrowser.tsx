'use client';
import { SearchX, SlidersHorizontal, TriangleAlert, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { categories } from '@/data/categories';
import { activeFilterCount, PER_PAGE, parseBrowse, serializeBrowse, type BrowseState } from '@/domain/browse';
import { filterEntries, paginate, searchEntries, sortEntries, type Filters, type SortKey } from '@/domain/catalog';
import type { CategoryId } from '@/domain/types';
import { useL10n } from '@/hooks/useL10n';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useMoney } from '@/hooks/useMoney';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { ProgressiveList } from '@/components/ui/ProgressiveList';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { ProductCard } from '../product/ProductCard';
import { FilterPanel } from './FilterPanel';

interface Props {
  fixed?: { categoryId?: CategoryId; nicheId?: string };
}

/** Listagem com filtros, ordenação e paginação. O estado vive na URL (compartilhável e com botão voltar). */
export function CatalogBrowser({ fixed = {} }: Props) {
  const t = useTranslations('browse');
  const tc = useTranslations('common');
  const l = useL10n();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { entries, snapshot, error, refresh } = useCatalog();
  const { currency } = useMoney();
  const [drawer, setDrawer] = useState(false);
  const desktop = useMediaQuery('(min-width: 1024px)');

  const state = useMemo<BrowseState>(() => {
    const s = parseBrowse(params);
    return { ...s, filters: { ...s.filters, ...fixed } };
  }, [params, fixed]);

  const push = (next: BrowseState) => {
    // a rota já define o escopo fixo: não repetir na URL
    const f = { ...next.filters };
    if (fixed.categoryId) delete f.categoryId;
    if (fixed.nicheId) delete f.nicheId;
    const qs = serializeBrowse({ ...next, filters: f });
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const setFilters = (filters: Filters) => push({ ...state, filters: { ...filters, ...fixed }, page: 1 });

  const { scope, sorted, pageData } = useMemo(() => {
    const { colors: _c, sizes: _s, minPrice: _a, maxPrice: _b, minRating: _r, ...base } = state.filters;
    void _c; void _s; void _a; void _b; void _r;
    const scope = filterEntries(entries, base, { currency, niches: snapshot.niches });
    const list = filterEntries(entries, state.filters, { currency, niches: snapshot.niches });
    const sorted = state.filters.query && state.sort === 'featured' ? list : sortEntries(list, state.sort, currency);
    return { scope, sorted, pageData: paginate(sorted, state.page, PER_PAGE) };
  }, [entries, state, currency, snapshot.niches]);

  void searchEntries;
  const valueLabel = (kind: 'color' | 'size', id: string) => {
    for (const e of entries) for (const a of e.product.options) {
      const v = a.kind === kind ? a.values.find((x) => x.id === id) : undefined;
      if (v) return l(v.label);
    }
    return id;
  };
  const count = activeFilterCount(state.filters, fixed);
  const f = state.filters;
  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (f.categoryId && !fixed.categoryId) chips.push({ key: 'cat', label: l(categories.find((c) => c.id === f.categoryId)?.name ?? { pt: '', en: '' }), remove: () => { const { categoryId: _x, ...r } = f; void _x; setFilters(r); } });
  if (f.nicheId && !fixed.nicheId) chips.push({ key: 'niche', label: l(snapshot.niches.find((n) => n.id === f.nicheId)?.name ?? { pt: '', en: '' }), remove: () => { const { nicheId: _x, ...r } = f; void _x; setFilters(r); } });
  if (f.minPrice !== undefined || f.maxPrice !== undefined) chips.push({ key: 'price', label: `${f.minPrice !== undefined ? f.minPrice / 100 : 0} – ${f.maxPrice !== undefined ? f.maxPrice / 100 : '∞'} ${currency}`, remove: () => { const { minPrice: _a, maxPrice: _b, ...r } = f; void _a; void _b; setFilters(r); } });
  for (const c of f.colors ?? []) chips.push({ key: `c-${c}`, label: valueLabel('color', c), remove: () => setFilters({ ...f, colors: (f.colors ?? []).filter((x) => x !== c) }) });
  for (const s of f.sizes ?? []) chips.push({ key: `s-${s}`, label: valueLabel('size', s), remove: () => setFilters({ ...f, sizes: (f.sizes ?? []).filter((x) => x !== s) }) });
  if (f.minRating) chips.push({ key: 'rating', label: t('filter.ratingUp', { n: f.minRating }), remove: () => { const { minRating: _x, ...r } = f; void _x; setFilters(r); } });

  const clearAll = () => setFilters(f.query ? { query: f.query } : {});

  if (error) {
    return <EmptyState tone="error" icon={<TriangleAlert aria-hidden size={30} />} title={t('error.title')} text={t('error.text')} action={<Button onClick={() => void refresh()}>{tc('retry')}</Button>} />;
  }

  const panel = <FilterPanel filters={state.filters} onChange={setFilters} scope={scope} fixed={fixed} />;

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
      <aside className="hidden lg:block" aria-label={t('filters')}>
        <div className="sticky top-32 max-h-[calc(100dvh-9rem)] overflow-y-auto pr-3">{desktop ? panel : null}</div>
      </aside>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-sm font-semibold text-ink-soft">{t('results', { count: pageData.total })}</p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setDrawer(true)}>
              <SlidersHorizontal aria-hidden size={16} />{t('filters')}{count > 0 && ` (${count})`}
            </Button>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <span className="sr-only sm:not-sr-only">{t('sort.label')}</span>
              <select value={state.sort} onChange={(e) => push({ ...state, sort: e.target.value as SortKey, page: 1 })} className="min-h-10 rounded-full border-2 border-line bg-white px-3 text-sm focus:border-lavender-text focus:outline-none">
                {(['featured', 'newest', 'priceAsc', 'priceDesc', 'rating'] as const).map((k) => (
                  <option key={k} value={{ priceAsc: 'price-asc', priceDesc: 'price-desc' }[k as string] ?? k}>{t(`sort.${k}`)}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {chips.length > 0 && (
          <ul aria-label={t('activeFilters')} className="mb-5 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <li key={c.key}>
                <button type="button" onClick={c.remove} aria-label={t('removeFilter', { name: c.label })} className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-honey-soft px-3 text-sm font-semibold hover:bg-honey">
                  {c.label}<X aria-hidden size={14} />
                </button>
              </li>
            ))}
            <li><button type="button" onClick={clearAll} className="text-sm font-semibold text-sun-dark underline underline-offset-4">{t('clearAll')}</button></li>
          </ul>
        )}

        <h2 className="sr-only">{t('allProducts')}</h2>
        {pageData.total === 0 ? (
          <EmptyState icon={<SearchX aria-hidden size={30} />} title={t('empty.title')} text={f.query ? t('empty.withQuery', { q: f.query }) : t('empty.text')} action={count > 0 || f.query ? <Button onClick={clearAll}>{t('clearAll')}</Button> : undefined} />
        ) : (
          <>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
              <ProgressiveList key={`${pageData.page}-${state.sort}-${pageData.total}`} items={pageData.items} render={(e, i) => <li key={e.item.id}><ProductCard entry={e} priority={i < 4} /></li>} />
            </ul>
            <div className="mt-12">
              <Pagination page={pageData.page} pages={pageData.pages} onChange={(p) => { push({ ...state, page: p }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} labels={{ nav: t('pagination.nav'), prev: t('pagination.prev'), next: t('pagination.next'), page: (n) => t('pagination.page', { n }) }} />
            </div>
          </>
        )}
      </div>

      <Modal open={drawer} onClose={() => setDrawer(false)} title={t('filters')} closeLabel={tc('close')} variant="sheet">
        {panel}
        <div className="sticky bottom-0 -mx-5 mt-2 flex gap-2 border-t border-line bg-paper px-5 py-3">
          <Button variant="secondary" className="flex-1" onClick={clearAll}>{t('clearAll')}</Button>
          <Button className="flex-1" onClick={() => setDrawer(false)}>{t('showResults', { count: pageData.total })}</Button>
        </div>
      </Modal>
    </div>
  );
}
