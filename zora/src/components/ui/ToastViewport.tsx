'use client';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useToasts } from '@/store/toast';
import { cn } from './cn';

const icon = { success: CheckCircle2, error: XCircle, info: Info } as const;

export function ToastViewport() {
  const { toasts, dismiss } = useToasts();
  const t = useTranslations('common');
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 md:inset-x-auto md:right-6 md:bottom-6 md:items-end">
      {toasts.map((x) => {
        const Icon = icon[x.tone];
        return (
          <div key={x.id} role={x.tone === 'error' ? 'alert' : 'status'} className={cn('rise-in pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg bg-ink px-4 py-3 text-paper shadow-lift')}>
            <Icon aria-hidden size={20} className={x.tone === 'error' ? 'text-sun-soft' : x.tone === 'success' ? 'text-mint-soft' : 'text-honey'} />
            <p className="flex-1 text-sm font-medium">{x.message}</p>
            {x.action && <Link href={x.action.href} className="text-sm font-bold text-honey underline-offset-4 hover:underline">{x.action.label}</Link>}
            <button onClick={() => dismiss(x.id)} aria-label={t('close')} className="rounded-full p-1 hover:bg-paper/15"><X aria-hidden size={16} /></button>
          </div>
        );
      })}
    </div>
  );
}
