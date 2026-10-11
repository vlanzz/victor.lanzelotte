'use client';
import { useState } from 'react';
import { useL10n } from '@/hooks/useL10n';
import { resolveSelection } from '@/domain/pricing';
import type { Art, Product, ProductType, Selection } from '@/domain/types';
import { Mockup, type MockupView } from './Mockup';

interface Props {
  rows: { type: ProductType; product: Product; art: Art }[];
}

/** Página de laboratório: todos os mockups lado a lado, com as variações editáveis (uso interno de QA/design). */
export function MockupLab({ rows }: Props) {
  const l = useL10n();
  const [view, setView] = useState<MockupView>('main');
  return (
    <div className="container-page py-8">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <h1 className="mr-4 text-3xl">Mockup lab</h1>
        {(['main', 'scene', 'detail', 'flat'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} aria-pressed={view === v} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${view === v ? 'bg-ink text-paper' : 'bg-paper-2'}`}>{v}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
        {rows.map((r) => <LabCard key={r.type.id} {...r} view={view} l={l} />)}
      </div>
    </div>
  );
}

function LabCard({ type, product, art, view, l }: Props['rows'][number] & { view: MockupView; l: ReturnType<typeof useL10n> }) {
  const [sel, setSel] = useState<Selection>(resolveSelection(product, {}));
  return (
    <figure className="overflow-hidden rounded-lg border border-line bg-white">
      <Mockup type={type} product={product} selection={sel} art={art} view={view} label={l(product.name)} className="aspect-square w-full" />
      <figcaption className="space-y-1 p-2 text-xs">
        <p className="font-bold">{l(product.name)}</p>
        {product.options.map((axis) => (
          <select key={axis.id} aria-label={l(axis.label)} value={sel[axis.id]} onChange={(e) => setSel({ ...sel, [axis.id]: e.target.value })} className="w-full rounded border border-line bg-paper px-1 py-1">
            {axis.values.map((v) => <option key={v.id} value={v.id}>{l(v.label)}</option>)}
          </select>
        ))}
      </figcaption>
    </figure>
  );
}
