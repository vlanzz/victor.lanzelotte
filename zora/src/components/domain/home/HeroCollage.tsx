'use client';
import { useMemo } from 'react';
import { Mockup } from '@/components/domain/mockup/Mockup';
import { useCatalog } from '@/components/providers/CatalogProvider';
import { useL10n } from '@/hooks/useL10n';
import { Link } from '@/i18n/navigation';

const PICKS = ['mug', 'decor-frame', 'tshirt', 'pillow'];

/** Colagem de mockups do hero sobre um "sol nascente". */
export function HeroCollage() {
  const { entries } = useCatalog();
  const l = useL10n();
  const picks = useMemo(
    () => PICKS.flatMap((typeId) => {
      const e = entries.find((x) => x.type.id === typeId && x.item.featured) ?? entries.find((x) => x.type.id === typeId);
      return e ? [e] : [];
    }),
    [entries],
  );
  const pos = ['left-[2%] top-[34%] w-[44%] rotate-[-6deg]', 'right-[4%] top-[2%] w-[46%] rotate-[5deg]', 'left-[24%] top-[0%] w-[42%] rotate-[-2deg] z-10', 'right-[2%] bottom-[0%] w-[40%] rotate-[8deg]'];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-xl">
      <div aria-hidden className="absolute inset-[6%] rounded-full bg-honey" />
      <div aria-hidden className="absolute inset-[18%] rounded-full bg-sun-soft" />
      {picks.map((e, i) => (
        <Link key={e.item.id} href={`/p/${e.item.slug}`} className={`rise-in absolute drop-shadow-xl transition hover:z-20 hover:scale-105 ${pos[i]}`} style={{ animationDelay: `${i * 90}ms` }}>
          <Mockup type={e.type} product={e.product} art={e.art} label={l(e.name)} className="w-full" />
        </Link>
      ))}
    </div>
  );
}
