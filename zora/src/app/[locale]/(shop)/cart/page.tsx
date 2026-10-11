import { getTranslations } from 'next-intl/server';
import { CartView } from '@/components/domain/cart/CartView';
import { resolveLocale } from '@/i18n/params';

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'cart' });
  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="mb-8 text-4xl md:text-5xl">{t('title')}</h1>
      <CartView />
    </div>
  );
}
