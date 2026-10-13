import { Suspense } from 'react';
import { LoginForm } from '@/components/domain/account/AuthForms';
import { resolveLocale } from '@/i18n/params';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await resolveLocale(params);
  return <div className="container-page py-10 md:py-16"><Suspense><LoginForm /></Suspense></div>;
}
