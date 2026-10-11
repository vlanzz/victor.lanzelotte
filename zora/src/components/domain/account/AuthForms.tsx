'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Checkbox, TextField } from '@/components/ui/Field';
import { Link, useRouter } from '@/i18n/navigation';
import { auth } from '@/services';
import { useSession } from '@/store/session';

/** Só aceita caminhos internos (evita redirecionar para sites externos). */
const safeNext = (v: string | null) => (v && v.startsWith('/') && !v.startsWith('//') ? v : null);

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md rounded-xl border-2 border-line bg-white p-6 shadow-soft md:p-8">
      <h1 className="mb-6 text-3xl">{title}</h1>
      {children}
    </div>
  );
}

export function LoginForm() {
  const t = useTranslations('auth');
  const tf = useTranslations('forms');
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const refresh = useSession((s) => s.refresh);
  const [error, setError] = useState<string | null>(null);
  const schema = useMemo(() => z.object({ email: z.string().min(1, tf('required')).pipe(z.email(tf('invalidEmail'))), password: z.string().min(1, tf('required')) }), [tf]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string; password: string }>({ resolver: zodResolver(schema) });

  const signIn = async (email: string, password: string, to?: string) => {
    const r = await auth.login(email, password);
    if (!r.ok) return setError(t('invalid'));
    await refresh();
    router.push(to ?? next ?? '/account');
  };

  return (
    <Card title={t('loginTitle')}>
      <form noValidate onSubmit={handleSubmit((v) => signIn(v.email, v.password))} className="space-y-4">
        {error && <p role="alert" className="rounded-md bg-error-soft p-3 text-sm font-semibold text-error">{error}</p>}
        <TextField label={t('email')} type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <TextField label={t('password')} type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
        <Button type="submit" size="lg" full loading={isSubmitting}>{t('login')}</Button>
        <p className="text-center text-sm"><Link href="/forgot-password" className="font-semibold underline underline-offset-4">{t('forgot')}</Link></p>
      </form>
      <p className="mt-5 text-center text-sm">{t('noAccount')} <Link href={next ? `/register?next=${encodeURIComponent(next)}` : '/register'} className="font-bold text-sun-dark underline underline-offset-4">{t('register')}</Link></p>
      <div className="mt-6 rounded-lg bg-paper-2 p-4">
        <p className="text-sm font-bold">{t('demoTitle')}</p>
        <p className="mt-1 text-xs text-ink-soft">{t('demoHint')}</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => signIn('ana@zora.demo', 'demo1234')}>{t('demoCustomer')}</Button>
          <Button variant="dark" size="sm" className="flex-1" onClick={() => signIn('admin@zora.demo', 'admin1234', '/admin')}>{t('demoAdmin')}</Button>
        </div>
      </div>
    </Card>
  );
}

export function RegisterForm() {
  const t = useTranslations('auth');
  const tf = useTranslations('forms');
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const refresh = useSession((s) => s.refresh);
  const [error, setError] = useState<string | null>(null);
  const schema = useMemo(() => z.object({
    name: z.string().trim().min(3, tf('required')),
    email: z.string().min(1, tf('required')).pipe(z.email(tf('invalidEmail'))),
    password: z.string().min(8, tf('minPassword')),
    confirm: z.string(),
    terms: z.literal(true, { error: tf('terms') }),
  }).refine((v) => v.password === v.confirm, { path: ['confirm'], message: tf('passwordMismatch'), when: () => true }), [tf]);
  type F = z.infer<typeof schema>;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema) });
  return (
    <Card title={t('registerTitle')}>
      <form noValidate onSubmit={handleSubmit(async (v) => {
        const r = await auth.register({ name: v.name, email: v.email, password: v.password });
        if (!r.ok) return setError(t('emailTaken'));
        await refresh();
        router.push(next ?? '/account');
      })} className="space-y-4">
        {error && <p role="alert" className="rounded-md bg-error-soft p-3 text-sm font-semibold text-error">{error}</p>}
        <TextField label={t('name')} autoComplete="name" error={errors.name?.message} {...register('name')} />
        <TextField label={t('email')} type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <TextField label={t('password')} type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
        <TextField label={t('confirm')} type="password" autoComplete="new-password" error={errors.confirm?.message} {...register('confirm')} />
        <Checkbox label={t('terms')} error={errors.terms?.message} {...register('terms')} />
        <Button type="submit" size="lg" full loading={isSubmitting}>{t('register')}</Button>
      </form>
      <p className="mt-5 text-center text-sm">{t('haveAccount')} <Link href="/login" className="font-bold text-sun-dark underline underline-offset-4">{t('login')}</Link></p>
    </Card>
  );
}

export function ForgotForm() {
  const t = useTranslations('auth');
  const tf = useTranslations('forms');
  const [sent, setSent] = useState(false);
  const schema = useMemo(() => z.object({ email: z.string().min(1, tf('required')).pipe(z.email(tf('invalidEmail'))) }), [tf]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>({ resolver: zodResolver(schema) });
  return (
    <Card title={t('forgotTitle')}>
      {sent ? (
        <p role="status" className="rounded-md bg-mint-soft p-4 font-semibold text-mint-text">{t('forgotSent')}</p>
      ) : (
        <form noValidate onSubmit={handleSubmit(async (v) => { await auth.requestPasswordReset(v.email); setSent(true); })} className="space-y-4">
          <p className="text-ink-soft">{t('forgotText')}</p>
          <TextField label={t('email')} type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
          <Button type="submit" size="lg" full loading={isSubmitting}>{t('send')}</Button>
        </form>
      )}
      <p className="mt-5 text-center text-sm"><Link href="/login" className="font-bold underline underline-offset-4">{t('backToLogin')}</Link></p>
    </Card>
  );
}
