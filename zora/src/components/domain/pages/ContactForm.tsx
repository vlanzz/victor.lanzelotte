'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/Button';
import { SelectField, TextArea, TextField } from '@/components/ui/Field';

export function ContactForm() {
  const t = useTranslations('pages.contact');
  const tf = useTranslations('forms');
  const [sent, setSent] = useState(false);
  const schema = useMemo(() => z.object({
    name: z.string().trim().min(2, tf('required')),
    email: z.string().min(1, tf('required')).pipe(z.email(tf('invalidEmail'))),
    subject: z.enum(['order', 'product', 'partnership', 'other']),
    message: z.string().trim().min(10, tf('minLength')),
  }), [tf]);
  type F = z.infer<typeof schema>;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema), defaultValues: { subject: 'order' } });
  if (sent) return <p role="status" className="rounded-lg bg-mint-soft p-5 font-semibold text-mint-text">{t('sent')}</p>;
  return (
    <form noValidate onSubmit={handleSubmit(async () => { await new Promise((r) => setTimeout(r, 600)); setSent(true); })} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label={t('name')} autoComplete="name" error={errors.name?.message} {...register('name')} />
        <TextField label={t('email')} type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
      </div>
      <SelectField label={t('subject')} error={errors.subject?.message} {...register('subject')}>
        {(['order', 'product', 'partnership', 'other'] as const).map((s) => <option key={s} value={s}>{t(`subjects.${s}`)}</option>)}
      </SelectField>
      <TextArea label={t('message')} rows={6} error={errors.message?.message} {...register('message')} />
      <Button type="submit" size="lg" loading={isSubmitting}>{t('send')}</Button>
      <p className="text-sm text-ink-soft">{t('emailLine', { email: siteConfig.contactEmail })}</p>
    </form>
  );
}
