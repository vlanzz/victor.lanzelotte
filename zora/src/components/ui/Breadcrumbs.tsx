import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export function Breadcrumbs({ items, label }: { items: { label: string; href?: string }[]; label: string }) {
  return (
    <nav aria-label={label} className="text-sm text-ink-soft">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={i} className="inline-flex items-center gap-1">
            {i > 0 && <ChevronRight aria-hidden size={14} />}
            {it.href ? <Link href={it.href} className="underline-offset-4 hover:text-ink hover:underline">{it.label}</Link> : <span aria-current="page" className="font-semibold text-ink">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
