'use client';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { shippingConfig } from '@/config/shipping';
import { useMoney } from '@/hooks/useMoney';
import { Link } from '@/i18n/navigation';
import { useCart } from '@/store/cart';
import { useHydration } from '@/store/hydration';
import { useSession } from '@/store/session';
import { useWishlist } from '@/store/wishlist';
import { IconButton } from '../ui/Button';
import { Logo } from './Logo';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';
import { PreferencesMenu } from './PreferencesMenu';
import { SearchBox } from './SearchBox';

function CountBadge({ n }: { n: number }) {
  if (n <= 0) return null;
  return <span aria-hidden className="absolute top-1 right-0.5 flex min-w-5 items-center justify-center rounded-full bg-sun px-1 text-[0.7rem] leading-5 font-bold text-white">{n > 99 ? '99+' : n}</span>;
}

export function Header() {
  const t = useTranslations();
  const { currency, format } = useMoney();
  const hydrated = useHydration((s) => s.done);
  const cartCount = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const customer = useSession((s) => s.customer);
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cart = hydrated ? cartCount : 0;
  const wish = hydrated ? wishCount : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <a href="#main" className="sr-only-focusable fixed top-2 left-2 z-[200] rounded-full bg-ink px-4 py-2 font-semibold text-paper">{t('common.skipToContent')}</a>
      <div className="bg-ink px-4 py-1.5 text-center text-xs font-medium text-paper">
        {t('header.freeShipping', { amount: format(shippingConfig[currency].freeOver) })}
      </div>
      <div className="container-page flex items-center gap-2 py-2 md:gap-4">
        <IconButton label={t('header.openMenu')} className="lg:hidden" onClick={() => setMenu(true)}><Menu aria-hidden /></IconButton>
        <Link href="/" aria-label="Zora" className="mr-1 shrink-0"><Logo /></Link>
        <nav aria-label={t('nav.main')} className="hidden items-center lg:flex">
          <MegaMenu />
          <Link href="/search?sort=newest" className="inline-flex min-h-11 items-center rounded-full px-4 font-semibold transition hover:bg-paper-2">{t('nav.newArrivals')}</Link>
          <Link href="/how-it-works" className="inline-flex min-h-11 items-center rounded-full px-4 font-semibold transition hover:bg-paper-2">{t('nav.howItWorks')}</Link>
        </nav>
        <SearchBox className="ml-auto hidden max-w-md flex-1 md:block" />
        <div className="ml-auto flex items-center md:ml-0">
          <IconButton label={t('nav.search')} className="md:hidden" aria-expanded={searchOpen} onClick={() => setSearchOpen((o) => !o)}><Search aria-hidden /></IconButton>
          <PreferencesMenu />
          <Link href="/wishlist" aria-label={t('header.wishlistItems', { count: wish })} className="relative hidden size-11 items-center justify-center rounded-full transition hover:bg-paper-2 sm:inline-flex">
            <Heart aria-hidden size={22} /><CountBadge n={wish} />
          </Link>
          <Link href={customer ? '/account' : '/login'} aria-label={customer ? t('nav.account') : t('nav.login')} className="hidden size-11 items-center justify-center rounded-full transition hover:bg-paper-2 sm:inline-flex">
            <User aria-hidden size={22} />
          </Link>
          <Link href="/cart" aria-label={t('header.cartItems', { count: cart })} className="relative inline-flex size-11 items-center justify-center rounded-full transition hover:bg-paper-2">
            <ShoppingBag aria-hidden size={22} /><CountBadge n={cart} />
          </Link>
        </div>
      </div>
      {searchOpen && <div className="container-page pb-3 md:hidden"><SearchBox onDone={() => setSearchOpen(false)} /></div>}
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
    </header>
  );
}
