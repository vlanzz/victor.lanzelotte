'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { CatalogEntry } from '@/domain/catalog';
import { fromPrice } from '@/domain/pricing';
import { resolveSelection } from '@/domain/pricing';
import { useL10n } from '@/hooks/useL10n';
import { useMoney } from '@/hooks/useMoney';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/Badge';
import { Stars } from '@/components/ui/Stars';
import { Mockup } from '@/components/domain/mockup/Mockup';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { WishlistButton } from './WishlistButton';

export function ProductCard({ entry, priority }: { entry: CatalogEntry; priority?: boolean }) {
  const t = useTranslations('card');
  const l = useL10n();
  const { format, currency } = useMoney();
  const { snapshot } = useCatalog();
  const { product, type, art, item } = entry;
  const colorAxis = product.options.find((o) => o.kind === 'color');
  const [color, setColor] = useState<string | null>(null);
  const selection = resolveSelection(product, colorAxis && color ? { [colorAxis.id]: color } : {});
  const name = l(entry.name);
  const niche = snapshot.niches.find((n) => n.id === art.nicheIds[0]);
  const label = `${name}`;
  void priority;

  return (
    <article className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-lg bg-paper-2 shadow-soft transition duration-300 group-hover:shadow-lift">
        <Link href={`/p/${item.slug}`} aria-label={name} className="block">
          <div className="relative aspect-square">
            <Mockup type={type} product={product} selection={selection} art={art} label={label} className="absolute inset-0 size-full" />
            <Mockup type={type} product={product} selection={selection} art={art} view="scene" {...(niche ? { accent: niche.color } : {})} label="" className="absolute inset-0 size-full opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100" />
          </div>
        </Link>
        <div className="pointer-events-none absolute top-3 left-3 flex gap-1.5">
          {item.isNew && <Badge tone="sun">{t('new')}</Badge>}
          {item.featured && <Badge tone="honey">{t('featured')}</Badge>}
        </div>
        <WishlistButton itemId={item.id} name={name} className="absolute top-3 right-3" />
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1 px-1">
        <h3 className="font-sans text-base leading-snug font-semibold">
          <Link href={`/p/${item.slug}`} className="after:absolute after:inset-0 hover:underline hover:underline-offset-4">{name}</Link>
        </h3>
        <div className="flex items-center gap-2 text-sm text-ink-soft">
          {entry.reviewCount > 0 ? (
            <>
              <Stars value={entry.rating} size={14} label={t('ratingLabel', { value: entry.rating })} />
              <span>({entry.reviewCount})</span>
            </>
          ) : (
            <span>{t('noReviews')}</span>
          )}
        </div>
        <p className="mt-auto pt-1 text-base">
          <span className="text-sm text-ink-soft">{t('from')} </span>
          <span className="font-bold">{format(fromPrice(product, currency))}</span>
        </p>
        {colorAxis && colorAxis.values.length > 1 && (
          <ul aria-label={t('colors')} className="relative z-10 mt-1 flex items-center gap-1.5">
            {colorAxis.values.slice(0, 6).map((v) => (
              <li key={v.id}>
                <button type="button" aria-label={l(v.label)} aria-pressed={selection[colorAxis.id] === v.id} onMouseEnter={() => setColor(v.id)} onFocus={() => setColor(v.id)} onClick={() => setColor(v.id)} className="size-4 rounded-full border border-ink/25 transition hover:scale-125 aria-pressed:ring-2 aria-pressed:ring-ink aria-pressed:ring-offset-1" style={{ background: v.swatch }} />
              </li>
            ))}
            {colorAxis.values.length > 6 && <li className="text-xs text-ink-soft">+{colorAxis.values.length - 6}</li>}
          </ul>
        )}
      </div>
    </article>
  );
}
