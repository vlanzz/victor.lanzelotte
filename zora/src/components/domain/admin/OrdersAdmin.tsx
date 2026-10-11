'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { formatMoney } from '@/domain/money';
import type { Locale, Order, OrderStatus } from '@/domain/types';
import { useAdminData } from '@/hooks/useAdminData';
import { Link } from '@/i18n/navigation';
import { orderRepo } from '@/services';
import { useToasts } from '@/store/toast';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Table, Td, Th } from '@/components/ui/Table';
import { AddressBlock, OrderLines, OrderTimeline, OrderTotals, StatusBadge } from '../order/OrderParts';
import { AdminHeader } from './AdminShell';

const STATUSES: OrderStatus[] = ['pending', 'paid', 'in_production', 'shipped', 'delivered', 'cancelled'];

export function OrdersAdmin() {
  const t = useTranslations('admin');
  const ts = useTranslations('order.status');
  const locale = useLocale() as Locale;
  const { orders, loading } = useAdminData();
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');
  const [q, setQ] = useState('');
  const list = useMemo(() => (orders ?? []).filter((o) => (status === 'all' || o.status === status) && (!q || `${o.number} ${o.email} ${o.address.name}`.toLowerCase().includes(q.toLowerCase()))), [orders, status, q]);
  const date = (d: string) => new Date(d).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US');
  return (
    <div>
      <AdminHeader title={t('orders.title')} />
      <div className="mb-4 flex flex-wrap gap-3">
        <input type="search" aria-label={t('common.search')} placeholder={t('common.search')} value={q} onChange={(e) => setQ(e.target.value)} className="min-h-11 w-64 rounded-full border-2 border-line bg-white px-4" />
        <select aria-label={t('common.status')} value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | 'all')} className="min-h-11 rounded-full border-2 border-line bg-white px-4">
          <option value="all">{t('common.all')}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{ts(s)}</option>)}
        </select>
      </div>
      {loading ? <Skeleton className="h-64" /> : list.length === 0 ? <EmptyState title={t('common.noResults')} /> : (
        <Table caption={t('orders.title')}>
          <thead><tr><Th>{t('orders.col.number')}</Th><Th>{t('orders.col.date')}</Th><Th>{t('orders.col.customer')}</Th><Th>{t('orders.col.items')}</Th><Th>{t('orders.col.total')}</Th><Th>{t('orders.col.status')}</Th></tr></thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="hover:bg-paper">
                <Td><Link href={`/admin/orders/${o.id}`} className="font-bold underline underline-offset-4">{o.number}</Link></Td>
                <Td>{date(o.createdAt)}</Td>
                <Td>{o.address.name}<br /><span className="text-xs text-ink-soft">{o.email}</span></Td>
                <Td>{o.lines.reduce((n, l) => n + l.qty, 0)}</Td>
                <Td className="font-semibold whitespace-nowrap">{formatMoney(o.total, o.currency, locale)}</Td>
                <Td><StatusBadge status={o.status} /></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export function OrderAdminDetail({ id }: { id: string }) {
  const t = useTranslations('admin');
  const ts = useTranslations('order.status');
  const to = useTranslations('order');
  const push = useToasts((s) => s.push);
  const { orders, loading, reload } = useAdminData();
  const order: Order | undefined = orders?.find((o) => o.id === id);
  const [next, setNext] = useState<OrderStatus | null>(null);
  if (loading) return <Skeleton className="h-96" />;
  if (!order) return <EmptyState title={t('orders.detail.notFound')} action={<Link href="/admin/orders" className="font-bold underline">{t('common.back')}</Link>} />;
  const current = next ?? order.status;
  return (
    <div>
      <Link href="/admin/orders" className="text-sm font-semibold underline underline-offset-4">← {t('orders.title')}</Link>
      <div className="mt-3"><AdminHeader title={t('orders.detail.title', { number: order.number })} actions={<StatusBadge status={order.status} />} /></div>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-lg bg-white p-5 shadow-soft"><OrderLines order={order} /><div className="mt-3"><OrderTotals order={order} /></div></section>
          <section className="grid gap-4 rounded-lg bg-white p-5 shadow-soft sm:grid-cols-3">
            <div><h2 className="mb-1 font-sans text-sm font-bold">{t('orders.detail.customer')}</h2><p className="text-sm">{order.address.name}<br />{order.email}</p></div>
            <div><h2 className="mb-1 font-sans text-sm font-bold">{t('orders.detail.address')}</h2><AddressBlock order={order} /></div>
            <div><h2 className="mb-1 font-sans text-sm font-bold">{t('orders.detail.payment')} / {t('orders.detail.shipping')}</h2><p className="text-sm">{order.paymentMethod === 'pix' ? 'Pix' : 'Card'}<br />{to('shippingMethod')}: {order.shippingMethod}</p></div>
          </section>
        </div>
        <div className="space-y-6">
          <section className="rounded-lg bg-white p-5 shadow-soft">
            <h2 className="mb-3 font-sans text-sm font-bold">{t('orders.detail.changeStatus')}</h2>
            <div className="flex gap-2">
              <select aria-label={t('orders.detail.changeStatus')} value={current} onChange={(e) => setNext(e.target.value as OrderStatus)} className="min-h-11 flex-1 rounded-md border-2 border-line bg-white px-3">
                {STATUSES.map((s) => <option key={s} value={s}>{ts(s)}</option>)}
              </select>
              <Button disabled={current === order.status} onClick={async () => { await orderRepo.updateStatus(order.id, current); await reload(); setNext(null); push({ tone: 'success', message: t('orders.detail.statusChanged', { status: ts(current) }) }); }}>{t('common.save')}</Button>
            </div>
          </section>
          <section className="rounded-lg bg-white p-5 shadow-soft"><h2 className="mb-4 font-sans text-sm font-bold">{t('orders.detail.history')}</h2><OrderTimeline order={order} /></section>
        </div>
      </div>
    </div>
  );
}
