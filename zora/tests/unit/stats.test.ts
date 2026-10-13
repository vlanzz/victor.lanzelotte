import { describe, expect, it } from 'vitest';
import { orders } from '@/data/orders';
import { dashboardStats, orderBRL, salesSeries } from '@/domain/stats';

describe('métricas do admin', () => {
  it('receita ignora cancelados e converte USD para BRL', () => {
    const s = dashboardStats(orders, 7, 2);
    const expected = orders.filter((o) => o.status !== 'cancelled').reduce((n, o) => n + orderBRL(o), 0);
    expect(s.revenue).toBe(expected);
    expect(s.orderCount).toBe(orders.length);
    expect(s.pendingReviews).toBe(2);
    expect(s.ticket).toBe(Math.round(expected / orders.filter((o) => o.status !== 'cancelled').length));
  });
  it('série tem 30 dias, é determinística e soma pedidos do dia', () => {
    const today = new Date('2026-10-10T12:00:00Z');
    const a = salesSeries([], today);
    expect(a).toHaveLength(30);
    expect(salesSeries([], today)).toEqual(a);
    const o = { ...orders[0]!, createdAt: '2026-10-10T10:00:00Z', status: 'paid' as const };
    const b = salesSeries([o], today);
    expect(b[29]!.value).toBe(a[29]!.value + orderBRL(o));
  });
  it('top vendidos ordena por quantidade', () => {
    const s = dashboardStats(orders, 1, 0);
    for (let i = 1; i < s.top.length; i++) expect(s.top[i - 1]!.qty).toBeGreaterThanOrEqual(s.top[i]!.qty);
  });
});
