'use client';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId, useMemo, useRef, useState } from 'react';
import { categories } from '@/data/categories';
import { searchEntries } from '@/domain/catalog';
import { useL10n } from '@/hooks/useL10n';
import { useRouter } from '@/i18n/navigation';
import { useCatalog } from '../providers/CatalogProvider';
import { cn } from '../ui/cn';
import { normalizeText } from '@/domain/catalog';

interface Suggestion {
  key: string;
  label: string;
  kind: string;
  href: string;
}

/** Campo de busca com sugestões (combobox ARIA): produtos, coleções e categorias. */
export function SearchBox({ className, onDone }: { className?: string; onDone?: () => void }) {
  const t = useTranslations('header');
  const l = useL10n();
  const router = useRouter();
  const { entries, snapshot } = useCatalog();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo<Suggestion[]>(() => {
    const term = normalizeText(q);
    if (term.length < 2) return [];
    const out: Suggestion[] = [];
    for (const n of snapshot.niches) {
      if (normalizeText(`${n.name.pt} ${n.name.en}`).includes(term)) out.push({ key: `n-${n.id}`, label: l(n.name), kind: t('collection'), href: `/n/${n.slug}` });
    }
    for (const c of categories) {
      if (normalizeText(`${c.name.pt} ${c.name.en}`).includes(term)) out.push({ key: `c-${c.id}`, label: l(c.name), kind: t('category'), href: `/c/${c.id}` });
    }
    for (const e of searchEntries(entries, q, snapshot.niches).slice(0, 5)) {
      out.push({ key: e.item.id, label: l(e.name), kind: t('product'), href: `/p/${e.item.slug}` });
    }
    return out.slice(0, 7);
  }, [q, entries, snapshot.niches, l, t]);

  const go = (href: string) => {
    setOpen(false);
    setQ('');
    onDone?.();
    router.push(href);
  };
  const submit = () => {
    const picked = suggestions[active];
    if (picked) return go(picked.href);
    if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const expanded = open && q.trim().length >= 2;
  return (
    <div className={cn('relative', className)} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}>
      <form role="search" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <label htmlFor={`${listId}-in`} className="sr-only">{t('searchLabel')}</label>
        <Search aria-hidden size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-soft" />
        <input
          id={`${listId}-in`}
          ref={inputRef}
          role="combobox"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          value={q}
          placeholder={t('searchPlaceholder')}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, suggestions.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
            if (e.key === 'Escape') setOpen(false);
          }}
          className="min-h-11 w-full rounded-full border-2 border-line bg-white pr-4 pl-11 text-base transition placeholder:text-ink-soft/70 hover:border-ink/40 focus:border-lavender-text focus:ring-4 focus:ring-lavender/25 focus:outline-none"
        />
      </form>
      {expanded && (
        <ul id={listId} role="listbox" aria-label={t('suggestions')} className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-line bg-paper py-1 shadow-lift">
          {suggestions.map((s, i) => (
            <li key={s.key} id={`${listId}-${i}`} role="option" aria-selected={i === active} onMouseDown={(e) => e.preventDefault()} onClick={() => go(s.href)} className={cn('flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm', i === active ? 'bg-honey-soft' : 'hover:bg-paper-2')}>
              <span className="truncate font-medium">{s.label}</span>
              <span className="shrink-0 text-xs text-ink-soft">{s.kind}</span>
            </li>
          ))}
          <li role="option" aria-selected={false} onMouseDown={(e) => e.preventDefault()} onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)} className="cursor-pointer border-t border-line px-4 py-2.5 text-sm font-semibold text-sun-dark hover:bg-paper-2">
            {t('seeAll', { q: q.trim() })}
          </li>
        </ul>
      )}
    </div>
  );
}
