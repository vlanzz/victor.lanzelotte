'use client';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useHydration } from '@/store/hydration';
import { useToasts } from '@/store/toast';
import { useWishlist } from '@/store/wishlist';
import { cn } from '@/components/ui/cn';

export function WishlistButton({ itemId, name, className, withLabel }: { itemId: string; name: string; className?: string; withLabel?: string }) {
  const t = useTranslations('card');
  const tn = useTranslations('nav');
  const active = useWishlist((s) => s.ids.includes(itemId));
  const toggle = useWishlist((s) => s.toggle);
  const hydrated = useHydration((s) => s.done);
  const on = hydrated && active;
  const push = useToasts((s) => s.push);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? t('removeWishlist', { name }) : t('addWishlist', { name })}
      onClick={(e) => {
        e.preventDefault();
        const added = toggle(itemId);
        if (added) push({ tone: 'success', message: `${name} ♥`, action: { label: tn('wishlist'), href: '/wishlist' } });
      }}
      className={cn('inline-flex items-center justify-center gap-2 rounded-full bg-white/90 text-ink shadow-soft backdrop-blur transition hover:scale-105 active:scale-95', withLabel ? 'min-h-11 px-5 font-semibold' : 'size-10', className)}
    >
      <Heart aria-hidden size={20} className={cn('transition', on ? 'fill-sun text-sun' : '')} />
      {withLabel}
    </button>
  );
}
