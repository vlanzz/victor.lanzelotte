'use client';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { entryName } from '@/domain/catalog';
import type { CatalogItem } from '@/domain/types';
import { useL10n } from '@/hooks/useL10n';
import { catalogRepo } from '@/services';
import { useToasts } from '@/store/toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { Table, Td, Th } from '@/components/ui/Table';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { AdminHeader } from './AdminShell';

const PER = 15;

export function CatalogAdmin() {
  const t = useTranslations('admin.catalog');
  const tc = useTranslations('admin.common');
  const tp = useTranslations('browse.pagination');
  const l = useL10n();
  const { snapshot, refresh } = useCatalog();
  const push = useToasts((s) => s.push);
  const [artId, setArtId] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const arts = new Map(snapshot.arts.map((a) => [a.id, a]));
    const prods = new Map(snapshot.products.map((p) => [p.id, p]));
    return snapshot.items.flatMap((item) => {
      const art = arts.get(item.artId), product = prods.get(item.productId);
      return art && product ? [{ item, art, product, name: entryName(art, product) }] : [];
    });
  }, [snapshot]);
  const filtered = rows.filter((r) => !q || `${r.name.pt} ${r.name.en} ${r.item.slug}`.toLowerCase().includes(q.toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * PER, cur * PER);

  const save = async (item: CatalogItem) => { await catalogRepo.saveItem(item); await refresh(); };
  const create = async () => {
    const art = snapshot.arts.find((a) => a.id === artId);
    if (!art || picked.length === 0) return push({ tone: 'error', message: t('pickArt') });
    let n = 0;
    for (const pid of picked) {
      const product = snapshot.products.find((p) => p.id === pid);
      if (!product || snapshot.items.some((i) => i.artId === art.id && i.productId === pid)) continue;
      await catalogRepo.saveItem({ id: `ci-${product.slug}-${art.slug}`, slug: `${product.slug}-${art.slug}`, artId: art.id, productId: pid, isNew: true, createdAt: new Date().toISOString(), status: 'active' });
      n++;
    }
    await refresh();
    push({ tone: n ? 'success' : 'info', message: t('created', { count: n }) });
    setPicked([]);
  };
  const flag = 'size-5 accent-[var(--color-sun)]';

  return (
    <div>
      <AdminHeader title={t('title')} />
      <section className="mb-8 rounded-lg bg-white p-5 shadow-soft" aria-labelledby="combine-t">
        <h2 id="combine-t" className="font-sans text-lg font-bold">{t('createTitle')}</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-[16rem_1fr]">
          <label className="text-sm font-semibold">{t('art')}
            <select aria-label={t('art')} value={artId} onChange={(e) => setArtId(e.target.value)} className="mt-1 min-h-11 w-full rounded-md border-2 border-line bg-white px-3">
              <option value="" />
              {snapshot.arts.map((a) => <option key={a.id} value={a.id}>{l(a.title)}</option>)}
            </select>
          </label>
          <fieldset>
            <legend className="text-sm font-semibold">{t('products')}</legend>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              {snapshot.products.map((p) => (
                <label key={p.id} className="flex min-h-8 items-center gap-2 text-sm"><input type="checkbox" className="size-4 accent-[var(--color-sun)]" checked={picked.includes(p.id)} onChange={() => setPicked((s) => (s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id]))} />{l(p.name)}</label>
              ))}
            </div>
            <div className="mt-2 flex gap-3 text-sm"><button type="button" className="font-semibold underline" onClick={() => setPicked(snapshot.products.map((p) => p.id))}>{t('pickAll')}</button><button type="button" className="font-semibold underline" onClick={() => setPicked([])}>{t('pickNone')}</button></div>
          </fieldset>
        </div>
        <Button className="mt-4" onClick={create}>{t('submit')}</Button>
      </section>

      <input type="search" aria-label={tc('search')} placeholder={tc('search')} value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="mb-4 min-h-11 w-64 rounded-full border-2 border-line bg-white px-4" />
      <Table caption={t('title')}>
        <thead><tr><Th>{t('col.item')}</Th><Th>{t('col.featured')}</Th><Th>{t('col.isNew')}</Th><Th>{t('col.status')}</Th><Th>{tc('actions')}</Th></tr></thead>
        <tbody>
          {shown.map(({ item, art, name }) => (
            <tr key={item.id}>
              <Td>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={art.file} alt="" loading="lazy" className="size-10 rounded-md bg-paper-2 object-cover" />
                  <div><p className="font-semibold">{l(name)}</p><p className="text-xs text-ink-soft">{item.slug}</p></div>
                </div>
              </Td>
              <Td><input type="checkbox" aria-label={`${t('col.featured')}: ${l(name)}`} className={flag} checked={!!item.featured} onChange={(e) => save({ ...item, featured: e.target.checked })} /></Td>
              <Td><input type="checkbox" aria-label={`${t('col.isNew')}: ${l(name)}`} className={flag} checked={!!item.isNew} onChange={(e) => save({ ...item, isNew: e.target.checked })} /></Td>
              <Td>
                <select aria-label={`${tc('status')}: ${l(name)}`} value={item.status} onChange={(e) => save({ ...item, status: e.target.value as CatalogItem['status'] })} className="min-h-9 rounded-md border-2 border-line bg-white px-2 text-sm">
                  <option value="active">{tc('active')}</option><option value="draft">{tc('draft')}</option>
                </select>
                {item.status === 'draft' && <Badge className="ml-2">{tc('draft')}</Badge>}
              </Td>
              <Td><Button size="sm" variant="ghost" aria-label={`${tc('delete')} ${l(name)}`} onClick={async () => { if (window.confirm(tc('confirmDelete', { name: l(name) }))) { await catalogRepo.deleteItem(item.id); await refresh(); push({ tone: 'info', message: tc('deleted') }); } }}><Trash2 aria-hidden size={14} /></Button></Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="mt-6"><Pagination page={cur} pages={pages} onChange={setPage} labels={{ nav: tp('nav'), prev: tp('prev'), next: tp('next'), page: (n) => tp('page', { n }) }} /></div>
    </div>
  );
}
