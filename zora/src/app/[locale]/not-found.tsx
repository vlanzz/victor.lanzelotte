import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { NotFoundView } from '@/components/layout/ErrorView';

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main"><NotFoundView /></main>
      <Footer />
    </>
  );
}
