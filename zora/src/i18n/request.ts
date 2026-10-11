import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import en from '../messages/en';
import pt from '../messages/pt';
import { routing } from './routing';

const catalogs = { pt, en };

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return { locale, messages: catalogs[locale] };
});
