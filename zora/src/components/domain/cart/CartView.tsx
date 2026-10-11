'use client';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Mockup } from '@/components/domain/mockup/Mockup';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Skeleton } from '@/components/ui/Skeleton';
import { useL10n } from '@/hooks/useL10n';
import { useMoney } from '@/hooks/useMoney';
import { useCartView } from '@/hooks/useCartView';
import { Link } from '@/i18n/navigation';
import { useCart } from '@/store/cart';
import { useHydration } from '@/store/hydration';
import { CouponBox } from './CouponBox';
import { TotalsTable } from './OrderSummary';

export function CartView() {
  const t = useTranslations('cart');
  const l = useL10n();
  const { format } = useMoney();
  const hydrated = useHydration((s) => s.done);
  const { priced, coupon, couponError, totals } = useCartView();
  const { setQty, remove, changeSelection } = useCart();
  const rawCount = useCart((s) => s.lines.length);

  if (!hydrated) return <div className="grid gap-8 lg:grid-cols-[1fr_24rem]"><div className="space-y-4"><Skeleton className="h-40" /><Skeleton className="h-40" /></div><Skeleton className="h-72" /></div>;
  if (priced.length === 0) {
    return <EmptyState icon={<ShoppingBag aria-hidden size={30} />} title={t('emptyTitle')} text={t('emptyText')} action={<ButtonLink href="/search">{t('keepShopping')}</ButtonLink>} />;
  }
  const count = priced.reduce((n, p) => n + p.qty, 0);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_24rem]">
      <div>
        <p className="mb-4 text-sm font-semibold text-ink-soft">{t('items', { count })}</p>
        {rawCount > priced.length && <p role="alert" className="mb-4 rounded-md bg-warning-soft p-3 text-sm text-warning">{t('unavailable')}</p>}
        <ul className="divide-y divide-line border-y border-line">
          {priced.map(({ line, entry, unitPrice, selection, qty }) => {
            const name = l(entry.name);
            return (
              <li key={line.id} className="grid grid-cols-[6.5rem_1fr] gap-4 py-5 sm:grid-cols-[8rem_1fr_auto]">
                <Link href={`/p/${entry.item.slug}`} className="overflow-hidden rounded-md bg-paper-2" aria-label={name}>
                  <Mockup type={entry.type} product={entry.product} selection={selection} art={entry.art} label={name} className="aspect-square w-full" />
                </Link>
                <div className="min-w-0">
                  <Link href={`/p/${entry.item.slug}`} className="font-bold underline-offset-4 hover:underline">{name}</Link>
                  <p className="mt-1 text-sm text-ink-soft">{t('unit', { value: format(unitPrice) })}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.product.options.map((axis) => (
                      <select key={axis.id} aria-label={t('changeOption', { name: `${l(axis.label)} — ${name}` })} value={selection[axis.id]} onChange={(e) => changeSelection(line.id, { ...selection, [axis.id]: e.target.value })} className="min-h-9 max-w-full rounded-md border-2 border-line bg-white px-2 text-sm focus:border-lavender-text focus:outline-none">
                        {axis.values.map((v) => <option key={v.id} value={v.id}>{l(axis.label)}: {l(v.label)}</option>)}
                      </select>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <QuantityStepper size="sm" value={qty} onChange={(n) => setQty(line.id, n)} />
                    <button type="button" onClick={() => remove(line.id)} aria-label={t('remove', { name })} className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-ink-soft transition hover:bg-error-soft hover:text-error"><Trash2 aria-hidden size={16} /></button>
                  </div>
                </div>
                <p className="col-span-2 text-right font-display text-xl font-semibold sm:col-span-1" aria-label={t('lineTotal')}>{format(unitPrice * qty)}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="rounded-xl bg-paper-2 p-5 md:p-6 lg:sticky lg:top-32" aria-label={t('summary')}>
        <h2 className="mb-4 text-2xl">{t('summary')}</h2>
        <CouponBox subtotal={totals.subtotal} applied={coupon} invalid={couponError} />
        <div className="my-5 border-t border-line" />
        <TotalsTable totals={totals} />
        <p className="mt-3 text-xs text-ink-soft">{t('shippingNote')}</p>
        <ButtonLink href="/checkout" size="lg" full className="mt-5">{t('checkout')}</ButtonLink>
      </aside>
    </div>
  );
}
