'use client';
import { newId } from '@/lib/id';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CreditCard, Landmark } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { shippingConfig, type ShippingMethod } from '@/config/shipping';
import { shippingFor } from '@/domain/cart';
import { luhn, toOrderLines, validExpiry } from '@/domain/orders';
import type { Address, Locale } from '@/domain/types';
import { useCartView } from '@/hooks/useCartView';
import { useL10n } from '@/hooks/useL10n';
import { useMoney } from '@/hooks/useMoney';
import { Link, useRouter } from '@/i18n/navigation';
import { orderRepo, payments } from '@/services';
import { useCart } from '@/store/cart';
import { useHydration } from '@/store/hydration';
import { useSession } from '@/store/session';
import { Mockup } from '@/components/domain/mockup/Mockup';
import { Button, ButtonLink } from '@/components/ui/Button';
import { cn } from '@/components/ui/cn';
import { EmptyState } from '@/components/ui/EmptyState';
import { SelectField, TextField } from '@/components/ui/Field';
import { Skeleton } from '@/components/ui/Skeleton';
import { TotalsTable } from '../cart/OrderSummary';
import { ShoppingBag } from 'lucide-react';

const STEPS = ['identify', 'address', 'shipping', 'payment'] as const;
type Step = (typeof STEPS)[number];
const COUNTRIES = ['BR', 'US', 'PT', 'ES', 'GB'] as const;

type AddressForm = { name: string; phone: string; country: string; postalCode: string; line1: string; line2?: string | undefined; city: string; state: string };

