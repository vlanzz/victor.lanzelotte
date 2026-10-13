'use client';
import { Heart, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { categories } from '@/data/categories';
import { niches } from '@/data/niches';
import { useL10n } from '@/hooks/useL10n';
import { Link } from '@/i18n/navigation';
import { useSession } from '@/store/session';
import { Modal } from '../ui/Modal';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations();
  const l = useL10n();
  const customer = useSession((s) => s.customer);

  const link = 'flex min-h-11 items-center rounded-md px-2 font-medium hover:bg-paper-2';
  const heading = 'mt-5 mb-1 px-2 text-xs font-bold tracking-widest text-ink-soft uppercase';
  return (
    <Modal open={open} onClose={onClose} title={t('nav.menu')} closeLabel={t('common.close')} variant="sheet">
      <nav aria-label={t('nav.main')} onClick={(e) => (e.target as HTMLElement).closest('a') && onClose()}>
        <Link href="/search" className={link}>{t('nav.allProducts')}</Link>
        <Link href="/search?sort=newest" className={link}>{t('nav.newArrivals')}</Link>
        <p className={heading}>{t('nav.categories')}</p>
        {categories.map((c) => <Link key={c.id} href={`/c/${c.id}`} className={link}>{l(c.name)}</Link>)}
        <p className={heading}>{t('nav.niches')}</p>
        {niches.map((n) => <Link key={n.id} href={`/n/${n.slug}`} className={link}>{l(n.name)}</Link>)}
        <p className={heading}>Zora</p>
        <Link href="/how-it-works" className={link}>{t('nav.howItWorks')}</Link>
        <Link href="/about" className={link}>{t('nav.about')}</Link>
        <Link href="/wishlist" className={link}><Heart aria-hidden size={18} className="mr-2" />{t('nav.wishlist')}</Link>
        <Link href={customer ? '/account' : '/login'} className={link}><User aria-hidden size={18} className="mr-2" />{customer ? t('nav.account') : t('nav.login')}</Link>
      </nav>
    </Modal>
  );
}
