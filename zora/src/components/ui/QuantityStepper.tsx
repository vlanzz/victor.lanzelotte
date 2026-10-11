'use client';
import { Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MAX_QTY } from '@/domain/cart';
import { cn } from './cn';

export function QuantityStepper({ value, onChange, className, size = 'md' }: { value: number; onChange: (n: number) => void; className?: string; size?: 'sm' | 'md' }) {
  const t = useTranslations('product');
  const btn = cn('inline-flex items-center justify-center rounded-full transition hover:bg-paper-2 disabled:opacity-40', size === 'sm' ? 'size-9' : 'size-11');
  return (
    <div role="group" aria-label={t('quantity')} className={cn('inline-flex items-center rounded-full border-2 border-line bg-white', className)}>
      <button type="button" className={btn} aria-label={t('decrease')} disabled={value <= 1} onClick={() => onChange(value - 1)}><Minus aria-hidden size={16} /></button>
      <output aria-live="polite" className="min-w-8 text-center font-bold tabular-nums">{value}</output>
      <button type="button" className={btn} aria-label={t('increase')} disabled={value >= MAX_QTY} onClick={() => onChange(value + 1)}><Plus aria-hidden size={16} /></button>
    </div>
  );
}
