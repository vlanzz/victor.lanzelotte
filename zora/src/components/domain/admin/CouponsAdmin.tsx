'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { formatMoney } from '@/domain/money';
import { normalizeCode } from '@/domain/coupons';
import type { Coupon, Locale } from '@/domain/types';
import { catalogRepo } from '@/services';
import { useToasts } from '@/store/toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Checkbox, SelectField, TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Table, Td, Th } from '@/components/ui/Table';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { AdminHeader } from './AdminShell';

export function CouponsAdmin() {
  const t = useTranslations('admin.coupons');
  const tc = useTranslations('admin.common');
  const tcm = useTranslations('common');
  const locale = useLocale() as Locale;
  const { coupons, refresh } = useCatalog();
  const push = useToasts((s) => s.push);
  const [editing, setEditing] = useState<Coupon | 'new' | null>(null);
  const valueOf = (c: Coupon) => (c.type === 'percent' ? `${c.value}%` : c.type === 'fixed' ? formatMoney(c.value, c.currency ?? 'BRL', locale) : '—');
  return (
    <div>
      <AdminHeader title={t('title')} actions={<Button onClick={() => setEditing('new')}><Plus aria-hidden size={18} />{t('new')}</Button>} />
      <Table caption={t('title')}>
        <thead><tr><Th>{t('col.code')}</Th><Th>{t('col.type')}</Th><Th>{t('col.value')}</Th><Th>{t('col.min')}</Th><Th>{t('col.expires')}</Th><Th>{t('col.uses')}</Th><Th>{t('col.active')}</Th><Th>{tc('actions')}</Th></tr></thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c.code}>
              <Td className="font-mono font-bold">{c.code}</Td>
              <Td>{t(`types.${c.type}`)}</Td>
              <Td>{valueOf(c)}</Td>
              <Td>{c.minSubtotal !== undefined ? formatMoney(c.minSubtotal, c.currency ?? 'BRL', locale) : '—'}</Td>
              <Td>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US') : '—'}</Td>
              <Td>{c.uses}/{c.maxUses ?? t('unlimited')}</Td>
              <Td><Badge tone={c.active ? 'mint' : 'neutral'}>{c.active ? tc('yes') : tc('no')}</Badge></Td>
              <Td>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="secondary" aria-label={`${tc('edit')} ${c.code}`} onClick={() => setEditing(c)}><Pencil aria-hidden size={14} /></Button>
                  <Button size="sm" variant="ghost" aria-label={`${tc('delete')} ${c.code}`} onClick={async () => { if (window.confirm(tc('confirmDelete', { name: c.code }))) { await catalogRepo.deleteCoupon(c.code); await refresh(); push({ tone: 'info', message: tc('deleted') }); } }}><Trash2 aria-hidden size={14} /></Button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? t('new') : t('edit')} closeLabel={tcm('close')}>
        {editing && <CouponForm key={editing === 'new' ? 'new' : editing.code} initial={editing === 'new' ? null : editing} existing={coupons.map((c) => c.code)} onDone={async () => { await refresh(); setEditing(null); push({ tone: 'success', message: tc('saved') }); }} />}
      </Modal>
    </div>
  );
}

function CouponForm({ initial, existing, onDone }: { initial: Coupon | null; existing: string[]; onDone: () => void | Promise<void> }) {
  const t = useTranslations('admin.coupons');
  const tc = useTranslations('admin.common');
  const num = z.union([z.literal(''), z.coerce.number().min(0, tc('number'))]);
  const schema = useMemo(() => z.object({
    code: z.string().trim().min(3, tc('required')),
    type: z.enum(['percent', 'fixed', 'freeShipping']),
    value: num, currency: z.enum(['', 'BRL', 'USD']), min: num, expires: z.string(), maxUses: num,
    descPt: z.string().trim().min(3, tc('required')), descEn: z.string().trim().min(3, tc('required')), active: z.boolean(),
  }).superRefine((v, ctx) => {
    if (!initial && existing.includes(normalizeCode(v.code))) ctx.addIssue({ code: 'custom', path: ['code'], message: t('form.codeTaken') });
    if (v.type === 'percent' && (Number(v.value) < 1 || Number(v.value) > 100 || v.value === '')) ctx.addIssue({ code: 'custom', path: ['value'], message: t('form.percentRange') });
    if (v.type === 'fixed' && (v.value === '' || Number(v.value) <= 0)) ctx.addIssue({ code: 'custom', path: ['value'], message: tc('number') });
  }), [tc, t, initial, existing, num]);
  type In = z.input<typeof schema>;
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<In, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? { code: initial.code, type: initial.type, value: initial.type === 'percent' ? initial.value : initial.type === 'fixed' ? initial.value / 100 : '', currency: initial.currency ?? '', min: initial.minSubtotal !== undefined ? initial.minSubtotal / 100 : '', expires: initial.expiresAt?.slice(0, 10) ?? '', maxUses: initial.maxUses ?? '', descPt: initial.description.pt, descEn: initial.description.en, active: initial.active }
      : { code: '', type: 'percent', value: '', currency: '', min: '', expires: '', maxUses: '', descPt: '', descEn: '', active: true },
  });
  const type = useWatch({ control, name: 'type' });
  return (
    <form noValidate onSubmit={handleSubmit(async (v) => {
      const value = v.type === 'percent' ? Number(v.value) : v.type === 'fixed' ? Math.round(Number(v.value) * 100) : 0;
      const coupon: Coupon = {
        code: normalizeCode(v.code), type: v.type, value, description: { pt: v.descPt, en: v.descEn }, uses: initial?.uses ?? 0, active: v.active,
        ...(v.currency ? { currency: v.currency } : {}), ...(v.min !== '' ? { minSubtotal: Math.round(Number(v.min) * 100) } : {}),
        ...(v.expires ? { expiresAt: `${v.expires}T23:59:59Z` } : {}), ...(v.maxUses !== '' ? { maxUses: Number(v.maxUses) } : {}),
      };
      await catalogRepo.saveCoupon(coupon);
      await onDone();
    })} className="grid gap-3 sm:grid-cols-2">
      <TextField label={t('form.code')} disabled={!!initial} error={errors.code?.message} {...register('code')} />
      <SelectField label={t('form.type')} {...register('type')}>{(['percent', 'fixed', 'freeShipping'] as const).map((k) => <option key={k} value={k}>{t(`types.${k}`)}</option>)}</SelectField>
      {type !== 'freeShipping' && <TextField label={t('form.value')} inputMode="decimal" error={errors.value?.message as string | undefined} {...register('value')} />}
      <SelectField label={t('form.currency')} {...register('currency')}><option value="">{t('form.anyCurrency')}</option><option value="BRL">BRL</option><option value="USD">USD</option></SelectField>
      <TextField label={t('form.min')} inputMode="decimal" error={errors.min?.message as string | undefined} {...register('min')} />
      <TextField label={t('form.expires')} type="date" {...register('expires')} />
      <TextField label={t('form.maxUses')} inputMode="numeric" error={errors.maxUses?.message as string | undefined} {...register('maxUses')} />
      <div />
      <TextField label={t('form.descPt')} error={errors.descPt?.message} {...register('descPt')} />
      <TextField label={t('form.descEn')} error={errors.descEn?.message} {...register('descEn')} />
      <Checkbox className="sm:col-span-2" label={t('form.active')} {...register('active')} />
      <div className="sm:col-span-2"><Button type="submit" loading={isSubmitting}>{tc('save')}</Button></div>
    </form>
  );
}
