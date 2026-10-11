'use client';
import { Tag, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { normalizeCode, validateCoupon, type CouponError } from '@/domain/coupons';
import type { Cents, Coupon } from '@/domain/types';
import { useL10n } from '@/hooks/useL10n';
import { useMoney } from '@/hooks/useMoney';
import { Button } from '@/components/ui/Button';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { useCart } from '@/store/cart';

export function CouponBox({ subtotal, applied, invalid }: { subtotal: Cents; applied: Coupon | null; invalid: { reason: CouponError; min?: Cents | undefined } | null }) {
  const t = useTranslations('cart');
  const l = useL10n();
  const { currency, format } = useMoney();
  const { coupons } = useCatalog();
  const setCoupon = useCart((s) => s.setCoupon);
  const code = useCart((s) => s.couponCode);
  const [value, setValue] = useState('');
  const [error, setError] = useState<{ reason: CouponError; min?: Cents | undefined } | null>(null);

  const message = (e: { reason: CouponError; min?: Cents | undefined }) => t(`couponErrors.${e.reason}`, { min: e.min !== undefined ? format(e.min) : '' });

  const apply = () => {
    const r = validateCoupon(value, coupons, { subtotal, currency });
    if (!r.ok) return setError(r);
    setError(null);
    setCoupon(r.coupon.code);
    setValue('');
  };

  return (
    <div>
      <h3 className="mb-2 font-sans text-sm font-bold">{t('coupon')}</h3>
      {applied ? (
        <div className="flex items-center justify-between gap-3 rounded-md bg-mint-soft px-3 py-2 text-sm text-mint-text">
          <p role="status" className="flex items-start gap-2 font-semibold"><Tag aria-hidden size={16} className="mt-0.5 shrink-0" />{t('couponApplied', { code: applied.code, description: l(applied.description) })}</p>
          <button type="button" aria-label={t('removeCoupon')} title={t('removeCoupon')} onClick={() => setCoupon(null)} className="rounded-full p-1 hover:bg-mint/20"><X aria-hidden size={16} /></button>
        </div>
      ) : (
        <form noValidate onSubmit={(e) => { e.preventDefault(); apply(); }}>
          <div className="flex gap-2">
            <input aria-label={t('coupon')} aria-invalid={!!error} aria-describedby="coupon-msg" placeholder={t('couponPlaceholder')} value={value} onChange={(e) => { setValue(normalizeCode(e.target.value)); setError(null); }} className="min-h-11 min-w-0 flex-1 rounded-md border-2 border-line bg-white px-3 uppercase placeholder:normal-case focus:border-lavender-text focus:ring-4 focus:ring-lavender/25 focus:outline-none aria-[invalid=true]:border-error" />
            <Button type="submit" variant="secondary">{t('applyCoupon')}</Button>
          </div>
          <p id="coupon-msg" role={error || invalid ? 'alert' : undefined} className="mt-2 text-sm">
            {error ? <span className="font-medium text-error">{message(error)}</span> : invalid && code ? <span className="font-medium text-error">{t('couponInvalidNow', { code })}{message(invalid)}</span> : <span className="text-ink-soft">{t('couponHint')}</span>}
          </p>
        </form>
      )}
    </div>
  );
}
