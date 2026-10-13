import { orders as seedOrders } from '@/data/orders';
import type { Order } from '@/domain/types';
import type { OrderRepo } from '../ports';
import { applyOverlay, loadOverlay, saveOverlay, upsertInOverlay } from './overlay';

const id = (o: Order) => o.id;
const all = () => applyOverlay(seedOrders, loadOverlay<Order>('orders'), id);
const byDateDesc = (a: Order, b: Order) => b.createdAt.localeCompare(a.createdAt);

export const mockOrderRepo: OrderRepo = {
  async list() { return all().sort(byDateDesc); },
  async listByCustomer(customerId) { return all().filter((o) => o.customerId === customerId).sort(byDateDesc); },
  async get(oid) { return all().find((o) => o.id === oid) ?? null; },
  async create(input) {
    const n = all().length;
    const now = new Date().toISOString();
    const order: Order = {
      ...input, id: `ord-${1001 + n}`, number: `ZR-${24100 + n * 3 + 1}`, createdAt: now, status: 'paid',
      history: [{ status: 'pending', at: now }, { status: 'paid', at: now }],
    };
    saveOverlay('orders', upsertInOverlay(loadOverlay<Order>('orders'), order, id));
    return order;
  },
  async updateStatus(oid, status) {
    const order = all().find((o) => o.id === oid);
    if (!order || order.status === status) return order ?? null;
    const next: Order = { ...order, status, history: [...order.history, { status, at: new Date().toISOString() }] };
    saveOverlay('orders', upsertInOverlay(loadOverlay<Order>('orders'), next, id));
    return next;
  },
};
