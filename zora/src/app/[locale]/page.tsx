import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Logo } from '@/components/layout/Logo';

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('home');
  return (
    <main className="container-page py-20">
      <Logo />
      <h1 className="mt-6 text-5xl">{t('heroTitle')}</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">{t('heroText')}</p>
    </main>
  );
}
