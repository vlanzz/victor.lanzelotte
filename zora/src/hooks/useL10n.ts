'use client';
import { useLocale } from 'next-intl';
import type { L10n, Locale } from '@/domain/types';

/** Escolhe o texto no idioma atual: `const l = useL10n(); l(product.name)`. */
export function useL10n() {
  const locale = useLocale() as Locale;
  return (t: L10n) => t[locale];
}
