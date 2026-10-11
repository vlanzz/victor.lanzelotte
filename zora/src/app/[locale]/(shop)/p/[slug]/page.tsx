import type { Metadata } from 'next';
import { ProductView } from '@/components/domain/product/ProductView';
import { entryName } from '@/domain/catalog';
import { resolveLocale } from '@/i18n/params';
import { routing } from '@/i18n/routing';
import { seedSnapshot } from '@/services/mock/catalog';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => seedSnapshot.items.map((i) => ({ locale, slug: i.slug })));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const item = seedSnapshot.items.find((i) => i.slug === slug);
  const art = seedSnapshot.arts.find((a) => a.id === item?.artId);
  const product = seedSnapshot.products.find((p) => p.id === item?.productId);
  if (!art || !product) return {};
  return { title: entryName(art, product)[locale], description: product.description[locale] };
}

export default async function ProductPage({ params }: Props) {
  await resolveLocale(params);
  const { slug } = await params;
  return <ProductView slug={slug} />;
}
