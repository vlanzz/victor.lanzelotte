'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';

/** Newsletter simulada: valida o e-mail e mostra a confirmação (nada é enviado). */
export function Newsletter() {
  const t = useTranslations('home');
  const tf = useTranslations('forms');
  const [done, setDone] = useState(false);
  const schema = z.object({ email: z.string().min(1, tf('required')).pipe(z.email(tf('invalidEmail'))) });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>({ resolver: zodResolver(schema) });
  return (
    <section className="container-page" aria-labelledby="news-title">
      <div className="relative overflow-hidden rounded-xl bg-ink px-6 py-12 text-paper md:px-14 md:py-16">
        <div aria-hidden className="absolute -right-16 -bottom-24 size-72 rounded-full bg-sun opacity-90" />
        <div aria-hidden className="absolute -right-6 -bottom-12 size-48 rounded-full bg-honey" />
        <div className="relative max-w-lg">
          <h2 id="news-title" className="text-3xl md:text-4xl">{t('newsletterTitle')}</h2>
          <p className="mt-3 text-paper/80">{t('newsletterText')}</p>
          {done ? (
            <p role="status" className="mt-6 rounded-md bg-paper/10 p-4 font-semibold">{t('newsletterThanks')}</p>
          ) : (
            <form noValidate onSubmit={handleSubmit(async () => { await new Promise((r) => setTimeout(r, 500)); setDone(true); })} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex-1 text-ink">
                <TextField label={t('newsletterEmail')} type="email" autoComplete="email" error={errors.email?.message} {...register('email')} className="!border-transparent" wrapperClassName="[&>label]:text-paper" />
              </div>
              <Button type="submit" loading={isSubmitting} className="sm:mt-[1.75rem]">{t('newsletterButton')}</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
