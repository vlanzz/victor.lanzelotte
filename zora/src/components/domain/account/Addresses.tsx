'use client';
import { newId } from '@/lib/id';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Address } from '@/domain/types';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { auth } from '@/services';
import { useSession } from '@/store/session';
import { useToasts } from '@/store/toast';

export function Addresses() {
  const t = useTranslations('account.addresses');
  const tc = useTranslations('common');
  const customer = useSession((s) => s.customer);
  const refresh = useSession((s) => s.refresh);
  const push = useToasts((s) => s.push);
  const [editing, setEditing] = useState<Address | 'new' | null>(null);
  if (!customer) return null;

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl">{t('title')}</h2>
        <Button size="sm" onClick={() => setEditing('new')}><Plus aria-hidden size={16} />{t('add')}</Button>
      </div>
      {customer.addresses.length === 0 && <p className="mt-6 text-ink-soft">{t('empty')}</p>}
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {customer.addresses.map((a) => (
          <li key={a.id} className="rounded-lg border-2 border-line bg-white p-4">
            <p className="font-bold">{a.label}</p>
            <address className="mt-1 text-sm not-italic leading-relaxed text-ink-soft">{a.name}<br />{a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />{a.city} - {a.state}, {a.postalCode} · {a.country}</address>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => setEditing(a)}><Pencil aria-hidden size={14} />{tc('edit')}</Button>
              <Button size="sm" variant="ghost" aria-label={`${tc('delete')}: ${a.label}`} onClick={async () => { if (window.confirm(t('confirmDelete'))) { await auth.deleteAddress(a.id); await refresh(); push({ tone: 'info', message: t('deleted') }); } }}><Trash2 aria-hidden size={14} />{tc('delete')}</Button>
            </div>
          </li>
        ))}
      </ul>
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? t('add') : t('edit')} closeLabel={tc('close')}>
        {editing && <AddressForm key={editing === 'new' ? 'new' : editing.id} initial={editing === 'new' ? null : editing} onDone={async () => { await refresh(); setEditing(null); push({ tone: 'success', message: t('saved') }); }} />}
      </Modal>
    </section>
  );
}

function AddressForm({ initial, onDone }: { initial: Address | null; onDone: () => void | Promise<void> }) {
  const t = useTranslations('account.addresses');
  const tf = useTranslations('forms');
  const tc = useTranslations('common');
  const schema = useMemo(() => z.object({
    label: z.string().trim().min(2, tf('required')), name: z.string().trim().min(3, tf('required')), line1: z.string().trim().min(4, tf('required')), line2: z.string().optional(),
    city: z.string().trim().min(2, tf('required')), state: z.string().trim().min(2, tf('invalidState')), postalCode: z.string().trim().min(3, tf('invalidCep')), country: z.string().trim().length(2, tf('required')),
  }), [tf]);
  type F = z.infer<typeof schema>;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema), defaultValues: initial ?? { label: '', name: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'BR' } });
  return (
    <form noValidate onSubmit={handleSubmit(async (v) => {
      const address: Address = { id: initial?.id ?? newId('adr'), label: v.label, name: v.name, line1: v.line1, ...(v.line2 ? { line2: v.line2 } : {}), city: v.city, state: v.state, postalCode: v.postalCode, country: v.country.toUpperCase() };
      await auth.saveAddress(address);
      await onDone();
    })} className="grid gap-3 sm:grid-cols-2">
      <TextField wrapperClassName="sm:col-span-2" label={t('label')} error={errors.label?.message} {...register('label')} />
      <TextField wrapperClassName="sm:col-span-2" label={t('name')} autoComplete="name" error={errors.name?.message} {...register('name')} />
      <TextField wrapperClassName="sm:col-span-2" label={t('line1')} autoComplete="address-line1" error={errors.line1?.message} {...register('line1')} />
      <TextField wrapperClassName="sm:col-span-2" label={t('line2')} {...register('line2')} />
      <TextField label={t('city')} error={errors.city?.message} {...register('city')} />
      <TextField label={t('state')} error={errors.state?.message} {...register('state')} />
      <TextField label={t('postalCode')} error={errors.postalCode?.message} {...register('postalCode')} />
      <TextField label={t('country')} maxLength={2} error={errors.country?.message} {...register('country')} />
      <div className="sm:col-span-2"><Button type="submit" loading={isSubmitting}>{tc('save')}</Button></div>
    </form>
  );
}
