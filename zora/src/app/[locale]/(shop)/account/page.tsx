import { Profile } from '@/components/domain/account/Profile';
import { resolveLocale } from '@/i18n/params';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await resolveLocale(params);
  return <Profile />;
}
