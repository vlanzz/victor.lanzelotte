import { convert } from './money';
import type { Cents, Currency, Product, Selection } from './types';

export function basePrice(product: Product, currency: Currency): Cents {
  if (currency === 'BRL') return product.priceBRL;
  return product.priceUSD ?? convert(product.priceBRL, 'BRL', 'USD');
}

/** Seleção completa: completa o que faltar (ou for inválido) com o padrão do produto. */
export function resolveSelection(product: Product, selection: Selection = {}): Selection {
  const out: Selection = {};
  for (const axis of product.options) {
    const wanted = selection[axis.id];
    const valid = axis.values.some((v) => v.id === wanted);
    out[axis.id] = valid ? (wanted as string) : (product.defaultSelection[axis.id] ?? axis.values[0]?.id ?? '');
  }
  return out;
}

/** Preço unitário = base + acréscimos das opções escolhidas. */
export function unitPrice(product: Product, selection: Selection, currency: Currency): Cents {
  const sel = resolveSelection(product, selection);
  let total = basePrice(product, currency);
  for (const axis of product.options) {
    const v = axis.values.find((x) => x.id === sel[axis.id]);
    if (!v) continue;
    total += currency === 'BRL' ? v.deltaBRL : (v.deltaUSD ?? convert(v.deltaBRL, 'BRL', 'USD'));
  }
  return total;
}

/** Menor preço possível do produto ("a partir de"). */
export function fromPrice(product: Product, currency: Currency): Cents {
  let total = basePrice(product, currency);
  for (const axis of product.options) {
    const deltas = axis.values.map((v) =>
      currency === 'BRL' ? v.deltaBRL : (v.deltaUSD ?? convert(v.deltaBRL, 'BRL', 'USD')),
    );
    total += Math.min(...deltas, 0);
  }
  return total;
}
