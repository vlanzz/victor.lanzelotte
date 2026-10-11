import { BRL_PER_USD, intlLocale } from '@/config/currency';
import type { Cents, Currency, Locale } from './types';

/** Converte centavos entre moedas pela taxa fixa; USD arredonda a 10 centavos para preços "bonitos". */
export function convert(cents: Cents, from: Currency, to: Currency): Cents {
  if (from === to) return cents;
  if (from === 'BRL') return Math.round(cents / BRL_PER_USD / 10) * 10;
  return Math.round(cents * BRL_PER_USD);
}

export function formatMoney(cents: Cents, currency: Currency, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale], { style: 'currency', currency }).format(cents / 100);
}
