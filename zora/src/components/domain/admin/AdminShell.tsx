'use client';
import { BarChart3, Box, ExternalLink, Image as ImageIcon, LayoutGrid, LogOut, MessageSquare, Package, RotateCcw, Tag, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/components/ui/cn';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { auth, catalogRepo } from '@/services';
import { clearOverlay } from '@/services/mock/overlay';
import { useSession } from '@/store/session';
import { useToasts } from '@/store/toast';

const NAV = [
  { href: '/admin', key: 'dashboard', icon: BarChart3, exact: true },
  { href: '/admin/products', key: 'products', icon: Box },
  { href: '/admin/arts', key: 'arts', icon: ImageIcon },
  { href: '/admin/catalog', key: 'catalog', icon: LayoutGrid },
  { href: '/admin/orders', key: 'orders', icon: Package },
  { href: '/admin/coupons', key: 'coupons', icon: Tag },
  { href: '/admin/reviews', key: 'reviews', icon: MessageSquare },
  { href: '/admin/customers', key: 'customers', icon: Users },
] as const;

/** Protege o painel (só perfil admin) e desenha o menu lateral. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('admin');
  const tc = useTranslations('common');
  const customer = useSession((s) => s.customer);
  const loaded = useSession((s) => s.loaded);
  const logout = useSession((s) => s.logout);
  const refreshSession = useSession((s) => s.refresh);
  const { refresh } = useCatalog();
  const router = useRouter();
  const pathname = usePathname();
  const push = useToasts((s) => s.push);
  const [open, setOpen] = useState(false);

  useEffect(() => { document.title = `${t('nav.title')} · Zora`; }, [t]);

  if (!loaded) return <div className="p-8"><Skeleton className="h-96" /></div>;
  if (!customer || customer.role !== 'admin') {
    return (
      <div className="container-page py-20">
        <EmptyState title={t('guard.title')} text={t('guard.text')} action={
          <Button onClick={async () => { await auth.login('admin@zora.demo', 'admin1234'); await refreshSession(); }}>{t('guard.login')}</Button>
        } />
      </div>
    );
  }

  const reset = async () => {
    if (!window.confirm(t('nav.resetConfirm'))) return;
    await catalogRepo.reset();
    for (const n of ['orders', 'customers']) clearOverlay(n);
    await refresh();
    push({ tone: 'success', message: t('nav.resetDone') });
    router.refresh();
  };

  const link = (active: boolean) => cn('flex min-h-11 items-center gap-3 rounded-md px-3 font-semibold transition', active ? 'bg-paper text-ink' : 'text-paper/85 hover:bg-paper/10');
  return (
    <div className="min-h-dvh bg-paper-2 md:grid md:grid-cols-[15rem_1fr]">
      <a href="#admin-main" className="sr-only-focusable fixed top-2 left-2 z-[200] rounded-full bg-ink px-4 py-2 font-semibold text-paper">{tc('skipToContent')}</a>
      <aside className="bg-ink text-paper md:sticky md:top-0 md:h-dvh md:overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-4 md:block">
          <Link href="/" aria-label="Zora"><Logo className="!text-paper [&_svg_path:nth-child(2)]:stroke-[var(--color-paper)]" /></Link>
          <button type="button" className="rounded-full border border-paper/30 px-3 py-1.5 text-sm font-semibold md:hidden" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{t('nav.menu')}</button>
          <p className="mt-2 hidden text-xs text-paper/70 md:block">{t('nav.title')} · <span className="rounded-full bg-honey px-2 py-0.5 font-bold text-ink">{t('nav.demoBadge')}</span></p>
        </div>
        <nav aria-label={t('nav.menu')} className={cn('space-y-1 px-3 pb-4', !open && 'hidden md:block')} onClick={() => setOpen(false)}>
          {NAV.map(({ href, key, icon: Icon, ...rest }) => {
            const active = 'exact' in rest && rest.exact ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={link(active)}><Icon aria-hidden size={18} />{t(`nav.${key}`)}</Link>;
          })}
          <div className="my-3 border-t border-paper/15" />
          <Link href="/" className={link(false)}><ExternalLink aria-hidden size={18} />{t('nav.viewStore')}</Link>
          <button type="button" onClick={reset} className={cn(link(false), 'w-full text-left')}><RotateCcw aria-hidden size={18} />{t('nav.reset')}</button>
          <button type="button" onClick={async () => { await logout(); router.push('/'); }} className={cn(link(false), 'w-full text-left')}><LogOut aria-hidden size={18} />{t('nav.logout')}</button>
        </nav>
      </aside>
      <main id="admin-main" className="min-w-0 p-4 md:p-8">{children}</main>
    </div>
  );
}

export function AdminHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-3xl md:text-4xl">{title}</h1>{subtitle && <p className="mt-1 text-ink-soft">{subtitle}</p>}</div>
      {actions}
    </div>
  );
}
