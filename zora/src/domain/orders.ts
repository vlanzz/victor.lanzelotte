import { computeTotals, type Totals } from './cart';
import type { ShippingMethod } from '@/config/shipping';
import type { CatalogEntry } from './catalog';
import { selectionLabel } from './options';
import { resolveSelection, unitPrice } from './pricing';
import type { CartLine, Coupon, Currency, OrderLine } from './types';

export interface PricedLine {
  line: CartLine;
  entry: CatalogEntry;
  unitPrice: number;
  qty: number;
  selection: Record<string, string>;
}

/** Junta as linhas do carrinho com o catálogo. Itens que saíram do catálogo ficam de fora. */
export function priceLines(lines: CartLine[], byId: (id: string) => CatalogEntry | undefined, currency: Currency): PricedLine[] {
  return lines.flatMap((line) => {
    const entry = byId(line.catalogItemId);
    if (!entry) return [];
    const selection = resolveSelection(entry.product, line.selection);
    return [{ line, entry, selection, qty: line.qty, unitPrice: unitPrice(entry.product, selection, currency) }];
  });
}

export function cartTotals(priced: PricedLine[], currency: Currency, coupon: Coupon | null, method: ShippingMethod = 'standard'): Totals {
  return computeTotals(priced, { currency, coupon, method });
}

/** "Foto" das linhas no momento da compra: o pedido não muda se o catálogo mudar depois. */
export function toOrderLines(priced: PricedLine[]): OrderLine[] {
  return priced.map((p) => ({
    catalogItemId: p.entry.item.id,
    name: p.entry.name,
    artFile: p.entry.art.file,
    optionsLabel: selectionLabel(p.entry.product, p.selection),
    selection: p.selection,
    qty: p.qty,
    unitPrice: p.unitPrice,
  }));
}

/** Validação de cartão (algoritmo de Luhn) — só para a interface simulada. */
export function luhn(num: string): boolean {
  const d = num.replace(/\D/g, '');
  if (d.length < 13 || d.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return sum % 10 === 0;
}

export function validExpiry(v: string, now = new Date()): boolean {
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(v.trim());
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}
