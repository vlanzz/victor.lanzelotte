'use client';
import { useTranslations } from 'next-intl';
import type { OptionAxis, Selection } from '@/domain/types';
import { useL10n } from '@/hooks/useL10n';
import { cn } from '@/components/ui/cn';

/** Seletor de variações: bolinhas de cor/moldura e botões para tamanho/material. */
export function VariantPicker({ options, selection, onChange }: { options: OptionAxis[]; selection: Selection; onChange: (axisId: string, valueId: string) => void }) {
  const l = useL10n();
  const t = useTranslations('product');
  return (
    <div className="space-y-5">
      {options.map((axis) => {
        const current = axis.values.find((v) => v.id === selection[axis.id]);
        const swatches = axis.kind === 'color' || axis.kind === 'frame';
        return (
          <fieldset key={axis.id}>
            <legend className="mb-2 text-sm font-bold">
              {l(axis.label)}: <span className="font-medium text-ink-soft">{current ? l(current.label) : ''}</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {axis.values.map((v) => {
                const on = selection[axis.id] === v.id;
                return swatches ? (
                  <button key={v.id} type="button" role="radio" aria-checked={on} aria-label={l(v.label)} title={l(v.label)} onClick={() => onChange(axis.id, v.id)}
                    className={cn('size-10 rounded-full border border-ink/25 transition hover:scale-110', on && 'ring-2 ring-ink ring-offset-2')} style={{ background: v.swatch }} />
                ) : (
                  <button key={v.id} type="button" role="radio" aria-checked={on} onClick={() => onChange(axis.id, v.id)}
                    className={cn('min-h-11 rounded-full border-2 px-4 text-sm font-semibold transition', on ? 'border-ink bg-ink text-paper' : 'border-line bg-white hover:border-ink/50')}>
                    {l(v.label)}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
      <span className="sr-only">{t('selected')}</span>
    </div>
  );
}
