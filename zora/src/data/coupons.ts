import type { Coupon } from '@/domain/types';

export const coupons: Coupon[] = [
  { code: 'BEMVINDO10', type: 'percent', value: 10, description: { pt: '10% de desconto no pedido', en: '10% off your order' }, uses: 42, active: true },
  { code: 'ZORA20', type: 'fixed', value: 2000, currency: 'BRL', minSubtotal: 10000, description: { pt: 'R$ 20 de desconto em pedidos a partir de R$ 100', en: 'R$ 20 off orders over R$ 100' }, uses: 17, active: true },
  { code: 'WELCOME5', type: 'fixed', value: 500, currency: 'USD', minSubtotal: 3000, description: { pt: 'US$ 5 de desconto em pedidos a partir de US$ 30', en: '$5 off orders over $30' }, uses: 8, active: true },
  { code: 'FRETEGRATIS', type: 'freeShipping', value: 0, description: { pt: 'Frete grátis', en: 'Free shipping' }, uses: 63, active: true },
  { code: 'NATAL25', type: 'percent', value: 25, description: { pt: '25% de desconto de Natal', en: '25% Christmas discount' }, expiresAt: '2025-12-31T23:59:59Z', uses: 120, active: true },
  { code: 'ULTIMAS', type: 'percent', value: 15, description: { pt: '15% — cupom esgotado', en: '15% — sold out coupon' }, maxUses: 50, uses: 50, active: true },
  { code: 'PAUSADO', type: 'percent', value: 30, description: { pt: '30% — cupom pausado', en: '30% — paused coupon' }, uses: 0, active: false },
];
