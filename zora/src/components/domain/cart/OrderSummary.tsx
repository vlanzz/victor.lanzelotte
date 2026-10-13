'use client';
import { useTranslations } from 'next-intl';
import type { Totals } from '@/domain/cart';
import { useMoney } from '@/hooks/useMoney';

export function TotalsTable({ totals, shippingOverride }: { totals: Totals; shippingOverride?: React.ReactNode }) {
  const t = useTranslations('cart');
  const { format } = useMoney();
  const row = 'flex justify-between gap-4';
  return (
    <dl className="space-y-2 text-[0.95rem]">
      <div className={row}><dt>{t('subtotal')}</dt><dd className="font-semibold">{format(totals.subtotal)}</dd></div>
      {totals.discount > 0 && <div className={`${row} text-mint-text`}><dt>{t('discount')}</dt><dd className="font-semibold">− {format(totals.discount)}</dd></div>}
      <div className={row}><dt>{t('shipping')}</dt><dd className="font-semibold">{shippingOverride ?? (totals.shipping === 0 ? t('shippingFree') : format(totals.shipping))}</dd></div>
      <div className={`${row} border-t border-line pt-3 text-lg`}><dt className="font-bold">{t('total')}</dt><dd className="font-display text-2xl font-semibold">{format(totals.total)}</dd></div>
    </dl>
  );
}
