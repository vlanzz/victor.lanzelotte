import type { Currency, Locale } from '@/domain/types';

/** Conversão FIXA e fictícia. Mude aqui: 1 USD = 5,50 BRL. */
export const BRL_PER_USD = 5.5;

export const currencies: Currency[] = ['BRL', 'USD'];
export const defaultCurrencyByLocale: Record<Locale, Currency> = { pt: 'BRL', en: 'USD' };
export const intlLocale: Record<Locale, string> = { pt: 'pt-BR', en: 'en-US' };
