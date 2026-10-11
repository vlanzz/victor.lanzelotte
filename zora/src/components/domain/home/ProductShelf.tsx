'use client';
import { useMemo } from 'react';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { ProductCard } from '@/components/domain/product/ProductCard';

/** Prateleira de produtos da home (destaques ou lançamentos). */
export function ProductShelf({ kind, limit = 8 }: { kind: 'featured' | 'new'; limit?: number }) {
  const { entries } = useCatalog();
  const list = useMemo(() => {
    const picked = entries.filter((e) => (kind === 'featured' ? e.item.featured : e.item.isNew));
    const seen = new Set<string>();
    // varia os tipos de produto na vitrine
    const varied = picked.filter((e) => (seen.has(e.type.id) ? false : (seen.add(e.type.id), true)));
    return [...varied, ...picked.filter((e) => !varied.includes(e))].slice(0, limit);
  }, [entries, kind, limit]);
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-4">
      {list.map((e) => <li key={e.item.id}><ProductCard entry={e} /></li>)}
    </ul>
  );
}
