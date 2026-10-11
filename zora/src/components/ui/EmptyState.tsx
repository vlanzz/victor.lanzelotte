import { cn } from './cn';

export function EmptyState({ icon, title, text, action, className, tone = 'neutral' }: {
  icon?: React.ReactNode; title: string; text?: string; action?: React.ReactNode; className?: string; tone?: 'neutral' | 'error';
}) {
  return (
    <div role={tone === 'error' ? 'alert' : undefined} className={cn('mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center', className)}>
      {icon && <div className={cn('flex size-16 items-center justify-center rounded-full', tone === 'error' ? 'bg-error-soft text-error' : 'bg-honey-soft text-ink')}>{icon}</div>}
      <h2 className="text-2xl">{title}</h2>
      {text && <p className="text-ink-soft">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
