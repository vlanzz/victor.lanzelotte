import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from './routing';

type LocaleParams = Promise<{ locale: string }>;

/** Valida o :locale da rota (404 se inválido) e o registra para renderização estática. */
export async function resolveLocale(params: LocaleParams) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}
