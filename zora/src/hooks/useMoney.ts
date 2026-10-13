'use client';
import { useLocale } from 'next-intl';
import { defaultCurrencyByLocale } from '@/config/currency';
import { formatMoney } from '@/domain/money';
import type { Cents, Currency, Locale } from '@/domain/types';
import { usePreferences } from '@/store/preferences';

/** Moeda atual (escolhida ou padrão do idioma) + formatador. */
export function useMoney() {
  const locale = useLocale() as Locale;
  const chosen = usePreferences((s) => s.currency);
  const currency: Currency = chosen ?? defaultCurrencyByLocale[locale];
  return { currency, locale, format: (cents: Cents) => formatMoney(cents, currency, locale) };
}
