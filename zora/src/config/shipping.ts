import type { Cents, Currency } from '@/domain/types';

export type ShippingMethod = 'standard' | 'express';

interface Rule {
  price: Cents;
  days: [number, number];
}

/** Frete simulado (valores fixos por moeda). Frete padrão grátis acima de `freeOver`. */
export const shippingConfig: Record<Currency, { methods: Record<ShippingMethod, Rule>; freeOver: Cents }> = {
  BRL: {
    methods: { standard: { price: 1990, days: [7, 12] }, express: { price: 3490, days: [3, 5] } },
    freeOver: 29900,
  },
  USD: {
    methods: { standard: { price: 1400, days: [10, 18] }, express: { price: 2900, days: [4, 7] } },
    freeOver: 7500,
  },
};
