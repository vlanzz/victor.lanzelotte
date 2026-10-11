'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useFieldArray, useForm, type Control, type UseFormRegister } from 'react-hook-form';
import { z } from 'zod';
import { categories } from '@/data/categories';
import { basePrice } from '@/domain/pricing';
import type { OptionAxis, OptionKind, Product } from '@/domain/types';
import { useL10n } from '@/hooks/useL10n';
import { useMoney } from '@/hooks/useMoney';
import { newId } from '@/lib/id';
import { catalogRepo } from '@/services';
import { useToasts } from '@/store/toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SelectField, TextArea, TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Table, Td, Th } from '@/components/ui/Table';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { formatMoney } from '@/domain/money';
import { AdminHeader } from './AdminShell';

export function ProductsAdmin() {
  const t = useTranslations('admin.products');
  const tc = useTranslations('admin.common');
  const tcm = useTranslations('common');
  const l = useL10n();
  const { locale } = useMoney();
  const { snapshot, refresh } = useCatalog();
  const push = useToasts((s) => s.push);
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [q, setQ] = useState('');
  const list = snapshot.products.filter((p) => !q || `${p.name.pt} ${p.name.en}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <AdminHeader title={t('title')} actions={<Button onClick={() => setEditing('new')}><Plus aria-hidden size={18} />{t('new')}</Button>} />
      <input type="search" aria-label={tc('search')} placeholder={tc('search')} value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 min-h-11 w-64 rounded-full border-2 border-line bg-white px-4" />
      <Table caption={t('title')}>
        <thead><tr><Th>{t('col.product')}</Th><Th>{t('col.category')}</Th><Th>{t('col.price')}</Th><Th>{t('col.options')}</Th><Th>{t('col.status')}</Th><Th>{tc('actions')}</Th></tr></thead>
        <tbody>
          {list.map((p) => {
            const type = snapshot.types.find((x) => x.id === p.typeId);
            const cat = categories.find((c) => c.id === type?.categoryId);
            return (
              <tr key={p.id}>
                <Td className="font-semibold">{l(p.name)}</Td>
                <Td>{cat ? l(cat.name) : '—'}</Td>
                <Td className="whitespace-nowrap">{formatMoney(basePrice(p, 'BRL'), 'BRL', locale)} · {formatMoney(basePrice(p, 'USD'), 'USD', locale)}{p.priceUSD === undefined && <span className="ml-1 text-xs text-ink-soft">*</span>}</Td>
                <Td>{p.options.map((o) => l(o.label)).join(', ')}</Td>
                <Td><Badge tone={p.status === 'active' ? 'mint' : 'neutral'}>{p.status === 'active' ? tc('active') : tc('draft')}</Badge></Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="secondary" aria-label={`${tc('edit')} ${l(p.name)}`} onClick={() => setEditing(p)}><Pencil aria-hidden size={14} /></Button>
                    <Button size="sm" variant="ghost" aria-label={`${tc('delete')} ${l(p.name)}`} onClick={async () => { if (window.confirm(tc('confirmDelete', { name: l(p.name) }))) { for (const i of snapshot.items.filter((x) => x.productId === p.id)) await catalogRepo.deleteItem(i.id); await catalogRepo.deleteProduct(p.id); await refresh(); push({ tone: 'info', message: tc('deleted') }); } }}><Trash2 aria-hidden size={14} /></Button>
                  </div>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <p className="mt-2 text-xs text-ink-soft">* {t('form.priceUSDHint')}</p>
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? t('new') : t('edit')} closeLabel={tcm('close')} className="w-[min(96vw,56rem)]">
        {editing && <ProductForm key={editing === 'new' ? 'new' : editing.id} initial={editing === 'new' ? null : editing} onDone={async () => { await refresh(); setEditing(null); push({ tone: 'success', message: tc('saved') }); }} />}
      </Modal>
    </div>
  );
}

interface Msgs { number: string; required: string; invalidHex: string; needValue: string }
function makeSchema(m: Msgs) {
  const num = z.union([z.literal(''), z.coerce.number().min(0, m.number)]);
  return z.object({
    namePt: z.string().trim().min(2, m.required), nameEn: z.string().trim().min(2, m.required),
    descPt: z.string().trim().min(5, m.required), descEn: z.string().trim().min(5, m.required),
    typeId: z.string().min(1, m.required),
    priceBRL: z.coerce.number({ error: m.number }).positive(m.number), priceUSD: num,
    status: z.enum(['active', 'draft']), tags: z.string(),
    options: z.array(z.object({
      kind: z.enum(['color', 'size', 'material', 'frame']), labelPt: z.string().trim().min(1, m.required), labelEn: z.string().trim().min(1, m.required),
      values: z.array(z.object({
        id: z.string().trim().min(1, m.required), labelPt: z.string().trim().min(1, m.required), labelEn: z.string().trim().min(1, m.required),
        swatch: z.string().trim().refine((v) => v === '' || /^#[0-9a-fA-F]{6}$/.test(v), m.invalidHex),
        deltaBRL: z.coerce.number({ error: m.number }), deltaUSD: num, w: num, h: num,
      })).min(1, m.needValue),
    })),
  });
}
export type ProductFormIn = z.input<ReturnType<typeof makeSchema>>;
export type ProductFormOut = z.output<ReturnType<typeof makeSchema>>;

const KINDS: OptionKind[] = ['color', 'size', 'material', 'frame'];
const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function ProductForm({ initial, onDone }: { initial: Product | null; onDone: () => void | Promise<void> }) {
  const t = useTranslations('admin.products');
  const tc = useTranslations('admin.common');
  const l = useL10n();
  const { snapshot } = useCatalog();
  const schema = useMemo(() => makeSchema({ number: tc('number'), required: tc('required'), invalidHex: t('form.invalidHex'), needValue: t('form.needValue') }), [t, tc]);
  type In = ProductFormIn;
  type Out = ProductFormOut;
  const defaults: In = initial ? {
    namePt: initial.name.pt, nameEn: initial.name.en, descPt: initial.description.pt, descEn: initial.description.en, typeId: initial.typeId,
    priceBRL: initial.priceBRL / 100, priceUSD: initial.priceUSD !== undefined ? initial.priceUSD / 100 : '', status: initial.status, tags: initial.tags.join(', '),
    options: initial.options.map((o) => ({ kind: o.kind, labelPt: o.label.pt, labelEn: o.label.en, values: o.values.map((v) => ({ id: v.id, labelPt: v.label.pt, labelEn: v.label.en, swatch: v.swatch ?? '', deltaBRL: v.deltaBRL / 100, deltaUSD: v.deltaUSD !== undefined ? v.deltaUSD / 100 : '', w: v.dims?.w ?? '', h: v.dims?.h ?? '' })) })),
  } : { namePt: '', nameEn: '', descPt: '', descEn: '', typeId: snapshot.types[0]?.id ?? '', priceBRL: '' as unknown as number, priceUSD: '', status: 'draft', tags: '', options: [] };
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<In, unknown, Out>({ resolver: zodResolver(schema), defaultValues: defaults });
  const axes = useFieldArray({ control, name: 'options' });

  return (
    <form noValidate onSubmit={handleSubmit(async (v) => {
      const options: OptionAxis[] = v.options.map((o, i) => ({
        id: o.kind === 'size' && i === v.options.findIndex((x) => x.kind === 'size') ? 'size' : o.kind === 'color' || o.kind === 'frame' || o.kind === 'material' ? o.kind : `${o.kind}${i}`,
        kind: o.kind, label: { pt: o.labelPt, en: o.labelEn },
        values: o.values.map((x) => ({
          id: slug(x.id) || newId('v'), label: { pt: x.labelPt, en: x.labelEn }, deltaBRL: Math.round(x.deltaBRL * 100),
          ...(x.deltaUSD !== '' ? { deltaUSD: Math.round(Number(x.deltaUSD) * 100) } : {}), ...(x.swatch ? { swatch: x.swatch } : {}),
          ...(x.w !== '' && x.h !== '' && Number(x.w) > 0 && Number(x.h) > 0 ? { dims: { w: Number(x.w), h: Number(x.h) } } : {}),
        })),
      }));
      const product: Product = {
        id: initial?.id ?? `prod-${newId('p')}`, slug: initial?.slug ?? (slug(v.nameEn) || newId('p')), typeId: v.typeId,
        name: { pt: v.namePt, en: v.nameEn }, description: { pt: v.descPt, en: v.descEn }, specs: initial?.specs ?? [], production: initial?.production ?? { pt: 'Produzido sob demanda.', en: 'Made on demand.' }, shipping: initial?.shipping ?? { pt: 'Envio para todo o mundo.', en: 'Worldwide shipping.' },
        priceBRL: Math.round(v.priceBRL * 100), ...(v.priceUSD !== '' ? { priceUSD: Math.round(Number(v.priceUSD) * 100) } : {}),
        options, defaultSelection: Object.fromEntries(options.map((o) => [o.id, o.values[0]?.id ?? ''])), tags: v.tags.split(',').map((x) => x.trim()).filter(Boolean), status: v.status,
      };
      await catalogRepo.saveProduct(product);
      await onDone();
    })} className="grid gap-3 sm:grid-cols-2">
      <TextField label={t('form.namePt')} error={errors.namePt?.message} {...register('namePt')} />
      <TextField label={t('form.nameEn')} error={errors.nameEn?.message} {...register('nameEn')} />
      <TextArea label={t('form.descPt')} rows={3} error={errors.descPt?.message} {...register('descPt')} />
      <TextArea label={t('form.descEn')} rows={3} error={errors.descEn?.message} {...register('descEn')} />
      <SelectField label={t('form.type')} error={errors.typeId?.message} {...register('typeId')}>{snapshot.types.map((ty) => <option key={ty.id} value={ty.id}>{l(ty.name)}</option>)}</SelectField>
      <SelectField label={t('form.status')} {...register('status')}><option value="active">{tc('active')}</option><option value="draft">{tc('draft')}</option></SelectField>
      <TextField label={t('form.priceBRL')} inputMode="decimal" error={errors.priceBRL?.message as string | undefined} {...register('priceBRL')} />
      <TextField label={t('form.priceUSD')} hint={t('form.priceUSDHint')} inputMode="decimal" error={errors.priceUSD?.message as string | undefined} {...register('priceUSD')} />
      <TextField wrapperClassName="sm:col-span-2" label={t('form.tags')} {...register('tags')} />

      <section className="sm:col-span-2" aria-labelledby="opt-t">
        <h3 id="opt-t" className="font-sans text-base font-bold">{t('form.options')}</h3>
        <p className="mb-3 text-sm text-ink-soft">{t('form.optionsHint')}</p>
        <div className="space-y-4">
          {axes.fields.map((f, i) => (
            <fieldset key={f.id} className="rounded-lg border-2 border-line p-3">
              <legend className="px-1 text-sm font-bold">#{i + 1}</legend>
              <div className="grid gap-2 sm:grid-cols-[10rem_1fr_1fr_auto]">
                <SelectField label={t('form.axisKind')} {...register(`options.${i}.kind`)}>{KINDS.map((k) => <option key={k} value={k}>{t(`kinds.${k}`)}</option>)}</SelectField>
                <TextField label={t('form.axisLabelPt')} error={errors.options?.[i]?.labelPt?.message} {...register(`options.${i}.labelPt`)} />
                <TextField label={t('form.axisLabelEn')} error={errors.options?.[i]?.labelEn?.message} {...register(`options.${i}.labelEn`)} />
                <Button variant="ghost" size="sm" className="self-end" onClick={() => axes.remove(i)}><Trash2 aria-hidden size={14} />{t('form.removeAxis')}</Button>
              </div>
              <ValuesEditor control={control} register={register} index={i} errors={errors} />
            </fieldset>
          ))}
        </div>
        <Button variant="secondary" size="sm" className="mt-3" onClick={() => axes.append({ kind: 'size', labelPt: 'Tamanho', labelEn: 'Size', values: [{ id: '', labelPt: '', labelEn: '', swatch: '', deltaBRL: 0, deltaUSD: '', w: '', h: '' }] })}><Plus aria-hidden size={14} />{t('form.addAxis')}</Button>
      </section>
      <div className="sm:col-span-2"><Button type="submit" loading={isSubmitting}>{tc('save')}</Button></div>
    </form>
  );
}

function ValuesEditor({ control, register, index, errors }: { control: Control<ProductFormIn, unknown, ProductFormOut>; register: UseFormRegister<ProductFormIn>; index: number; errors: Record<string, unknown> }) {
  const t = useTranslations('admin.products');
  const vals = useFieldArray({ control, name: `options.${index}.values` });
  const e = (errors as { options?: { values?: { id?: { message?: string }; labelPt?: { message?: string }; labelEn?: { message?: string }; swatch?: { message?: string } }[]; }[] }).options?.[index]?.values;
  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-bold tracking-wide text-ink-soft uppercase">{t('form.values')}</p>
      {vals.fields.map((vf, j) => (
        <div key={vf.id} className="grid gap-2 rounded-md bg-paper-2 p-2 sm:grid-cols-[repeat(4,minmax(0,1fr))] lg:grid-cols-[1fr_1fr_1fr_6rem_5rem_5rem_4rem_4rem_auto]">
          <TextField label={t('form.valueId')} error={e?.[j]?.id?.message} {...register(`options.${index}.values.${j}.id`)} />
          <TextField label={t('form.valueLabelPt')} error={e?.[j]?.labelPt?.message} {...register(`options.${index}.values.${j}.labelPt`)} />
          <TextField label={t('form.valueLabelEn')} error={e?.[j]?.labelEn?.message} {...register(`options.${index}.values.${j}.labelEn`)} />
          <TextField label={t('form.swatch')} placeholder="#FFFFFF" error={e?.[j]?.swatch?.message} {...register(`options.${index}.values.${j}.swatch`)} />
          <TextField label={t('form.deltaBRL')} inputMode="decimal" {...register(`options.${index}.values.${j}.deltaBRL`)} />
          <TextField label={t('form.deltaUSD')} inputMode="decimal" {...register(`options.${index}.values.${j}.deltaUSD`)} />
          <TextField label="L (cm)" inputMode="decimal" {...register(`options.${index}.values.${j}.w`)} />
          <TextField label="A (cm)" inputMode="decimal" {...register(`options.${index}.values.${j}.h`)} />
          <Button variant="ghost" size="sm" className="self-end" aria-label={t('form.removeValue')} onClick={() => vals.remove(j)}><Trash2 aria-hidden size={14} /></Button>
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={() => vals.append({ id: '', labelPt: '', labelEn: '', swatch: '', deltaBRL: 0, deltaUSD: '', w: '', h: '' })}><Plus aria-hidden size={14} />{t('form.addValue')}</Button>
    </div>
  );
}
