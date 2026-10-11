import { forwardRef } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from './cn';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark';
type Size = 'sm' | 'md' | 'lg';

export const buttonClasses = (variant: Variant = 'primary', size: Size = 'md', full = false) =>
  cn(
    'inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition duration-200',
    'focus-visible:outline-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    size === 'sm' && 'min-h-9 px-4 text-sm',
    size === 'md' && 'min-h-11 px-6 text-[0.95rem]',
    size === 'lg' && 'min-h-12 px-8 text-base',
    variant === 'primary' && 'bg-sun text-white shadow-soft hover:bg-sun-dark hover:shadow-lift',
    variant === 'dark' && 'bg-ink text-paper hover:bg-ink/90',
    variant === 'secondary' && 'border-2 border-ink/80 text-ink hover:bg-ink hover:text-paper',
    variant === 'ghost' && 'text-ink hover:bg-paper-2',
    variant === 'danger' && 'bg-error text-white hover:bg-error/90',
    full && 'w-full',
  );

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  full?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, loading, full, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={cn(buttonClasses(variant, size, full), className)} {...rest}>
      {loading && <Spinner className="size-4" />}
      {children}
    </button>
  );
});

interface ButtonLinkProps extends Omit<React.ComponentProps<typeof Link>, 'className'> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  className?: string;
}

export function ButtonLink({ variant, size, full, className, ...rest }: ButtonLinkProps) {
  return <Link className={cn(buttonClasses(variant, size, full), className)} {...rest} />;
}

export const IconButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }>(function IconButton(
  { label, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn('relative inline-flex size-11 items-center justify-center rounded-full text-ink transition hover:bg-paper-2 active:scale-95 disabled:opacity-50', className)}
      {...rest}
    />
  );
});
