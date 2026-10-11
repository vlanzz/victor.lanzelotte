import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { BrowseSkeleton } from '@/components/domain/catalog/BrowseSkeleton';
import { CatalogBrowser } from '@/components/domain/catalog/CatalogBrowser';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { categories } from '@/data/categories';
import { resolveLocale } from '@/i18n/params';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => categories.map((c) => ({ locale, slug: c.id })));
}

const FIXED = (id: (typeof categories)[number]['id']) => ({ categoryId: id });

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const category = categories.find((c) => c.id === slug);
  if (!category) notFound();
  const t = await getTranslations({ locale });
  return (
    <>
      <section style={{ background: category.color }} className="border-b border-line">
        <div className="container-page py-10 md:py-14">
          <Breadcrumbs label={t('nav.breadcrumbs')} items={[{ label: t('nav.home'), href: '/' }, { label: category.name[locale] }]} />
          <h1 className="mt-4 text-4xl md:text-6xl">{category.name[locale]}</h1>
          <p className="mt-3 max-w-xl text-lg">{category.blurb[locale]}</p>
        </div>
      </section>
      <div className="container-page py-8">
        <Suspense fallback={<BrowseSkeleton />}><CatalogBrowser fixed={FIXED(category.id)} /></Suspense>
      </div>
    </>
  );
}
