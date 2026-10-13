import { resolveSelection } from './pricing';
import type { L10n, Product, Selection } from './types';

/** Texto da variação escolhida, ex.: "Branco · 450 ml". */
export function selectionLabel(product: Product, selection: Selection): L10n {
  const sel = resolveSelection(product, selection);
  const parts = product.options.map((axis) => axis.values.find((v) => v.id === sel[axis.id])?.label);
  return {
    pt: parts.map((p) => p?.pt ?? '').filter(Boolean).join(' · '),
    en: parts.map((p) => p?.en ?? '').filter(Boolean).join(' · '),
  };
}
