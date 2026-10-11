import { OrdersList } from '@/components/domain/account/Orders';
import { resolveLocale } from '@/i18n/params';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await resolveLocale(params);
  return <OrdersList />;
}
