'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { categories } from '@/data/categories';
import type { CatalogEntry, Filters } from '@/domain/catalog';
import type { CategoryId } from '@/domain/types';
import { useL10n } from '@/hooks/useL10n';
import { useMoney } from '@/hooks/useMoney';
import { Button } from '@/components/ui/Button';
import { cn } from '@/components/ui/cn';
import { Stars } from '@/components/ui/Stars';
import { useCatalog } from '@/components/providers/CatalogProvider';

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  /** entradas já filtradas por busca/escopo, usadas para listar só cores e tamanhos que existem */
  scope: CatalogEntry[];
  fixed: { categoryId?: CategoryId; nicheId?: string };
}

const toggle = (list: string[] | undefined, v: string) => {
  const cur = list ?? [];
  return cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
};

export function FilterPanel({ filters, onChange, scope, fixed }: Props) {
  const t = useTranslations('browse');
  const l = useL10n();
  const { currency } = useMoney();
  const { snapshot } = useCatalog();
  const [min, setMin] = useState(filters.minPrice !== undefined ? String(filters.minPrice / 100) : '');
  const [max, setMax] = useState(filters.maxPrice !== undefined ? String(filters.maxPrice / 100) : '');

  const colors = new Map<string, { label: string; swatch: string }>();
  const sizes = new Map<string, string>();
  for (const e of scope) {
    for (const axis of e.product.options) {
      if (axis.kind === 'color') for (const v of axis.values) colors.set(v.id, { label: l(v.label), swatch: v.swatch ?? '#ccc' });
      if (axis.kind === 'size' && axis.id === 'size') for (const v of axis.values) sizes.set(v.id, l(v.label));
    }
  }
  const sizeList = [...sizes].slice(0, 14);
  const section = 'border-b border-line py-5 first:pt-0';
  const h = 'mb-3 text-sm font-bold tracking-wide uppercase';
  const row = 'flex min-h-9 cursor-pointer items-center gap-2.5 text-[0.95rem]';

  const applyPrice = () => {
    const mn = parseFloat(min.replace(',', '.'));
    const mx = parseFloat(max.replace(',', '.'));
    const { minPrice: _a, maxPrice: _b, ...rest } = filters;
    void _a; void _b;
    onChange({ ...rest, ...(Number.isFinite(mn) && mn >= 0 ? { minPrice: Math.round(mn * 100) } : {}), ...(Number.isFinite(mx) && mx >= 0 ? { maxPrice: Math.round(mx * 100) } : {}) });
  };

  return (
    <div>
      {!fixed.categoryId && (
        <fieldset className={section}>
          <legend className={h}>{t('filter.category')}</legend>
          <label className={row}><input type="radio" name="cat" className="accent-[var(--color-sun)]" checked={!filters.categoryId} onChange={() => { const { categoryId: _c, ...rest } = filters; void _c; onChange(rest); }} />{t('filter.any')}</label>
          {categories.map((c) => (
            <label key={c.id} className={row}><input type="radio" name="cat" className="accent-[var(--color-sun)]" checked={filters.categoryId === c.id} onChange={() => onChange({ ...filters, categoryId: c.id })} />{l(c.name)}</label>
          ))}
        </fieldset>
      )}
      {!fixed.nicheId && (
        <fieldset className={section}>
          <legend className={h}>{t('filter.niche')}</legend>
          <label className={row}><input type="radio" name="niche" className="accent-[var(--color-sun)]" checked={!filters.nicheId} onChange={() => { const { nicheId: _n, ...rest } = filters; void _n; onChange(rest); }} />{t('filter.any')}</label>
          {snapshot.niches.map((n) => (
            <label key={n.id} className={row}><input type="radio" name="niche" className="accent-[var(--color-sun)]" checked={filters.nicheId === n.id} onChange={() => onChange({ ...filters, nicheId: n.id })} />{l(n.name)}</label>
          ))}
        </fieldset>
      )}
      <fieldset className={section}>
        <legend className={h}>{t('filter.price')} ({currency})</legend>
        <div className="flex items-end gap-2">
          <label className="flex-1 text-xs font-semibold">{t('filter.min')}<input inputMode="decimal" value={min} onChange={(e) => setMin(e.target.value)} onBlur={applyPrice} onKeyDown={(e) => e.key === 'Enter' && applyPrice()} className="mt-1 min-h-10 w-full rounded-md border-2 border-line bg-white px-2.5 text-base focus:border-lavender-text focus:outline-none" /></label>
          <label className="flex-1 text-xs font-semibold">{t('filter.max')}<input inputMode="decimal" value={max} onChange={(e) => setMax(e.target.value)} onBlur={applyPrice} onKeyDown={(e) => e.key === 'Enter' && applyPrice()} className="mt-1 min-h-10 w-full rounded-md border-2 border-line bg-white px-2.5 text-base focus:border-lavender-text focus:outline-none" /></label>
        </div>
        <Button size="sm" variant="secondary" className="mt-3" onClick={applyPrice}>{t('filter.applyPrice')}</Button>
      </fieldset>
      {colors.size > 0 && (
        <fieldset className={section}>
          <legend className={h}>{t('filter.color')}</legend>
          <div className="flex flex-wrap gap-2">
            {[...colors].map(([id, c]) => {
              const on = filters.colors?.includes(id);
              return (
                <button key={id} type="button" aria-pressed={on} aria-label={c.label} title={c.label} onClick={() => onChange({ ...filters, colors: toggle(filters.colors, id) })} className={cn('size-8 rounded-full border border-ink/25 transition hover:scale-110', on && 'ring-2 ring-ink ring-offset-2')} style={{ background: c.swatch }} />
              );
            })}
          </div>
        </fieldset>
      )}
      {sizeList.length > 0 && (
        <fieldset className={section}>
          <legend className={h}>{t('filter.size')}</legend>
          <div className="flex flex-wrap gap-2">
            {sizeList.map(([id, label]) => {
              const on = filters.sizes?.includes(id);
              return <button key={id} type="button" aria-pressed={on} onClick={() => onChange({ ...filters, sizes: toggle(filters.sizes, id) })} className={cn('min-h-9 rounded-full border-2 px-3 text-sm font-semibold transition', on ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink/50')}>{label}</button>;
            })}
          </div>
        </fieldset>
      )}
      <fieldset className={section}>
        <legend className={h}>{t('filter.rating')}</legend>
        {[4, 3].map((n) => (
          <label key={n} className={row}>
            <input type="radio" name="rating" className="accent-[var(--color-sun)]" checked={filters.minRating === n} onChange={() => onChange({ ...filters, minRating: n })} />
            <Stars value={n} size={15} label={t('filter.ratingUp', { n })} /><span className="text-sm">{t('filter.ratingUp', { n })}</span>
          </label>
        ))}
        {filters.minRating && <button type="button" className="mt-1 text-sm font-semibold text-sun-dark underline underline-offset-4" onClick={() => { const { minRating: _r, ...rest } = filters; void _r; onChange(rest); }}>{t('filter.any')}</button>}
      </fieldset>
    </div>
  );
}
