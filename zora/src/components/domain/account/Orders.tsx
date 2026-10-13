'use client';
import { ChevronRight, PackageOpen } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { formatMoney } from '@/domain/money';
import type { Locale, Order } from '@/domain/types';
import { Link } from '@/i18n/navigation';
import { orderRepo } from '@/services';
import { useSession } from '@/store/session';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { AddressBlock, OrderLines, OrderTimeline, OrderTotals, StatusBadge } from '../order/OrderParts';

function useOrders(customerId: string | undefined) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  useEffect(() => {
    let alive = true;
    if (!customerId) return;
    void orderRepo.listByCustomer(customerId).then((o) => alive && setOrders(o));
    return () => { alive = false; };
  }, [customerId]);
  return orders;
}

export function OrdersList() {
  const t = useTranslations('account.orders');
  const locale = useLocale() as Locale;
  const customer = useSession((s) => s.customer);
  const orders = useOrders(customer?.id);
  if (!orders) return <Skeleton className="h-64" />;
  return (
    <section>
      <h2 className="text-2xl">{t('title')}</h2>
      {orders.length === 0 ? (
        <EmptyState icon={<PackageOpen aria-hidden size={30} />} title={t('empty')} text={t('emptyText')} action={<ButtonLink href="/search">→</ButtonLink>} />
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/account/orders/${o.id}`} className="flex items-center gap-4 rounded-lg border-2 border-line bg-white p-4 transition hover:border-ink/40 hover:shadow-soft">
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 font-bold">{t('number', { number: o.number })} <StatusBadge status={o.status} /></p>
                  <p className="mt-1 text-sm text-ink-soft">{t('date', { date: new Date(o.createdAt).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US') })} · {t('items', { count: o.lines.reduce((n, l) => n + l.qty, 0) })}</p>
                </div>
                <p className="font-bold">{formatMoney(o.total, o.currency, locale)}</p>
                <ChevronRight aria-hidden size={18} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function OrderDetail({ id }: { id: string }) {
  const t = useTranslations('account.orders');
  const to = useTranslations('order');
  const locale = useLocale() as Locale;
  const customer = useSession((s) => s.customer);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    void orderRepo.get(id).then((o) => alive && setOrder(o));
    return () => { alive = false; };
  }, [id]);
  if (order === undefined) return <Skeleton className="h-96" />;
  if (!order || order.customerId !== customer?.id) return <EmptyState title={t('notFound')} action={<ButtonLink href="/account/orders">{t('back')}</ButtonLink>} />;
  return (
    <section>
      <Link href="/account/orders" className="text-sm font-semibold underline underline-offset-4">← {t('back')}</Link>
      <h2 className="mt-3 flex flex-wrap items-center gap-3 text-2xl">{t('number', { number: order.number })} <StatusBadge status={order.status} /></h2>
      <p className="mt-1 text-sm text-ink-soft">{t('date', { date: new Date(order.createdAt).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US') })}</p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_16rem]">
        <div className="space-y-6">
          <div className="rounded-xl bg-paper-2 p-5"><OrderLines order={order} /><div className="mt-3"><OrderTotals order={order} /></div></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><h3 className="mb-1 font-sans text-sm font-bold">{to('deliverTo')}</h3><AddressBlock order={order} /></div>
            <div><h3 className="mb-1 font-sans text-sm font-bold">{to('payment')}</h3><p className="text-sm">{order.paymentMethod === 'pix' ? 'Pix' : 'Card'}</p></div>
          </div>
        </div>
        <div><h3 className="mb-4 font-sans text-sm font-bold">{t('timeline')}</h3><OrderTimeline order={order} /></div>
      </div>
    </section>
  );
}
