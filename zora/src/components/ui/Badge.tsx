import { cn } from './cn';

type Tone = 'neutral' | 'sun' | 'honey' | 'mint' | 'lavender' | 'error' | 'ink';

const tones: Record<Tone, string> = {
  neutral: 'bg-paper-2 text-ink',
  sun: 'bg-sun-soft text-sun-dark',
  honey: 'bg-honey text-ink',
  mint: 'bg-mint-soft text-mint-text',
  lavender: 'bg-lavender-soft text-lavender-text',
  error: 'bg-error-soft text-error',
  ink: 'bg-ink text-paper',
};

export function Badge({ tone = 'neutral', className, ...rest }: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide', tones[tone], className)} {...rest} />;
}
