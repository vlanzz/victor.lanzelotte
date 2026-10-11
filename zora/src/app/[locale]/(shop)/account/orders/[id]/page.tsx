import { OrderDetail } from '@/components/domain/account/Orders';
import { resolveLocale } from '@/i18n/params';

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  await resolveLocale(params);
  const { id } = await params;
  return <OrderDetail id={id} />;
}
