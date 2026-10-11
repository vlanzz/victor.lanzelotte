import { AdminShell } from '@/components/domain/admin/AdminShell';
import { resolveLocale } from '@/i18n/params';

export const metadata = { robots: { index: false } };

export default async function AdminLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  await resolveLocale(params);
  return <AdminShell>{children}</AdminShell>;
}