export function CheckoutFlow() {
  const t = useTranslations('checkout');
  const tf = useTranslations('forms');
  const tc = useTranslations('cart');
  const tn = useTranslations('common');
  const l = useL10n();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { currency, format } = useMoney();
  const hydrated = useHydration((s) => s.done);
  const customer = useSession((s) => s.customer);
  const clear = useCart((s) => s.clear);

  const [step, setStep] = useState<Step>('identify');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState<AddressForm | null>(null);
  const [method, setMethod] = useState<ShippingMethod>('standard');
  const [paying, setPaying] = useState<'card' | 'pix'>('card');
  const [payError, setPayError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const view = useCartView(method);
  const { priced, coupon, totals } = view;
  const stepIndex = STEPS.indexOf(step);
  const effectiveEmail = customer?.email ?? email;

  if (!hydrated || completed) return <Skeleton className="h-96" />;
  if (priced.length === 0) {
    return <EmptyState icon={<ShoppingBag aria-hidden size={30} />} title={tc('emptyTitle')} text={t('emptyRedirect')} action={<ButtonLink href="/search">{tc('keepShopping')}</ButtonLink>} />;
  }

  const finish = async (card?: { number: string }) => {
    if (!address) return;
    setSubmitting(true);
    setPayError(null);
    const pay = await payments.pay({ amount: totals.total, currency, method: paying, email: effectiveEmail, ...(card ? { cardNumber: card.number } : {}) });
    if (!pay.ok) {
      setSubmitting(false);
      setPayError(pay.error === 'card_declined' ? t('payment.declined') : t('payment.unknown'));
      return;
    }
    const addr: Address = { id: newId('adr'), label: 'Entrega', name: address.name, line1: address.line1, ...(address.line2 ? { line2: address.line2 } : {}), city: address.city, state: address.state, postalCode: address.postalCode, country: address.country };
    const order = await orderRepo.create({
      customerId: customer?.id ?? null, email: effectiveEmail, currency, locale, lines: toOrderLines(priced),
      subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, total: totals.total, ...(coupon ? { couponCode: coupon.code } : {}),
      address: addr, shippingMethod: method, paymentMethod: paying,
    });
    setCompleted(true);
    clear();
    router.replace(`/checkout/confirmation?order=${order.id}${pay.pixCode ? `&pix=${encodeURIComponent(pay.pixCode)}` : ''}`);
  };

  const title = (s: Step, n: number) => (
    <h2 className="flex items-center gap-3 font-sans text-lg font-bold">
      <span className={cn('flex size-8 items-center justify-center rounded-full text-sm', n < stepIndex ? 'bg-mint text-white' : n === stepIndex ? 'bg-ink text-paper' : 'bg-paper-2 text-ink-soft')}>
        {n < stepIndex ? <Check aria-hidden size={16} /> : n + 1}
      </span>
      {t(`steps.${s}`)}
    </h2>
  );
  const summaryOf: Record<Step, string> = {
    identify: effectiveEmail,
    address: address ? `${address.name} · ${address.line1}, ${address.city}` : '',
    shipping: `${t(`shipping.${method}`)} · ${shippingFor(currency, method, totals.subtotal) === 0 ? t('shipping.free') : format(shippingFor(currency, method, totals.subtotal))}`,
    payment: '',
  };

  const summary = (
      <aside className="rounded-xl bg-paper-2 p-5 lg:sticky lg:top-24" aria-label={t('summary')}>
        <details className="group lg:[&_summary]:hidden" open>
          <summary className="flex cursor-pointer list-none items-center justify-between font-bold lg:hidden">{t('showSummary')}<span aria-hidden className="transition group-open:rotate-45">+</span></summary>
          <h2 className="mb-4 hidden text-2xl lg:block">{t('summary')}</h2>
          <ul className="my-4 space-y-3 lg:mt-0">
            {priced.map((p) => (
              <li key={p.line.id} className="flex items-center gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-white"><Mockup type={p.entry.type} product={p.entry.product} selection={p.selection} art={p.entry.art} label="" className="size-full" /><span className="absolute -top-0 -right-0 rounded-bl-md bg-ink px-1.5 text-xs font-bold text-paper">{p.qty}</span></div>
                <p className="min-w-0 flex-1 text-sm font-semibold">{l(p.entry.name)}</p>
                <p className="text-sm font-bold">{format(p.unitPrice * p.qty)}</p>
              </li>
            ))}
          </ul>
          {coupon && <p className="mb-3 rounded-md bg-mint-soft px-3 py-2 text-sm font-semibold text-mint-text">{coupon.code}</p>}
          <TotalsTable totals={totals} />
          <Link href="/cart" className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">{t('backToCart')}</Link>
        </details>
      </aside>
  );

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_26rem]">
      <ol className="space-y-4">
        {STEPS.map((s, n) => (
          <li key={s} className="rounded-xl border-2 border-line bg-white p-5" aria-current={s === step ? 'step' : undefined}>
            <div className="flex items-start justify-between gap-3">
              <div>
                {title(s, n)}
                {n < stepIndex && <p className="mt-1 pl-11 text-sm text-ink-soft">{summaryOf[s]}</p>}
              </div>
              {n < stepIndex && <button type="button" className="min-h-9 text-sm font-bold text-sun-dark underline underline-offset-4" onClick={() => setStep(s)}>{t('edit')}</button>}
            </div>

            {s === step && s === 'identify' && (
              <IdentifyStep initialEmail={email} onDone={(e) => { setEmail(e); setStep('address'); }} />
            )}
            {s === step && s === 'address' && (
              <AddressStep initial={address} customerName={customer?.name} saved={customer?.addresses[0]} onDone={(a) => { setAddress(a); setStep('shipping'); }} />
            )}
            {s === step && s === 'shipping' && (
              <fieldset className="mt-4 pl-0 md:pl-11">
                <legend className="sr-only">{t('shipping.title')}</legend>
                <div className="space-y-3">
                  {(['standard', 'express'] as const).map((m) => {
                    const price = shippingFor(currency, m, totals.subtotal);
                    const [min, max] = shippingConfig[currency].methods[m].days;
                    return (
                      <label key={m} className={cn('flex cursor-pointer items-center justify-between gap-4 rounded-lg border-2 p-4 transition', method === m ? 'border-ink bg-honey-soft' : 'border-line hover:border-ink/40')}>
                        <span className="flex items-center gap-3"><input type="radio" name="ship" className="size-5 accent-[var(--color-sun)]" checked={method === m} onChange={() => setMethod(m)} /><span><span className="block font-bold">{t(`shipping.${m}`)}</span><span className="text-sm text-ink-soft">{t('shipping.days', { min, max })}</span></span></span>
                        <span className="font-bold">{price === 0 ? t('shipping.free') : format(price)}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="mt-3 text-sm text-ink-soft">{t('shipping.note')}</p>
                <Button className="mt-5" size="lg" onClick={() => setStep('payment')}>{tn('next')}</Button>
              </fieldset>
            )}
            {s === step && s === 'payment' && (
              <PaymentStep method={paying} onMethod={setPaying} submitting={submitting} error={payError} total={format(totals.total)} onPay={finish} />
            )}
          </li>
        ))}
      </ol>
      {summary}
    </div>
  );
}

/* ---------- Etapas ---------- */

function IdentifyStep({ initialEmail, onDone }: { initialEmail: string; onDone: (email: string) => void }) {
  const t = useTranslations('checkout.identify');
  const tf = useTranslations('forms');
  const customer = useSession((s) => s.customer);
  const schema = useMemo(() => z.object({ email: z.string().min(1, tf('required')).pipe(z.email(tf('invalidEmail'))) }), [tf]);
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>({ resolver: zodResolver(schema), defaultValues: { email: initialEmail } });
  const tn = useTranslations('common');
  if (customer) {
    return (
      <div className="mt-4 md:pl-11">
        <p className="rounded-md bg-mint-soft p-3 text-sm font-semibold text-mint-text">{t('loggedAs', { name: customer.name, email: customer.email })}</p>
        <Button className="mt-5" size="lg" onClick={() => onDone(customer.email)}>{tn('next')}</Button>
      </div>
    );
  }
  return (
    <form noValidate onSubmit={handleSubmit((v) => onDone(v.email))} className="mt-4 space-y-4 md:pl-11">
      <TextField label={t('email')} type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
      <p className="text-sm text-ink-soft">{t('guestNote')} {t('haveAccount')} <Link href="/login?next=/checkout" className="font-bold underline underline-offset-4">{t('login')}</Link></p>
      <Button type="submit" size="lg">{tn('next')}</Button>
    </form>
  );
}

function AddressStep({ initial, customerName, saved, onDone }: { initial: AddressForm | null; customerName: string | undefined; saved: Address | undefined; onDone: (a: AddressForm) => void }) {
  const t = useTranslations('checkout.address');
  const tf = useTranslations('forms');
  const tn = useTranslations('common');
  const schema = useMemo(() => z.object({
    name: z.string().trim().min(3, tf('required')),
    phone: z.string().refine((v) => v.replace(/\D/g, '').length >= 8, tf('invalidPhone')),
    country: z.string().min(2),
    postalCode: z.string().trim().min(3, tf('invalidCep')),
    line1: z.string().trim().min(4, tf('required')),
    line2: z.string().optional(),
    city: z.string().trim().min(2, tf('required')),
    state: z.string().trim().min(2, tf('invalidState')),
  }).superRefine((v, ctx) => {
    if (v.country === 'BR' && !/^\d{5}-?\d{3}$/.test(v.postalCode.trim())) ctx.addIssue({ code: 'custom', path: ['postalCode'], message: tf('invalidCep') });
  }), [tf]);
  const defaults: AddressForm = initial ?? (saved
    ? { name: saved.name, phone: '', country: saved.country, postalCode: saved.postalCode, line1: saved.line1, line2: saved.line2, city: saved.city, state: saved.state }
    : { name: customerName ?? '', phone: '', country: 'BR', postalCode: '', line1: '', city: '', state: '' });
  const { register, handleSubmit, formState: { errors } } = useForm<AddressForm>({ resolver: zodResolver(schema), defaultValues: defaults });
  return (
    <form noValidate onSubmit={handleSubmit(onDone)} className="mt-4 grid gap-4 sm:grid-cols-2 md:pl-11">
      <TextField wrapperClassName="sm:col-span-2" label={t('name')} autoComplete="name" error={errors.name?.message} {...register('name')} />
      <TextField label={t('phone')} type="tel" autoComplete="tel" inputMode="tel" error={errors.phone?.message} {...register('phone')} />
      <SelectField label={t('country')} autoComplete="country" error={errors.country?.message} {...register('country')}>
        {COUNTRIES.map((c) => <option key={c} value={c}>{t(c)}</option>)}
      </SelectField>
      <TextField label={t('postalCode')} autoComplete="postal-code" inputMode="text" error={errors.postalCode?.message} {...register('postalCode')} />
      <TextField label={t('line1')} autoComplete="address-line1" error={errors.line1?.message} {...register('line1')} />
      <TextField wrapperClassName="sm:col-span-2" label={t('line2')} autoComplete="address-line2" {...register('line2')} />
      <TextField label={t('city')} autoComplete="address-level2" error={errors.city?.message} {...register('city')} />
      <TextField label={t('state')} autoComplete="address-level1" error={errors.state?.message} {...register('state')} />
      <div className="sm:col-span-2"><Button type="submit" size="lg">{tn('next')}</Button></div>
    </form>
  );
}

const fmtCard = (v: string) => v.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
const fmtExp = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };

function PaymentStep({ method, onMethod, submitting, error, total, onPay }: { method: 'card' | 'pix'; onMethod: (m: 'card' | 'pix') => void; submitting: boolean; error: string | null; total: string; onPay: (card?: { number: string }) => void }) {
  const t = useTranslations('checkout.payment');
  const tf = useTranslations('forms');
  const schema = useMemo(() => z.object({
    number: z.string().refine(luhn, tf('invalidCard')),
    name: z.string().trim().min(3, tf('required')),
    expiry: z.string().refine((v) => validExpiry(v), tf('invalidExpiry')),
    cvv: z.string().regex(/^\d{3,4}$/, tf('invalidCvv')),
  }), [tf]);
  type F = z.infer<typeof schema>;
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema) });
  const tab = (m: 'card' | 'pix') => cn('flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 font-bold transition', method === m ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink/40');
  return (
    <div className="mt-4 md:pl-11">
      <div role="radiogroup" aria-label={t('title')} className="flex gap-3">
        <button type="button" role="radio" aria-checked={method === 'card'} className={tab('card')} onClick={() => onMethod('card')}><CreditCard aria-hidden size={18} />{t('card')}</button>
        <button type="button" role="radio" aria-checked={method === 'pix'} className={tab('pix')} onClick={() => onMethod('pix')}><Landmark aria-hidden size={18} />{t('pix')}</button>
      </div>
      {error && <p role="alert" className="mt-4 rounded-md bg-error-soft p-3 text-sm font-semibold text-error">{error}</p>}
      {method === 'card' ? (
        <form noValidate onSubmit={handleSubmit((v) => onPay({ number: v.number }))} className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextField wrapperClassName="sm:col-span-2" label={t('cardNumber')} inputMode="numeric" autoComplete="cc-number" error={errors.number?.message} {...register('number', { onChange: (e) => setValue('number', fmtCard(e.target.value)) })} />
          <TextField wrapperClassName="sm:col-span-2" label={t('cardName')} autoComplete="cc-name" error={errors.name?.message} {...register('name')} />
          <TextField label={t('expiry')} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" error={errors.expiry?.message} {...register('expiry', { onChange: (e) => setValue('expiry', fmtExp(e.target.value)) })} />
          <TextField label={t('cvv')} inputMode="numeric" autoComplete="cc-csc" error={errors.cvv?.message} {...register('cvv')} />
          <p className="text-sm text-ink-soft sm:col-span-2">{t('testCard')}</p>
          <div className="sm:col-span-2"><Button type="submit" size="lg" full loading={submitting}>{submitting ? t('processing') : t('pay', { value: total })}</Button></div>
        </form>
      ) : (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-ink-soft">{t('pixInfo')}</p>
          <Button size="lg" full loading={submitting} onClick={() => onPay()}>{submitting ? t('processing') : t('pay', { value: total })}</Button>
        </div>
      )}
      <p className="mt-4 text-center text-xs text-ink-soft">{t('demo')}</p>
    </div>
  );
}
