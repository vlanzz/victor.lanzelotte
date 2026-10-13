import { shippingConfig, type ShippingMethod } from '@/config/shipping';
import type { Cents, CartLine, Coupon, Currency, Selection } from './types';

export const MAX_QTY = 20;

/** Chave estável da seleção (ordem das opções não importa). */
export function selectionKey(selection: Selection): string {
  return Object.keys(selection)
    .sort()
    .map((k) => `${k}=${selection[k]}`)
    .join('|');
}

export const lineId = (catalogItemId: string, selection: Selection) =>
  `${catalogItemId}#${selectionKey(selection)}`;

const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(0, Math.floor(Number.isFinite(n) ? n : 0)));

export function addLine(lines: CartLine[], add: Omit<CartLine, 'id'>): CartLine[] {
  const id = lineId(add.catalogItemId, add.selection);
  const qty = clampQty(add.qty);
  if (qty === 0) return lines;
  const existing = lines.find((l) => l.id === id);
  if (existing) return lines.map((l) => (l.id === id ? { ...l, qty: clampQty(l.qty + qty) } : l));
  return [...lines, { ...add, id, qty }];
}

export function setQty(lines: CartLine[], id: string, qty: number): CartLine[] {
  const q = clampQty(qty);
  return q === 0 ? lines.filter((l) => l.id !== id) : lines.map((l) => (l.id === id ? { ...l, qty: q } : l));
}

export const removeLine = (lines: CartLine[], id: string) => lines.filter((l) => l.id !== id);

/** Troca a variação de uma linha; se já existir linha igual, soma as quantidades. */
export function changeSelection(lines: CartLine[], id: string, selection: Selection): CartLine[] {
  const target = lines.find((l) => l.id === id);
  if (!target) return lines;
  const rest = lines.filter((l) => l.id !== id);
  return addLine(rest, { catalogItemId: target.catalogItemId, selection, qty: target.qty });
}

export interface PricedLine {
  unitPrice: Cents;
  qty: number;
}

export interface Totals {
  subtotal: Cents;
  discount: Cents;
  shipping: Cents;
  total: Cents;
  freeShippingApplied: boolean;
}

export function shippingFor(currency: Currency, method: ShippingMethod, subtotal: Cents): Cents {
  const cfg = shippingConfig[currency];
  if (method === 'standard' && subtotal >= cfg.freeOver) return 0;
  return cfg.methods[method].price;
}

export function computeTotals(
  lines: PricedLine[],
  opts: { currency: Currency; method?: ShippingMethod; coupon?: Coupon | null },
): Totals {
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const { coupon } = opts;
  let discount = 0;
  if (coupon?.type === 'percent') discount = Math.floor((subtotal * coupon.value) / 100);
  if (coupon?.type === 'fixed') discount = Math.min(coupon.value, subtotal);
  const freeShippingApplied = coupon?.type === 'freeShipping';
  const shipping =
    subtotal === 0 || freeShippingApplied ? 0 : shippingFor(opts.currency, opts.method ?? 'standard', subtotal);
  return { subtotal, discount, shipping, total: subtotal - discount + shipping, freeShippingApplied };
}
