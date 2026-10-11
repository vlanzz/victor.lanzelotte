'use client';
import { CheckCircle2, Copy, Mail } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Locale, Order } from '@/domain/types';
import { orderRepo } from '@/services';
import { useSession } from '@/store/session';
import { useToasts } from '@/store/toast';
import { ButtonLink, Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { AddressBlock, OrderLines, OrderTotals } from './OrderParts';
import { SearchX } from 'lucide-react';

export function Confirmation() {
  const t = useTranslations('order');
  const tc = useTranslations('cart');
  const locale = useLocale() as Locale;
  const params = useSearchParams();
  const id = params.get('order');
  const pix = params.get('pix');
  const customer = useSession((s) => s.customer);
  const push = useToasts((s) => s.push);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    if (!id) { setOrder(null); return; } // eslint-disable-line react-hooks/set-state-in-effect
    void orderRepo.get(id).then((o) => alive && setOrder(o));
    return () => { alive = false; };
  }, [id]);

  if (order === undefined) return <Skeleton className="mx-auto h-96 max-w-2xl" />;
  if (!order) return <EmptyState icon={<SearchX aria-hidden size={30} />} title={t('notFound')} text={t('notFoundText')} action={<ButtonLink href="/">{t('continue')}</ButtonLink>} />;

  const copy = async () => {
    try { await navigator.clipboard.writeText(pix ?? ''); push({ tone: 'success', message: t('pixCopied') }); } catch { /* sem permissão: ignora */ }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <span className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-mint-soft text-mint-text"><CheckCircle2 aria-hidden size={34} /></span>
        <h1 className="text-4xl md:text-5xl">{t('confirmedTitle')}</h1>
        <p className="mt-3 text-ink-soft">{t('confirmedText')}</p>
        <p className="mt-5 inline-block rounded-full bg-honey px-5 py-2 font-bold">{t('number')}: {order.number}</p>
      </div>

      {pix && (
        <section className="mt-8 rounded-xl border-2 border-line bg-white p-5" aria-labelledby="pix-t">
          <h2 id="pix-t" className="font-sans text-lg font-bold">{t('pixTitle')}</h2>
          <div className="mt-3 flex items-start gap-3">
            <p className="min-w-0 flex-1 rounded-md bg-paper-2 p-3 font-mono text-xs break-all">{pix}</p>
            <Button variant="secondary" size="sm" onClick={copy}><Copy aria-hidden size={16} />{t('pixCopy')}</Button>
          </div>
          <p className="mt-2 text-sm text-ink-soft">{t('pixNote')}</p>
        </section>
      )}

      <section className="mt-8 rounded-xl bg-paper-2 p-5 md:p-6" aria-label={tc('summary')}>
        <OrderLines order={order} />
        <div className="mt-3"><OrderTotals order={order} /></div>
        <div className="mt-5 grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
          <div><h3 className="mb-1 font-sans text-sm font-bold">{t('deliverTo')}</h3><AddressBlock order={order} /></div>
          <div><h3 className="mb-1 font-sans text-sm font-bold">{t('payment')}</h3><p className="text-sm">{order.paymentMethod === 'pix' ? 'Pix' : 'Card'}</p></div>
        </div>
      </section>

      <section className="mt-8 rounded-xl border-2 border-dashed border-line p-5" aria-labelledby="mail-t">
        <h2 id="mail-t" className="flex items-center gap-2 font-sans text-sm font-bold tracking-wide uppercase"><Mail aria-hidden size={16} />{t('emailPreview')}</h2>
        <div className="mt-3 rounded-md bg-white p-4 text-sm">
          <p className="font-bold">{t('emailSubject', { number: order.number })}</p>
          <p className="mt-3">{t('emailHello', { name: order.address.name.split(' ')[0] ?? '' })}</p>
          <p className="mt-2">{t('emailBody')}</p>
          <p className="mt-3 text-ink-soft">{t('emailSign')}</p>
        </div>
        <p className="mt-2 text-xs text-ink-soft">{t('emailNote')}</p>
      </section>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {customer && order.customerId === customer.id && <ButtonLink href={`/account/orders/${order.id}`} size="lg">{t('viewOrder')}</ButtonLink>}
        <ButtonLink href="/search" size="lg" variant="secondary">{t('continue')}</ButtonLink>
      </div>
      <span className="sr-only">{locale}</span>
    </div>
  );
}
