'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './cn';

export function Pagination({ page, pages, onChange, labels }: {
  page: number; pages: number; onChange: (p: number) => void; labels: { nav: string; prev: string; next: string; page: (n: number) => string };
}) {
  if (pages <= 1) return null;
  const list = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);
  const btn = 'inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold transition hover:bg-paper-2 disabled:opacity-40 disabled:hover:bg-transparent';
  return (
    <nav aria-label={labels.nav} className="flex items-center justify-center gap-1">
      <button className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label={labels.prev}><ChevronLeft aria-hidden size={18} /></button>
      {list.map((n, i) => (
        <span key={n} className="inline-flex items-center gap-1">
          {i > 0 && n - (list[i - 1] ?? 0) > 1 && <span aria-hidden className="px-1 text-ink-soft">…</span>}
          <button className={cn(btn, n === page && 'bg-ink text-paper hover:bg-ink')} aria-current={n === page ? 'page' : undefined} aria-label={labels.page(n)} onClick={() => onChange(n)}>{n}</button>
        </span>
      ))}
      <button className={btn} disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label={labels.next}><ChevronRight aria-hidden size={18} /></button>
    </nav>
  );
}
