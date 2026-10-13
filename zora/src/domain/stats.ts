import { rng } from '@/data/random';
import { convert } from './money';
import type { Order, OrderStatus } from './types';

/** Valor do pedido em reais (pedidos em dólar são convertidos pela taxa fixa). */
export const orderBRL = (o: Pick<Order, 'total' | 'currency'>) => convert(o.total, o.currency, 'BRL');

export function dashboardStats(orders: Order[], customersCount: number, pendingReviews: number) {
  const valid = orders.filter((o) => o.status !== 'cancelled');
  const revenue = valid.reduce((s, o) => s + orderBRL(o), 0);
  const byStatus = {} as Record<OrderStatus, number>;
  for (const o of orders) byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
  const units = new Map<string, { name: Order['lines'][number]['name']; qty: number }>();
  for (const o of valid) for (const l of o.lines) {
    const cur = units.get(l.catalogItemId);
    units.set(l.catalogItemId, { name: l.name, qty: (cur?.qty ?? 0) + l.qty });
  }
  return {
    revenue,
    orderCount: orders.length,
    ticket: valid.length ? Math.round(revenue / valid.length) : 0,
    customers: customersCount,
    pendingReviews,
    toShip: orders.filter((o) => o.status === 'paid' || o.status === 'in_production').length,
    byStatus,
    top: [...units.values()].sort((a, b) => b.qty - a.qty).slice(0, 5),
  };
}

/**
 * Série diária dos últimos `days` dias: base fictícia (determinística) + pedidos reais do protótipo
 * no dia da compra. `today` é injetado para facilitar os testes.
 */
export function salesSeries(orders: Order[], today: Date, days = 30) {
  const r = rng(77);
  const start = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) - (days - 1) * 86_400_000;
  const series = Array.from({ length: days }, (_, i) => {
    const wave = 1 + 0.35 * Math.sin(i / 2.3);
    return { date: new Date(start + i * 86_400_000), value: Math.round((180 + r() * 220) * wave) * 100 };
  });
  for (const o of orders) {
    if (o.status === 'cancelled') continue;
    const idx = Math.floor((Date.parse(o.createdAt) - start) / 86_400_000);
    if (idx >= 0 && idx < days) series[idx]!.value += orderBRL(o);
  }
  return series;
}
