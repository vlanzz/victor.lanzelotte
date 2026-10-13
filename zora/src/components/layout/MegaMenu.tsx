'use client';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';
import { categories } from '@/data/categories';
import { niches } from '@/data/niches';
import { useL10n } from '@/hooks/useL10n';
import { Link } from '@/i18n/navigation';

/** Menu "Explorar": categorias e coleções (nichos). Abre por clique/Enter e fecha com Esc ou ao navegar. */
export function MegaMenu() {
  const t = useTranslations('nav');
  const l = useL10n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div ref={ref} className="relative" onMouseLeave={() => setOpen(false)}>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} onMouseEnter={() => setOpen(true)} className="inline-flex min-h-11 items-center gap-1 rounded-full px-4 font-semibold transition hover:bg-paper-2">
        {t('explore')}
        <ChevronDown aria-hidden size={16} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div id={id} onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)} className="rise-in absolute top-full left-0 z-50 w-[44rem] rounded-xl border border-line bg-paper p-6 shadow-lift">
          <div className="grid grid-cols-[1fr_1.4fr] gap-8">
            <div>
              <p className="mb-3 text-xs font-bold tracking-widest text-ink-soft uppercase">{t('categories')}</p>
              <ul className="space-y-1">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link href={`/c/${c.id}`} className="flex items-center gap-3 rounded-md px-2 py-2 font-medium hover:bg-paper-2">
                      <span aria-hidden className="size-3 rounded-full" style={{ background: c.color }} />
                      {l(c.name)}
                    </Link>
                  </li>
                ))}
                <li><Link href="/search" className="block px-2 py-2 text-sm font-bold text-sun-dark underline-offset-4 hover:underline">{t('allProducts')} →</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold tracking-widest text-ink-soft uppercase">{t('niches')}</p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                {niches.map((n) => (
                  <li key={n.id}>
                    <Link href={`/n/${n.slug}`} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-paper-2">
                      <span aria-hidden className="size-3 shrink-0 rounded-full" style={{ background: n.color }} />
                      <span className="leading-tight">{l(n.name)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
