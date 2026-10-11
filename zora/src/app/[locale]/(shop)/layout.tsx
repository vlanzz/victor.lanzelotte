import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { resolveLocale } from '@/i18n/params';

export default async function ShopLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  await resolveLocale(params); // registra o idioma para a renderização estática (Footer é componente de servidor)
  return (
    <>
      <Header />
      <main id="main" className="min-h-[60vh]">{children}</main>
      <Footer />
    </>
  );
}
