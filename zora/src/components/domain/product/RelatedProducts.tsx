'use client';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import type { CatalogEntry } from '@/domain/catalog';
import { useL10n } from '@/hooks/useL10n';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { ProductCard } from './ProductCard';

function Row({ title, list }: { title: string; list: CatalogEntry[] }) {
  if (!list.length) return null;
  return (
    <section className="mt-16" aria-label={title}>
      <h2 className="mb-6 text-2xl md:text-3xl">{title}</h2>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-4">
        {list.map((e) => <li key={e.item.id}><ProductCard entry={e} /></li>)}
      </ul>
    </section>
  );
}

/** Mesma arte em outros produtos + produtos relacionados (mesmo nicho/categoria). */
export function RelatedProducts({ entry }: { entry: CatalogEntry }) {
  const t = useTranslations('product');
  const l = useL10n();
  const { entries } = useCatalog();
  const { sameArt, more } = useMemo(() => {
    const sameArt = entries.filter((e) => e.art.id === entry.art.id && e.item.id !== entry.item.id).slice(0, 4);
    const used = new Set([entry.item.id, ...sameArt.map((e) => e.item.id)]);
    const more = entries
      .filter((e) => !used.has(e.item.id))
      .map((e) => ({ e, score: (e.nicheIds.some((n) => entry.nicheIds.includes(n)) ? 2 : 0) + (e.categoryId === entry.categoryId ? 1 : 0) + e.rating * 0.1 }))
      .filter((x) => x.score >= 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.e);
    return { sameArt, more };
  }, [entries, entry]);
  void l;
  return (
    <>
      <Row title={t('sameArt')} list={sameArt} />
      <Row title={t('related')} list={more.slice(0, 4)} />
    </>
  );
}
