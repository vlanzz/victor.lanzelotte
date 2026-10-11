'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import type { Art } from '@/domain/types';
import { useL10n } from '@/hooks/useL10n';
import { newId } from '@/lib/id';
import { catalogRepo } from '@/services';
import { useToasts } from '@/store/toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SelectField, TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Table, Td, Th } from '@/components/ui/Table';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { AdminHeader } from './AdminShell';

const slugify = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function ArtsAdmin() {
  const t = useTranslations('admin.arts');
  const tc = useTranslations('admin.common');
  const tcm = useTranslations('common');
  const l = useL10n();
  const { snapshot, refresh } = useCatalog();
  const push = useToasts((s) => s.push);
  const [editing, setEditing] = useState<Art | 'new' | null>(null);
  const nicheName = (id: string) => { const n = snapshot.niches.find((x) => x.id === id); return n ? l(n.name) : id; };
  return (
    <div>
      <AdminHeader title={t('title')} actions={<Button onClick={() => setEditing('new')}><Plus aria-hidden size={18} />{t('new')}</Button>} />
      <Table caption={t('title')}>
        <thead><tr><Th>{t('col.art')}</Th><Th>{t('col.niches')}</Th><Th>{t('col.orientation')}</Th><Th>{t('col.items')}</Th><Th>{tc('status')}</Th><Th>{tc('actions')}</Th></tr></thead>
        <tbody>
          {snapshot.arts.map((a) => (
            <tr key={a.id}>
              <Td>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.file} alt="" loading="lazy" className="size-12 rounded-md bg-paper-2 object-cover" />
                  <span className="font-semibold">{l(a.title)}</span>
                </div>
              </Td>
              <Td>{a.nicheIds.map(nicheName).join(', ')}</Td>
              <Td>{t(`orientations.${a.orientation}`)}</Td>
              <Td>{snapshot.items.filter((i) => i.artId === a.id).length}</Td>
              <Td><Badge tone={a.status === 'active' ? 'mint' : 'neutral'}>{a.status === 'active' ? tc('active') : tc('draft')}</Badge></Td>
              <Td>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="secondary" aria-label={`${tc('edit')} ${l(a.title)}`} onClick={() => setEditing(a)}><Pencil aria-hidden size={14} /></Button>
                  <Button size="sm" variant="ghost" aria-label={`${tc('delete')} ${l(a.title)}`} onClick={async () => { if (window.confirm(tc('confirmDelete', { name: l(a.title) }))) { for (const i of snapshot.items.filter((x) => x.artId === a.id)) await catalogRepo.deleteItem(i.id); await catalogRepo.deleteArt(a.id); await refresh(); push({ tone: 'info', message: tc('deleted') }); } }}><Trash2 aria-hidden size={14} /></Button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? t('new') : t('edit')} closeLabel={tcm('close')} className="w-[min(94vw,42rem)]">
        {editing && <ArtForm key={editing === 'new' ? 'new' : editing.id} initial={editing === 'new' ? null : editing} onDone={async () => { await refresh(); setEditing(null); push({ tone: 'success', message: tc('saved') }); }} />}
      </Modal>
    </div>
  );
}

function ArtForm({ initial, onDone }: { initial: Art | null; onDone: () => void | Promise<void> }) {
  const t = useTranslations('admin.arts');
  const tc = useTranslations('admin.common');
  const l = useL10n();
  const { snapshot } = useCatalog();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const schema = useMemo(() => z.object({
    titlePt: z.string().trim().min(2, tc('required')), titleEn: z.string().trim().min(2, tc('required')),
    nicheIds: z.array(z.string()).min(1, t('form.nicheRequired')),
    file: z.string().trim().min(3, tc('required')),
    orientation: z.enum(['portrait', 'landscape', 'square']),
    palette: z.string().refine((v) => v.split(',').map((x) => x.trim()).filter(Boolean).every((x) => /^#[0-9a-fA-F]{6}$/.test(x)), t('form.paletteInvalid')),
    status: z.enum(['active', 'draft']),
    types: z.array(z.string()),
  }), [t, tc]);
  type F = z.infer<typeof schema>;
  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { titlePt: initial?.title.pt ?? '', titleEn: initial?.title.en ?? '', nicheIds: initial?.nicheIds ?? [], file: initial?.file ?? '', orientation: initial?.orientation ?? 'square', palette: (initial?.palette ?? ['#F4ECDD', '#241C3D', '#C8421C', '#F2B33D']).join(', '), status: initial?.status ?? 'active', types: initial?.compatibleTypeIds ?? [] },
  });
  const file = useWatch({ control, name: 'file' });
  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (f.size > 400 * 1024) return setUploadError(t('form.tooBig'));
    setUploadError(null);
    const r = new FileReader();
    r.onload = () => setValue('file', String(r.result), { shouldValidate: true });
    r.readAsDataURL(f);
  };
  return (
    <form noValidate onSubmit={handleSubmit(async (v) => {
      const art: Art = {
        id: initial?.id ?? newId('art'), slug: initial?.slug ?? (slugify(v.titleEn) || newId('art')), title: { pt: v.titlePt, en: v.titleEn }, nicheIds: v.nicheIds, file: v.file,
        palette: v.palette.split(',').map((x) => x.trim()).filter(Boolean), orientation: v.orientation, status: v.status,
        ...(v.types.length ? { compatibleTypeIds: v.types } : {}), ...(initial?.motif ? { motif: initial.motif } : {}),
      };
      await catalogRepo.saveArt(art);
      await onDone();
    })} className="grid gap-3 sm:grid-cols-2">
      <TextField label={t('form.titlePt')} error={errors.titlePt?.message} {...register('titlePt')} />
      <TextField label={t('form.titleEn')} error={errors.titleEn?.message} {...register('titleEn')} />
      <fieldset className="sm:col-span-2">
        <legend className="mb-1 text-sm font-semibold">{t('form.niches')}</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-1">{snapshot.niches.map((n) => <label key={n.id} className="flex min-h-9 items-center gap-2 text-sm"><input type="checkbox" value={n.id} className="size-4 accent-[var(--color-sun)]" {...register('nicheIds')} />{l(n.name)}</label>)}</div>
        {errors.nicheIds && <p role="alert" className="mt-1 text-sm font-medium text-error">{errors.nicheIds.message}</p>}
      </fieldset>
      <div className="sm:col-span-2">
        <TextField label={t('form.file')} hint={t('form.fileHint')} error={errors.file?.message} {...register('file')} value={file.startsWith('data:') ? '(upload)' : file} onChange={(e) => setValue('file', e.target.value, { shouldValidate: true })} />
        <div className="mt-2 flex items-center gap-3">
          <label className="inline-flex min-h-10 cursor-pointer items-center rounded-full border-2 border-ink/80 px-4 text-sm font-semibold hover:bg-ink hover:text-paper">{t('form.upload')}<input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} /></label>
          {file && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={file} alt="" className="size-14 rounded-md bg-paper-2 object-cover" />
          )}
        </div>
        {uploadError && <p role="alert" className="mt-1 text-sm font-medium text-error">{uploadError}</p>}
      </div>
      <SelectField label={t('form.orientation')} {...register('orientation')}>{(['portrait', 'landscape', 'square'] as const).map((o) => <option key={o} value={o}>{t(`orientations.${o}`)}</option>)}</SelectField>
      <SelectField label={t('form.status')} {...register('status')}><option value="active">{tc('active')}</option><option value="draft">{tc('draft')}</option></SelectField>
      <TextField wrapperClassName="sm:col-span-2" label={t('form.palette')} error={errors.palette?.message} {...register('palette')} />
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-semibold">{t('form.types')}</legend>
        <p className="mb-1 text-xs text-ink-soft">{t('form.typesHint')}</p>
        <div className="flex max-h-40 flex-wrap gap-x-4 gap-y-1 overflow-y-auto">{snapshot.types.map((ty) => <label key={ty.id} className="flex min-h-8 items-center gap-2 text-sm"><input type="checkbox" value={ty.id} className="size-4 accent-[var(--color-sun)]" {...register('types')} />{l(ty.name)}</label>)}</div>
      </fieldset>
      <div className="sm:col-span-2"><Button type="submit" loading={isSubmitting}>{tc('save')}</Button></div>
    </form>
  );
}
