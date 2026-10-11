'use client';
import { Check, Circle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Order, OrderStatus } from '@/domain/types';
import { formatMoney } from '@/domain/money';
import { useL10n } from '@/hooks/useL10n';
import { useLocale } from 'next-intl';
import type { Locale } from '@/domain/types';
import { cn } from '@/components/ui/cn';
import { Badge } from '@/components/ui/Badge';

const FLOW: OrderStatus[] = ['pending', 'paid', 'in_production', 'shipped', 'delivered'];

export function StatusBadge({ status }: { status: OrderStatus }) {
  const t = useTranslations('order.status');
  const tone = { pending: 'honey', paid: 'mint', in_production: 'lavender', shipped: 'lavender', delivered: 'mint', cancelled: 'error' } as const;
  return <Badge tone={tone[status]}>{t(status)}</Badge>;
}

/** Linha do tempo do pedido. */
export function OrderTimeline({ order }: { order: Order }) {
  const t = useTranslations('order.status');
  const locale = useLocale() as Locale;
  const cancelled = order.status === 'cancelled';
  const steps = cancelled ? ([...order.history.map((h) => h.status)] as OrderStatus[]) : FLOW;
  const at = (s: OrderStatus) => order.history.find((h) => h.status === s)?.at;
  const idx = FLOW.indexOf(order.status);
  return (
    <ol className="space-y-0">
      {steps.map((s, i) => {
        const reached = cancelled || FLOW.indexOf(s) <= idx;
        const when = at(s);
        return (
          <li key={s} className="relative flex gap-4 pb-6 last:pb-0">
            {i < steps.length - 1 && <span aria-hidden className={cn('absolute top-7 left-[13px] h-[calc(100%-1.75rem)] w-0.5', reached ? 'bg-mint' : 'bg-line')} />}
            <span className={cn('relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full', s === 'cancelled' ? 'bg-error text-white' : reached ? 'bg-mint text-white' : 'bg-paper-2 text-ink-soft')}>
              {reached ? <Check aria-hidden size={14} /> : <Circle aria-hidden size={10} />}
            </span>
            <div>
              <p className={cn('font-semibold', !reached && 'text-ink-soft')}>{t(s)}</p>
              {when && <p className="text-sm text-ink-soft">{new Date(when).toLocaleString(locale === 'pt' ? 'pt-BR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function OrderLines({ order }: { order: Order }) {
  const l = useL10n();
  const locale = useLocale() as Locale;
  const fmt = (n: number) => formatMoney(n, order.currency, locale);
  return (
    <ul className="divide-y divide-line">
      {order.lines.map((ln, i) => (
        <li key={i} className="flex items-center gap-4 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ln.artFile} alt="" loading="lazy" className="size-16 shrink-0 rounded-md bg-paper-2 object-cover" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{l(ln.name)}</p>
            <p className="text-sm text-ink-soft">{l(ln.optionsLabel)} · ×{ln.qty}</p>
          </div>
          <p className="font-bold">{fmt(ln.unitPrice * ln.qty)}</p>
        </li>
      ))}
    </ul>
  );
}

export function OrderTotals({ order }: { order: Order }) {
  const t = useTranslations('cart');
  const locale = useLocale() as Locale;
  const fmt = (n: number) => formatMoney(n, order.currency, locale);
  return (
    <dl className="space-y-1.5 text-sm">
      <div className="flex justify-between"><dt>{t('subtotal')}</dt><dd>{fmt(order.subtotal)}</dd></div>
      {order.discount > 0 && <div className="flex justify-between text-mint-text"><dt>{t('discount')}{order.couponCode ? ` (${order.couponCode})` : ''}</dt><dd>− {fmt(order.discount)}</dd></div>}
      <div className="flex justify-between"><dt>{t('shipping')}</dt><dd>{order.shipping === 0 ? t('shippingFree') : fmt(order.shipping)}</dd></div>
      <div className="flex justify-between border-t border-line pt-2 text-base font-bold"><dt>{t('total')}</dt><dd>{fmt(order.total)}</dd></div>
    </dl>
  );
}

export function AddressBlock({ order }: { order: Order }) {
  const a = order.address;
  return (
    <address className="text-sm not-italic leading-relaxed">
      {a.name}<br />{a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />{a.city} - {a.state}, {a.postalCode} · {a.country}
    </address>
  );
}
