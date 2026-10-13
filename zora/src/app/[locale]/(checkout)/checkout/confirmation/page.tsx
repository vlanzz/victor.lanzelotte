import { Suspense } from 'react';
import { Confirmation } from '@/components/domain/order/Confirmation';
import { Skeleton } from '@/components/ui/Skeleton';
import { resolveLocale } from '@/i18n/params';

export default async function ConfirmationPage({ params }: { params: Promise<{ locale: string }> }) {
  await resolveLocale(params);
  return <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-2xl" />}><Confirmation /></Suspense>;
}
