import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { AdminShell } from '@/components/domain/admin/AdminShell';
import { resolveLocale } from '@/i18n/params';

export const metadata = { robots: { index: false } };

export default async function AdminLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  await resolveLocale(params);
  const { admin } = await getMessages();
  return <NextIntlClientProvider messages={{ admin }}><AdminShell>{children}</AdminShell></NextIntlClientProvider>;
}
