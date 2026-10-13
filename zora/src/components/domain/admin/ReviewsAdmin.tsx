'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import type { Locale, Review } from '@/domain/types';
import { useL10n } from '@/hooks/useL10n';
import { catalogRepo } from '@/services';
import { useToasts } from '@/store/toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Stars } from '@/components/ui/Stars';
import { Table, Td, Th } from '@/components/ui/Table';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { AdminHeader } from './AdminShell';

export function ReviewsAdmin() {
  const t = useTranslations('admin.reviews');
  const tc = useTranslations('admin.common');
  const l = useL10n();
  const locale = useLocale() as Locale;
  const { snapshot, refresh, byId } = useCatalog();
  const push = useToasts((s) => s.push);
  const [filter, setFilter] = useState<Review['status'] | 'all'>('pending');
  const list = snapshot.reviews.filter((r) => filter === 'all' || r.status === filter).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const set = async (r: Review, status: Review['status']) => { await catalogRepo.saveReview({ ...r, status }); await refresh(); push({ tone: 'success', message: t('updated') }); };
  const tone = { published: 'mint', pending: 'honey', hidden: 'neutral' } as const;
  return (
    <div>
      <AdminHeader title={t('title')} />
      <div role="group" aria-label={tc('status')} className="mb-4 flex flex-wrap gap-2">
        {(['pending', 'published', 'hidden', 'all'] as const).map((s) => (
          <button key={s} type="button" aria-pressed={filter === s} onClick={() => setFilter(s)} className={`min-h-10 rounded-full border-2 px-4 text-sm font-semibold ${filter === s ? 'border-ink bg-ink text-paper' : 'border-line bg-white'}`}>
            {s === 'all' ? tc('all') : t(`status.${s}`)} ({s === 'all' ? snapshot.reviews.length : snapshot.reviews.filter((r) => r.status === s).length})
          </button>
        ))}
      </div>
      {list.length === 0 ? <EmptyState title={tc('noResults')} /> : (
        <Table caption={t('title')}>
          <thead><tr><Th>{t('col.product')}</Th><Th>{t('col.rating')}</Th><Th>{t('col.text')}</Th><Th>{t('col.date')}</Th><Th>{t('col.status')}</Th><Th>{tc('actions')}</Th></tr></thead>
          <tbody>
            {list.slice(0, 60).map((r) => (
              <tr key={r.id}>
                <Td className="min-w-40 font-semibold">{byId(r.catalogItemId) ? l(byId(r.catalogItemId)!.name) : r.catalogItemId}<br /><span className="text-xs font-normal text-ink-soft">{r.author}</span></Td>
                <Td><Stars value={r.rating} size={14} /></Td>
                <Td className="max-w-xs"><strong>{r.title[locale]}</strong><br /><span className="text-ink-soft">{r.body[locale]}</span></Td>
                <Td className="whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US')}</Td>
                <Td><Badge tone={tone[r.status]}>{t(`status.${r.status}`)}</Badge></Td>
                <Td>
                  <div className="flex flex-wrap gap-1.5">
                    {r.status !== 'published' && <Button size="sm" onClick={() => set(r, 'published')}>{t('approve')}</Button>}
                    {r.status !== 'hidden' && <Button size="sm" variant="secondary" onClick={() => set(r, 'hidden')}>{t('hide')}</Button>}
                    {r.status === 'hidden' && <Button size="sm" variant="ghost" onClick={() => set(r, 'pending')}>{t('restore')}</Button>}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
