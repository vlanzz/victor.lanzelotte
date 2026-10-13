import { computeTotals } from '@/domain/cart';
import { entryName } from '@/domain/catalog';
import { selectionLabel } from '@/domain/options';
import { resolveSelection, unitPrice } from '@/domain/pricing';
import type { Currency, Order, OrderStatus } from '@/domain/types';
import { arts } from './arts';
import { catalogItems } from './catalog-items';
import { coupons } from './coupons';
import { customers } from './customers';
import { products } from './products';

type Seed = [customer: string, status: OrderStatus, daysAgo: number, itemIdx: number[], coupon?: string, currency?: Currency];

const seeds: Seed[] = [
  ['cus-ana', 'delivered', 70, [3, 40], 'BEMVINDO10'],
  ['cus-ana', 'shipped', 9, [12, 77, 101]],
  ['cus-ana', 'in_production', 2, [5]],
  ['cus-bruno', 'delivered', 55, [20, 21]],
  ['cus-bruno', 'paid', 1, [60]],
  ['cus-carla', 'delivered', 40, [8, 9, 150], 'FRETEGRATIS'],
  ['cus-carla', 'cancelled', 33, [44]],
  ['cus-emma', 'shipped', 6, [15, 16], 'WELCOME5', 'USD'],
  ['cus-emma', 'delivered', 48, [90], undefined, 'USD'],
  ['cus-lucas', 'pending', 0, [33, 34]],
  ['cus-lucas', 'in_production', 3, [70, 71, 72], 'ZORA20'],
  ['cus-sofia', 'paid', 2, [120], undefined, 'USD'],
];

const NOW = Date.UTC(2026, 9, 10, 12);
const FLOW: OrderStatus[] = ['pending', 'paid', 'in_production', 'shipped', 'delivered'];

function build(): Order[] {
  return seeds.flatMap(([customerId, status, daysAgo, idxs, couponCode, cur], n) => {
    const customer = customers.find((c) => c.id === customerId);
    const address = customer?.addresses[0];
    if (!customer || !address) return [];
    const currency: Currency = cur ?? 'BRL';
    const created = NOW - daysAgo * 86_400_000;
    const lines = idxs.flatMap((i) => {
      const item = catalogItems[i % catalogItems.length];
      const product = products.find((p) => p.id === item?.productId);
      const art = arts.find((a) => a.id === item?.artId);
      if (!item || !product || !art) return [];
      const selection = resolveSelection(product, {});
      return [{
        catalogItemId: item.id, name: entryName(art, product), artFile: art.file,
        optionsLabel: selectionLabel(product, selection), selection, qty: 1 + (i % 2),
        unitPrice: unitPrice(product, selection, currency),
      }];
    });
    const coupon = coupons.find((c) => c.code === couponCode) ?? null;
    const t = computeTotals(lines, { currency, coupon });
    const reached = status === 'cancelled' ? ['pending'] : FLOW.slice(0, FLOW.indexOf(status) + 1);
    return [{
      id: `ord-${1001 + n}`, number: `ZR-${24001 + n * 7}`, customerId, email: customer.email,
      createdAt: new Date(created).toISOString(), currency, locale: currency === 'USD' ? 'en' : 'pt', lines,
      subtotal: t.subtotal, discount: t.discount, shipping: t.shipping, total: t.total,
      ...(couponCode ? { couponCode } : {}),
      address, shippingMethod: 'standard' as const, paymentMethod: n % 2 ? ('pix' as const) : ('card' as const),
      status, history: [...reached, ...(status === 'cancelled' ? ['cancelled' as const] : [])].map((s, k) => ({
        status: s as OrderStatus, at: new Date(created + k * 36 * 3_600_000).toISOString(),
      })),
    } satisfies Order];
  });
}

export const orders: Order[] = build();
