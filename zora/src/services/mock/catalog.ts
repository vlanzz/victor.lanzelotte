import type { CatalogSnapshot } from '@/domain/catalog';
import type { Art, CatalogItem, Coupon, Product, Review } from '@/domain/types';
import { arts } from '@/data/arts';
import { catalogItems } from '@/data/catalog-items';
import { coupons } from '@/data/coupons';
import { niches } from '@/data/niches';
import { productTypes, products } from '@/data/products';
import { reviews } from '@/data/reviews';
import type { CatalogRepo } from '../ports';
import { applyOverlay, clearOverlay, deleteInOverlay, loadOverlay, saveOverlay, upsertInOverlay } from './overlay';

const id = <T extends { id: string }>(t: T) => t.id;
const code = (c: Coupon) => c.code;

function mutate<T>(name: string, _keyOf: (t: T) => string, fn: (o: ReturnType<typeof loadOverlay<T>>) => ReturnType<typeof loadOverlay<T>>) {
  saveOverlay(name, fn(loadOverlay<T>(name)));
}

export const seedSnapshot: CatalogSnapshot = { types: productTypes, products, arts, items: catalogItems, reviews, niches };

export const mockCatalogRepo: CatalogRepo = {
  async getSnapshot() {
    return {
      types: productTypes,
      niches,
      products: applyOverlay(products, loadOverlay<Product>('products'), id),
      arts: applyOverlay(arts, loadOverlay<Art>('arts'), id),
      items: applyOverlay(catalogItems, loadOverlay<CatalogItem>('items'), id),
      reviews: applyOverlay(reviews, loadOverlay<Review>('reviews'), id),
    };
  },
  async saveProduct(p) { mutate<Product>('products', id, (o) => upsertInOverlay(o, p, id)); },
  async deleteProduct(pid) { mutate<Product>('products', id, (o) => deleteInOverlay(o, pid, id)); },
  async saveArt(a) { mutate<Art>('arts', id, (o) => upsertInOverlay(o, a, id)); },
  async deleteArt(aid) { mutate<Art>('arts', id, (o) => deleteInOverlay(o, aid, id)); },
  async saveItem(i) { mutate<CatalogItem>('items', id, (o) => upsertInOverlay(o, i, id)); },
  async deleteItem(iid) { mutate<CatalogItem>('items', id, (o) => deleteInOverlay(o, iid, id)); },
  async saveReview(r) { mutate<Review>('reviews', id, (o) => upsertInOverlay(o, r, id)); },
  async getCoupons() { return applyOverlay(coupons, loadOverlay<Coupon>('coupons'), code); },
  async saveCoupon(c) { mutate<Coupon>('coupons', code, (o) => upsertInOverlay(o, c, code)); },
  async deleteCoupon(cc) { mutate<Coupon>('coupons', code, (o) => deleteInOverlay(o, cc, code)); },
  async reset() {
    for (const n of ['products', 'arts', 'items', 'reviews', 'coupons', 'orders', 'customers']) clearOverlay(n);
  },
};
