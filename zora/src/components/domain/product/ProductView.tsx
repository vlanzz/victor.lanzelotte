'use client';
import { Heart, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { categories } from '@/data/categories';
import { resolveSelection, unitPrice } from '@/domain/pricing';
import type { Selection } from '@/domain/types';
import { useL10n } from '@/hooks/useL10n';
import { useMoney } from '@/hooks/useMoney';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Skeleton } from '@/components/ui/Skeleton';
import { Stars } from '@/components/ui/Stars';
import { SearchX } from 'lucide-react';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { Link } from '@/i18n/navigation';
import { useCart } from '@/store/cart';
import { useHydration } from '@/store/hydration';
import { useToasts } from '@/store/toast';
import { useWishlist } from '@/store/wishlist';
import { Gallery } from './Gallery';
import { Reviews } from './Reviews';
import { RelatedProducts } from './RelatedProducts';
import { VariantPicker } from './VariantPicker';
import { WishlistButton } from './WishlistButton';

export function ProductView({ slug }: { slug: string }) {
  const t = useTranslations('product');
  const tn = useTranslations('nav');
  const l = useL10n();
  const { bySlug, ready, snapshot } = useCatalog();
  const entry = bySlug(slug);
  if (!entry) {
    if (!ready) return <div className="container-page grid gap-8 py-10 md:grid-cols-2"><Skeleton className="aspect-square rounded-xl" /><div className="space-y-4"><Skeleton className="h-10 w-3/4" /><Skeleton className="h-6 w-1/3" /><Skeleton className="h-40" /></div></div>;
    return <div className="container-page py-16"><EmptyState icon={<SearchX aria-hidden size={30} />} title={t('notFoundTitle')} text={t('notFoundText')} action={<ButtonLink href="/search">{t('seeProducts')}</ButtonLink>} /></div>;
  }
  return <ProductDetail key={entry.item.id} entry={entry} l={l} t={t} tn={tn} niches={snapshot.niches} />;
}

type Entry = NonNullable<ReturnType<ReturnType<typeof useCatalog>['bySlug']>>;

function ProductDetail({ entry, l, t, tn, niches }: { entry: Entry; l: ReturnType<typeof useL10n>; t: ReturnType<typeof useTranslations<'product'>>; tn: ReturnType<typeof useTranslations<'nav'>>; niches: ReturnType<typeof useCatalog>['snapshot']['niches'] }) {
  const { product, type, art, item } = entry;
  const { format, currency } = useMoney();
  const add = useCart((s) => s.add);
  const push = useToasts((s) => s.push);
  const hydrated = useHydration((s) => s.done);
  const inWish = useWishlist((s) => s.ids.includes(item.id));
  const toggleWish = useWishlist((s) => s.toggle);
  const [selection, setSelection] = useState<Selection>(() => resolveSelection(product, {}));
  const [qty, setQty] = useState(1);
  const category = categories.find((c) => c.id === entry.categoryId);
  const niche = niches.find((n) => n.id === art.nicheIds[0]);
  const price = useMemo(() => unitPrice(product, selection, currency), [product, selection, currency]);
  const name = l(entry.name);

  const addToCart = () => {
    add(item.id, selection, qty);
    push({ tone: 'success', message: t('added', { name }), action: { label: t('viewCart'), href: '/cart' } });
  };

  return (
    <div className="container-page py-6 pb-28 md:py-10 md:pb-10">
      <Breadcrumbs label={tn('breadcrumbs')} items={[
        { label: tn('home'), href: '/' },
        ...(category ? [{ label: l(category.name), href: `/c/${category.id}` }] : []),
        { label: name },
      ]} />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <Gallery type={type} product={product} art={art} selection={selection} accent={niche?.color} label={name} />
        <div>
          <h1 className="text-3xl md:text-4xl">{name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            {entry.reviewCount > 0 ? (<><Stars value={entry.rating} /><a href="#reviews-title" className="underline underline-offset-4">{entry.rating.toFixed(1)} · {entry.reviewCount}</a></>) : <a href="#reviews-title" className="text-ink-soft underline underline-offset-4">{t('reviews.none')}</a>}
          </div>
          <p aria-label={t('price')} className="mt-5 font-display text-4xl font-semibold">{format(price)}</p>
          <p className="mt-4 text-ink-soft">{l(product.description)}</p>

          <div className="mt-6"><VariantPicker options={product.options} selection={selection} onChange={(a, v) => setSelection((s) => ({ ...s, [a]: v }))} /></div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} onChange={setQty} />
            <Button size="lg" className="min-w-0 flex-1" onClick={addToCart}><ShoppingBag aria-hidden size={20} />{t('addToCart')}</Button>
            <WishlistButton itemId={item.id} name={name} className="!size-12 border-2 border-line !bg-white" />
          </div>
          <p className="mt-3 text-sm font-semibold">{t('total', { value: format(price * qty) })}</p>

          <div className="mt-8 divide-y divide-line border-y border-line">
            {[
              { k: 'specs', body: (<dl className="space-y-2 text-sm">{product.specs.map((s, i) => <div key={i} className="grid grid-cols-[7rem_1fr] gap-3"><dt className="font-bold">{l(s.label)}</dt><dd className="text-ink-soft">{l(s.value)}</dd></div>)}</dl>) },
              { k: 'production', body: <p className="text-sm text-ink-soft">{l(product.production)}</p> },
              { k: 'shippingInfo', body: <p className="text-sm text-ink-soft">{l(product.shipping)}</p> },
            ].map((d) => (
              <details key={d.k} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-bold">{t(d.k as 'specs')}<span aria-hidden className="text-xl transition group-open:rotate-45">+</span></summary>
                <div className="pt-3">{d.body}</div>
              </details>
            ))}
          </div>
          {niche && <p className="mt-5 text-sm text-ink-soft">{t('artBy')}: <strong>{l(art.title)}</strong> · {t('collections')}: {art.nicheIds.map((id) => { const n = niches.find((x) => x.id === id); return n ? <Link key={id} href={`/n/${n.slug}`} className="mr-2 font-semibold underline underline-offset-4">{l(n.name)}</Link> : null; })}</p>}
        </div>
      </div>

      <div className="mt-20" id="reviews"><Reviews itemId={item.id} /></div>
      <RelatedProducts entry={entry} />

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="min-w-0"><p className="text-xs text-ink-soft">{t('price')}</p><p className="font-display text-xl font-semibold">{format(price * qty)}</p></div>
        <Button className="flex-1" onClick={addToCart}><ShoppingBag aria-hidden size={18} />{t('stickyAdd')}</Button>
        <button type="button" aria-label={t('addWishlist')} aria-pressed={hydrated && inWish} onClick={() => toggleWish(item.id)} className="flex size-11 items-center justify-center rounded-full border-2 border-line bg-white"><Heart aria-hidden size={20} className={hydrated && inWish ? 'fill-sun text-sun' : ''} /></button>
      </div>
    </div>
  );
}
