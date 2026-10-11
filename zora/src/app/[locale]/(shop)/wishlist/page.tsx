import { getTranslations } from 'next-intl/server';
import { WishlistView } from '@/components/domain/account/WishlistView';
import { resolveLocale } from '@/i18n/params';

export default async function WishlistPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'wishlist' });
  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="text-4xl md:text-5xl">{t('title')}</h1>
      <p className="mt-2 mb-8 text-ink-soft">{t('text')}</p>
      <WishlistView />
    </div>
  );
}
