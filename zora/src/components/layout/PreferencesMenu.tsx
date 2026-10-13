'use client';
import { Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';
import { currencies } from '@/config/currency';
import type { Currency, Locale } from '@/domain/types';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useMoney } from '@/hooks/useMoney';
import { usePreferences } from '@/store/preferences';
import { cn } from '../ui/cn';

/** Seletor de idioma (muda a rota /pt ↔ /en) e de moeda (lembrada em localStorage). */
export function PreferencesMenu() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const { currency } = useMoney();
  const setCurrency = usePreferences((s) => s.setCurrency);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const option = (active: boolean) =>
    cn('flex-1 rounded-full px-3 py-2 text-sm font-semibold transition', active ? 'bg-ink text-paper' : 'bg-paper-2 text-ink hover:bg-line');

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${t('header.preferences')} (${locale.toUpperCase()} · ${currency})`}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-bold transition hover:bg-paper-2"
      >
        <Globe aria-hidden size={18} />
        <span>{locale.toUpperCase()} · {currency}</span>
      </button>
      {open && (
        <div id={panelId} className="rise-in absolute right-0 z-50 mt-2 w-72 rounded-lg border border-line bg-paper p-4 shadow-lift">
          <fieldset>
            <legend className="mb-2 text-sm font-bold">{t('common.language')}</legend>
            <div className="flex gap-2">
              {(['pt', 'en'] as const).map((l) => (
                <button key={l} type="button" aria-pressed={l === locale} className={option(l === locale)} onClick={() => { router.replace(pathname, { locale: l }); setOpen(false); }}>
                  {l === 'pt' ? 'Português' : 'English'}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-4">
            <legend className="mb-2 text-sm font-bold">{t('common.currency')}</legend>
            <div className="flex gap-2">
              {currencies.map((c: Currency) => (
                <button key={c} type="button" aria-pressed={c === currency} className={option(c === currency)} onClick={() => { setCurrency(c); setOpen(false); }}>
                  {c === 'BRL' ? t('common.currencyBRL') : t('common.currencyUSD')}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </div>
  );
}
