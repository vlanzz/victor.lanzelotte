import { Addresses } from '@/components/domain/account/Addresses';
import { resolveLocale } from '@/i18n/params';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await resolveLocale(params);
  return <Addresses />;
}
