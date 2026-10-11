import type { CatalogItem } from '@/domain/types';
import { arts } from './arts';
import { productTypes, products } from './products';

/**
 * Combina artes e produtos: cada tipo de produto recebe até 5 artes compatíveis com a sua
 * orientação (rodízio determinístico, para todas as artes aparecerem em vários produtos).
 */
const PER_TYPE = 5;
const DAY = 86_400_000;
const BASE = Date.UTC(2026, 9, 1);

function build(): CatalogItem[] {
  const out: CatalogItem[] = [];
  let n = 0;
  productTypes.forEach((type, ti) => {
    const product = products.find((p) => p.typeId === type.id);
    if (!product) return;
    const compatible = arts.filter((a) =>
      a.compatibleTypeIds ? a.compatibleTypeIds.includes(type.id) : type.orientations.includes(a.orientation),
    );
    for (let k = 0; k < Math.min(PER_TYPE, compatible.length); k++) {
      const art = compatible[(ti * 3 + k * 2) % compatible.length];
      if (!art || out.some((i) => i.artId === art.id && i.productId === product.id)) continue;
      n++;
      out.push({
        id: `ci-${product.slug}-${art.slug}`,
        slug: `${product.slug}-${art.slug}`,
        artId: art.id,
        productId: product.id,
        featured: n % 6 === 0,
        isNew: false,
        createdAt: new Date(BASE - ((n * 37) % 150) * DAY).toISOString(),
        status: 'active',
      });
    }
  });
  // Os 14 mais recentes viram "lançamento".
  [...out].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 14).forEach((i) => (i.isNew = true));
  return out;
}

export const catalogItems: CatalogItem[] = build();
