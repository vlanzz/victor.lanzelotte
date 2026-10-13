'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { dashboardStats, salesSeries } from '@/domain/stats';
import type { Locale, OrderStatus } from '@/domain/types';
import { formatMoney } from '@/domain/money';
import { useAdminData } from '@/hooks/useAdminData';
import { useL10n } from '@/hooks/useL10n';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { Link } from '@/i18n/navigation';
import { StatusBadge } from '../order/OrderParts';
import { AdminHeader } from './AdminShell';

const ORDER: OrderStatus[] = ['pending', 'paid', 'in_production', 'shipped', 'delivered', 'cancelled'];

export function Dashboard() {
  const t = useTranslations('admin.dashboard');
  const ts = useTranslations('order.status');
  const locale = useLocale() as Locale;
  const l = useL10n();
  const { orders, customers, loading } = useAdminData();
  const { snapshot } = useCatalog();
  const brl = (n: number) => formatMoney(n, 'BRL', locale);

  const view = useMemo(() => {
    if (!orders || !customers) return null;
    const pending = snapshot.reviews.filter((r) => r.status === 'pending').length;
    return { stats: dashboardStats(orders, customers.filter((c) => c.role === 'customer').length, pending), series: salesSeries(orders, new Date()), orders };
  }, [orders, customers, snapshot.reviews]);

  if (loading || !view) return <div><AdminHeader title={t('title')} /><Skeleton className="h-96" /></div>;
  const { stats, series } = view;
  const max = Math.max(...series.map((p) => p.value));
  const kpis = [
    { k: 'revenue', v: brl(stats.revenue) }, { k: 'orders', v: String(stats.orderCount) }, { k: 'ticket', v: brl(stats.ticket) },
    { k: 'customers', v: String(stats.customers) }, { k: 'pendingReviews', v: String(stats.pendingReviews) }, { k: 'toShip', v: String(stats.toShip) },
  ] as const;
  const W = 720, H = 220, bw = W / series.length;
  const fmtDay = (d: Date) => d.toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US', { day: '2-digit', month: '2-digit' });

  return (
    <div>
      <AdminHeader title={t('title')} subtitle={t('subtitle')} />
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map(({ k, v }) => (
          <li key={k} className="rounded-lg bg-white p-4 shadow-soft">
            <p className="text-xs font-bold tracking-wide text-ink-soft uppercase">{t(`kpi.${k}`)}</p>
            <p className="mt-2 font-display text-2xl font-semibold">{v}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-lg bg-white p-5 shadow-soft" aria-labelledby="chart-t">
          <h2 id="chart-t" className="font-sans text-lg font-bold">{t('chart')}</h2>
          <p className="text-sm text-ink-soft">{t('chartHint')}</p>
          <svg viewBox={`0 0 ${W} ${H + 24}`} role="img" aria-label={`${t('chart')}: ${brl(series.reduce((s, p) => s + p.value, 0))}`} className="mt-4 w-full">
            {[0.25, 0.5, 0.75, 1].map((g) => <line key={g} x1="0" x2={W} y1={H - H * g} y2={H - H * g} stroke="var(--color-line)" strokeWidth="1" />)}
            {series.map((p, i) => {
              const h = (p.value / max) * (H - 10);
              return <rect key={i} x={i * bw + 3} y={H - h} width={bw - 6} height={h} rx="3" fill={i === series.length - 1 ? 'var(--color-sun)' : 'var(--color-honey)'}><title>{`${fmtDay(p.date)}: ${brl(p.value)}`}</title></rect>;
            })}
            {[0, 7, 14, 21, 29].map((i) => <text key={i} x={i * bw + bw / 2} y={H + 18} textAnchor="middle" fontSize="12" fill="var(--color-ink-soft)">{fmtDay(series[i]!.date)}</text>)}
          </svg>
        </section>

        <section className="rounded-lg bg-white p-5 shadow-soft" aria-labelledby="st-t">
          <h2 id="st-t" className="font-sans text-lg font-bold">{t('byStatus')}</h2>
          <ul className="mt-4 space-y-3">
            {ORDER.map((s) => {
              const n = stats.byStatus[s] ?? 0;
              return (
                <li key={s}>
                  <div className="flex justify-between text-sm"><span>{ts(s)}</span><span className="font-bold">{n}</span></div>
                  <div aria-hidden className="mt-1 h-2 rounded-full bg-paper-2"><div className="h-full rounded-full bg-lavender" style={{ width: `${stats.orderCount ? (n / stats.orderCount) * 100 : 0}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-lg bg-white p-5 shadow-soft" aria-labelledby="top-t">
          <h2 id="top-t" className="font-sans text-lg font-bold">{t('top')}</h2>
          <ol className="mt-3 divide-y divide-line">
            {stats.top.map((p, i) => <li key={i} className="flex justify-between gap-3 py-2 text-sm"><span>{i + 1}. {l(p.name)}</span><span className="shrink-0 font-bold">{t('units', { count: p.qty })}</span></li>)}
          </ol>
        </section>

        <section className="rounded-lg bg-white p-5 shadow-soft" aria-labelledby="rc-t">
          <h2 id="rc-t" className="font-sans text-lg font-bold">{t('recent')}</h2>
          {view.orders.length === 0 ? <p className="mt-3 text-sm text-ink-soft">{t('noOrders')}</p> : (
            <ul className="mt-3 divide-y divide-line">
              {view.orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <Link href={`/admin/orders/${o.id}`} className="font-bold underline-offset-4 hover:underline">{o.number}</Link>
                  <StatusBadge status={o.status} />
                  <span>{formatMoney(o.total, o.currency, locale)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
