import { ShieldCheck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Logo } from '@/components/layout/Logo';
import { PreferencesMenu } from '@/components/layout/PreferencesMenu';
import { Link } from '@/i18n/navigation';
import { resolveLocale } from '@/i18n/params';

/** Cabeçalho enxuto no checkout: menos distração, mais foco em concluir a compra. */
export default async function CheckoutLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'checkout' });
  return (
    <>
      <header className="border-b border-line bg-paper">
        <div className="container-page flex items-center justify-between py-3">
          <Link href="/" aria-label="Zora"><Logo /></Link>
          <p className="hidden items-center gap-2 text-sm text-ink-soft sm:flex"><ShieldCheck aria-hidden size={18} />{t('secure')}</p>
          <PreferencesMenu />
        </div>
      </header>
      <main id="main" className="container-page py-8 md:py-12">{children}</main>
    </>
  );
}
