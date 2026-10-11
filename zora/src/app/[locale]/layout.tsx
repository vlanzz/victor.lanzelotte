import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { CatalogProvider } from '@/components/providers/CatalogProvider';
import { StoreHydrator } from '@/components/providers/StoreHydrator';
import { ToastViewport } from '@/components/ui/ToastViewport';
import { resolveLocale } from '@/i18n/params';
import { routing } from '@/i18n/routing';
import '@/styles/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: { default: t('title'), template: '%s · Zora' }, description: t('description'), icons: { icon: '/brand/favicon.svg' } };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  return (
    <html lang={locale === 'pt' ? 'pt-BR' : 'en'}>
      <body>
        <NextIntlClientProvider>
          <CatalogProvider>
            <StoreHydrator />
            {children}
            <ToastViewport />
          </CatalogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
