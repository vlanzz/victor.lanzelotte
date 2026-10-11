import { resolveLocale } from '@/i18n/params';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  await resolveLocale(params);
  return <div className="container-page py-20"><h1 className="text-5xl">Zora</h1></div>;
}
