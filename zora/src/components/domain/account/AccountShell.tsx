'use client';
import { Heart, LogOut, MapPin, Package, Settings, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/components/ui/cn';
import { EmptyState } from '@/components/ui/EmptyState';
import { ButtonLink } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/store/session';

/** Protege as páginas da conta (redireciona para o login) e desenha o menu lateral. */
export function AccountShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('account');
  const customer = useSession((s) => s.customer);
  const loaded = useSession((s) => s.loaded);
  const logout = useSession((s) => s.logout);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loaded && !customer) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [loaded, customer, router, pathname]);

  if (!loaded) return <div className="container-page py-10"><Skeleton className="h-96" /></div>;
  if (!customer) return <div className="container-page py-10"><EmptyState title={t('guardTitle')} text={t('guardText')} action={<ButtonLink href="/login">{t('nav.profile')}</ButtonLink>} /></div>;

  const items = [
    { href: '/account', label: t('nav.profile'), icon: User, exact: true },
    { href: '/account/addresses', label: t('nav.addresses'), icon: MapPin },
    { href: '/account/orders', label: t('nav.orders'), icon: Package },
    { href: '/wishlist', label: t('nav.wishlist'), icon: Heart },
    ...(customer.role === 'admin' ? [{ href: '/admin', label: t('nav.admin'), icon: Settings }] : []),
  ];
  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl">{t('hello', { name: customer.name.split(' ')[0] ?? '' })}</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-[14rem_1fr]">
        <nav aria-label={t('navLabel')} className="flex gap-2 overflow-x-auto md:flex-col">
          {items.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={cn('inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-semibold whitespace-nowrap transition', active ? 'bg-ink text-paper' : 'hover:bg-paper-2')}>
                <Icon aria-hidden size={18} />{label}
              </Link>
            );
          })}
          <button type="button" onClick={async () => { await logout(); router.push('/'); }} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-semibold whitespace-nowrap text-ink-soft transition hover:bg-error-soft hover:text-error">
            <LogOut aria-hidden size={18} />{t('nav.logout')}
          </button>
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
