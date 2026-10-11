'use client';
import { Expand } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { Art, Product, ProductType, Selection } from '@/domain/types';
import { Mockup, type MockupView } from '@/components/domain/mockup/Mockup';
import { cn } from '@/components/ui/cn';
import { IconButton } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface Props { type: ProductType; product: Product; art: Art; selection: Selection; accent?: string | undefined; label: string }

const VIEWS: { id: MockupView; key: 'viewMain' | 'viewScene' | 'viewDetail' | 'viewFlat' }[] = [
  { id: 'main', key: 'viewMain' }, { id: 'scene', key: 'viewScene' }, { id: 'detail', key: 'viewDetail' }, { id: 'flat', key: 'viewFlat' },
];

/** Galeria: mockup principal + vistas alternativas (em cena, detalhe, arte pura) com ampliação. */
export function Gallery({ type, product, art, selection, accent, label }: Props) {
  const t = useTranslations('product');
  const tc = useTranslations('common');
  const [view, setView] = useState<MockupView>('main');
  const [zoom, setZoom] = useState(false);
  const draw = (v: MockupView, className: string) => <Mockup type={type} product={product} selection={selection} art={art} view={v} accent={accent} label={`${label} — ${t(VIEWS.find((x) => x.id === v)!.key)}`} className={className} />;

  return (
    <div className="grid gap-3 md:grid-cols-[5rem_1fr]" role="group" aria-label={t('gallery')}>
      <div className="order-2 flex gap-2 self-start md:order-1 md:flex-col">
        {VIEWS.map((v) => (
          <button key={v.id} type="button" aria-pressed={view === v.id} aria-label={t(v.key)} title={t(v.key)} onClick={() => setView(v.id)}
            className={cn('aspect-square w-16 overflow-hidden rounded-md border-2 bg-paper-2 transition md:w-full', view === v.id ? 'border-ink' : 'border-transparent hover:border-ink/40')}>
            {draw(v.id, 'size-full')}
          </button>
        ))}
      </div>
      <div className="relative order-1 self-start overflow-hidden rounded-xl bg-paper-2 shadow-soft md:order-2">
        {draw(view, 'aspect-square w-full')}
        <IconButton label={t('zoom')} onClick={() => setZoom(true)} className="absolute right-3 bottom-3 bg-white/90 shadow-soft"><Expand aria-hidden size={20} /></IconButton>
      </div>
      <Modal open={zoom} onClose={() => setZoom(false)} title={t('zoomTitle')} closeLabel={tc('close')} className="w-[min(94vw,56rem)]">
        {draw(view, 'mx-auto aspect-square w-full max-w-[min(80vh,50rem)] rounded-lg')}
      </Modal>
    </div>
  );
}
