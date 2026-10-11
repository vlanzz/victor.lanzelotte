'use client';
import { HeartOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ProductCard } from '@/components/domain/product/ProductCard';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useHydration } from '@/store/hydration';
import { useWishlist } from '@/store/wishlist';
import { Skeleton } from '@/components/ui/Skeleton';

export function WishlistView() {
  const t = useTranslations('wishlist');
  const ids = useWishlist((s) => s.ids);
  const hydrated = useHydration((s) => s.done);
  const { byId } = useCatalog();
  if (!hydrated) return <Skeleton className="h-64" />;
  const entries = ids.flatMap((id) => { const e = byId(id); return e ? [e] : []; });
  if (entries.length === 0) return <EmptyState icon={<HeartOff aria-hidden size={30} />} title={t('emptyTitle')} text={t('emptyText')} action={<ButtonLink href="/search">{t('browse')}</ButtonLink>} />;
  return (
    <>
      <p className="mb-6 text-sm font-semibold text-ink-soft">{t('count', { count: entries.length })}</p>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {entries.map((e) => <li key={e.item.id}><ProductCard entry={e} /></li>)}
      </ul>
    </>
  );
}
