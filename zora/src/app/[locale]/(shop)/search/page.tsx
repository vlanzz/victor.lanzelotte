import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { BrowseSkeleton } from '@/components/domain/catalog/BrowseSkeleton';
import { CatalogBrowser } from '@/components/domain/catalog/CatalogBrowser';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { resolveLocale } from '@/i18n/params';

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale });
  return (
    <div className="container-page py-8">
      <Breadcrumbs label={t('nav.breadcrumbs')} items={[{ label: t('nav.home'), href: '/' }, { label: t('browse.allProducts') }]} />
      <h1 className="mt-4 mb-8 text-4xl md:text-5xl">{t('browse.allProducts')}</h1>
      <Suspense fallback={<BrowseSkeleton />}><CatalogBrowser /></Suspense>
    </div>
  );
}
