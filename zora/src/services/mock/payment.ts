import type { PaymentGateway, PodProvider, ShippingQuoter } from '../ports';
import { shippingConfig } from '@/config/shipping';
import { shippingFor } from '@/domain/cart';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Simula o gateway. Cartão terminado em 0002 (4000 0000 0000 0002) é recusado, para testar o erro. */
export const mockPayment: PaymentGateway = {
  async pay(req) {
    await wait(900);
    return { ok: true, reference: `pay_${Math.random().toString(36).slice(2, 10)}`, ...(req.method === 'pix' ? { pixCode: '00020126580014br.gov.bcb.pix0136zora-demo-0000-0000-0000520400005303986540510.005802BR5905Zora6009SAO PAULO62070503***6304ABCD' } : {}) };
  },
};

export const mockShipping: ShippingQuoter = {
  async quote({ currency, subtotal }) {
    const cfg = shippingConfig[currency];
    return (['standard', 'express'] as const).map((method) => ({
      method, price: shippingFor(currency, method, subtotal), days: cfg.methods[method].days,
    }));
  },
};

export const mockPod: PodProvider = {
  async submitOrder(order) { return { externalId: `pod_${order.id}` }; },
  async getStatus() { return 'in_production'; },
};
