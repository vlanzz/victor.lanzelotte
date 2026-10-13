'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { auth } from '@/services';
import { useSession } from '@/store/session';
import { useToasts } from '@/store/toast';

export function Profile() {
  const t = useTranslations('account.profile');
  const tf = useTranslations('forms');
  const ta = useTranslations('auth');
  const tc = useTranslations('common');
  const locale = useLocale();
  const customer = useSession((s) => s.customer);
  const refresh = useSession((s) => s.refresh);
  const push = useToasts((s) => s.push);
  const schema = useMemo(() => z.object({ name: z.string().trim().min(3, tf('required')), email: z.string().min(1, tf('required')).pipe(z.email(tf('invalidEmail'))) }), [tf]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ name: string; email: string }>({ resolver: zodResolver(schema), defaultValues: { name: customer?.name ?? '', email: customer?.email ?? '' } });
  if (!customer) return null;
  return (
    <section>
      <h2 className="text-2xl">{t('title')}</h2>
      <p className="mt-1 text-sm text-ink-soft">{t('since', { date: new Date(customer.createdAt).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US') })}</p>
      <form noValidate onSubmit={handleSubmit(async (v) => { await auth.updateProfile(v); await refresh(); push({ tone: 'success', message: t('saved') }); })} className="mt-6 max-w-md space-y-4">
        <TextField label={ta('name')} autoComplete="name" error={errors.name?.message} {...register('name')} />
        <TextField label={ta('email')} type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Button type="submit" loading={isSubmitting}>{tc('save')}</Button>
      </form>
    </section>
  );
}
