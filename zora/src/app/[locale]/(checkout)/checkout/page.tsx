import { getTranslations } from 'next-intl/server';
import { CheckoutFlow } from '@/components/domain/checkout/CheckoutFlow';
import { resolveLocale } from '@/i18n/params';

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'checkout' });
  return (
    <>
      <h1 className="mb-8 text-4xl md:text-5xl">{t('title')}</h1>
      <CheckoutFlow />
    </>
  );
}
