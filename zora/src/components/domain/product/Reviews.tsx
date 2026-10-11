'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ratingStats } from '@/domain/catalog';
import type { Locale, Review } from '@/domain/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/components/ui/cn';
import { Field, TextArea, TextField } from '@/components/ui/Field';
import { Stars } from '@/components/ui/Stars';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { catalogRepo } from '@/services';
import { useSession } from '@/store/session';
import { useToasts } from '@/store/toast';

/** Nova avaliação simulada: entra como "pendente" até o admin moderar. */
function newReview(itemId: string, v: { name: string; rating: number; title: string; body: string }): Review {
  return {
    id: `rev-${Date.now().toString(36)}`, catalogItemId: itemId, author: v.name, rating: v.rating as Review['rating'],
    title: { pt: v.title, en: v.title }, body: { pt: v.body, en: v.body }, createdAt: new Date().toISOString(), status: 'pending',
  };
}

export function Reviews({ itemId }: { itemId: string }) {
  const t = useTranslations('product.reviews');
  const tf = useTranslations('forms');
  const locale = useLocale() as Locale;
  const { snapshot, refresh } = useCatalog();
  const customer = useSession((s) => s.customer);
  const push = useToasts((s) => s.push);
  const [filter, setFilter] = useState<number | null>(null);
  const [shown, setShown] = useState(5);

  const all = useMemo(() => snapshot.reviews.filter((r) => r.catalogItemId === itemId && r.status === 'published').sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [snapshot.reviews, itemId]);
  const stats = ratingStats(all);
  const list = filter ? all.filter((r) => r.rating === filter) : all;

  const schema = z.object({
    name: z.string().trim().min(2, tf('required')),
    rating: z.number({ error: t('ratingRequired') }).min(1, t('ratingRequired')).max(5),
    title: z.string().trim().min(3, tf('minLength')),
    body: z.string().trim().min(10, tf('minLength')),
  });
  type Form = z.infer<typeof schema>;
  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { name: customer?.name ?? '', title: '', body: '' } });

  const submit = async (v: Form) => {
    const review = newReview(itemId, v);
    await catalogRepo.saveReview(review);
    await refresh();
    reset({ name: v.name, title: '', body: '' });
    push({ tone: 'success', message: t('thanks') });
  };

  return (
    <section aria-labelledby="reviews-title" className="grid gap-10 lg:grid-cols-[20rem_1fr]">
      <div>
        <h2 id="reviews-title" className="text-3xl">{t('title')}</h2>
        {stats.count > 0 ? (
          <div className="mt-5">
            <p className="flex items-baseline gap-2"><span className="font-display text-5xl font-semibold">{stats.average.toFixed(1)}</span><span className="text-ink-soft">{t('outOf')}</span></p>
            <div className="mt-1 flex items-center gap-2"><Stars value={stats.average} size={20} /><span className="text-sm text-ink-soft">{t('count', { count: stats.count })}</span></div>
            <ul className="mt-5 space-y-1.5">
              {([5, 4, 3, 2, 1] as const).map((n) => (
                <li key={n}>
                  <button type="button" aria-pressed={filter === n} onClick={() => { setFilter(filter === n ? null : n); setShown(5); }} className={cn('flex w-full items-center gap-3 rounded-md px-2 py-1 text-sm hover:bg-paper-2', filter === n && 'bg-honey-soft')}>
                    <span className="w-20 shrink-0 text-left font-semibold whitespace-nowrap">{t('filterStars', { n })}</span>
                    <span aria-hidden className="h-2.5 flex-1 overflow-hidden rounded-full bg-line"><span className="block h-full rounded-full bg-honey" style={{ width: `${(stats.distribution[n] / stats.count) * 100}%` }} /></span>
                    <span className="w-6 text-right text-ink-soft">{stats.distribution[n]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-4 text-ink-soft">{t('none')}</p>
        )}
      </div>

      <div>
        {stats.count > 0 && (
          <>
            <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label={t('title')}>
              {[null, 5, 4, 3, 2, 1].map((n) => (
                <button key={n ?? 'all'} type="button" aria-pressed={filter === n} onClick={() => { setFilter(n); setShown(5); }} className={cn('min-h-9 rounded-full border-2 px-3 text-sm font-semibold', filter === n ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink/40')}>
                  {n === null ? t('filterAll') : `${n} ★`}
                </button>
              ))}
            </div>
            {list.length === 0 && <p className="py-6 text-ink-soft">{t('emptyFilter')}</p>}
            <ul className="divide-y divide-line">
              {list.slice(0, shown).map((r) => (
                <li key={r.id} className="py-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1"><Stars value={r.rating} size={16} /><h3 className="font-sans font-bold">{r.title[locale]}</h3></div>
                  <p className="mt-2">{r.body[locale]}</p>
                  <p className="mt-2 text-sm text-ink-soft">{t('by', { name: r.author })} · {new Date(r.createdAt).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US')}</p>
                </li>
              ))}
            </ul>
            {shown < list.length && <Button variant="secondary" className="mt-2" onClick={() => setShown((s) => s + 5)}>{t('showMore')}</Button>}
          </>
        )}

        <form noValidate onSubmit={handleSubmit(submit)} className="mt-10 space-y-4 rounded-lg bg-paper-2 p-5 md:p-6">
          <h3 className="text-xl">{t('write')}</h3>
          <TextField label={t('name')} autoComplete="name" error={errors.name?.message} {...register('name')} />
          <Controller control={control} name="rating" render={({ field }) => (
            <Field label={t('rating')} error={errors.rating?.message}>
              {({ id, describedBy }) => (
                <div id={id} role="radiogroup" aria-describedby={describedBy} aria-label={t('rating')} className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" role="radio" aria-checked={field.value === n} aria-label={t('ratingStar', { n })} onClick={() => field.onChange(n)} className="rounded-md p-1 transition hover:scale-110">
                      <Star aria-hidden size={30} strokeWidth={1.5} className={(field.value ?? 0) >= n ? 'fill-honey text-honey' : 'text-ink-soft'} />
                    </button>
                  ))}
                </div>
              )}
            </Field>
          )} />
          <TextField label={t('reviewTitle')} error={errors.title?.message} {...register('title')} />
          <TextArea label={t('body')} error={errors.body?.message} {...register('body')} />
          <Button type="submit" loading={isSubmitting}>{t('submit')}</Button>
        </form>
      </div>
    </section>
  );
}
