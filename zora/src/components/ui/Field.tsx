import { forwardRef, useId } from 'react';
import { cn } from './cn';

interface FieldProps {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  required?: boolean;
  className?: string;
  children: (ids: { id: string; describedBy: string | undefined; invalid: boolean }) => React.ReactNode;
}

/** Rótulo + controle + dica/erro, com ids ligados (aria-describedby / aria-invalid). */
export function Field({ label, error, hint, required, className, children }: FieldProps) {
  const id = useId();
  const describedBy = [error && `${id}-err`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {required && <span aria-hidden className="text-sun"> *</span>}
      </label>
      {children({ id, describedBy, invalid: !!error })}
      {hint && !error && <p id={`${id}-hint`} className="text-sm text-ink-soft">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="text-sm font-medium text-error">{error}</p>}
    </div>
  );
}

const control = (invalid: boolean) =>
  cn(
    'min-h-11 w-full rounded-md border-2 bg-white px-3.5 text-base text-ink transition placeholder:text-ink-soft/70',
    'hover:border-ink/40 focus:border-lavender-text focus:outline-none focus:ring-4 focus:ring-lavender/25 disabled:bg-paper-2 disabled:opacity-60',
    invalid ? 'border-error' : 'border-line',
  );

type Common = { label: string; error?: string | undefined; hint?: string | undefined; wrapperClassName?: string };

export const TextField = forwardRef<HTMLInputElement, Common & React.InputHTMLAttributes<HTMLInputElement>>(function TextField(
  { label, error, hint, wrapperClassName, required, className, ...rest },
  ref,
) {
  return (
    <Field label={label} error={error} hint={hint} required={required} {...(wrapperClassName ? { className: wrapperClassName } : {})}>
      {({ id, describedBy, invalid }) => (
        <input ref={ref} id={id} aria-describedby={describedBy} aria-invalid={invalid || undefined} required={required} className={cn(control(invalid), className)} {...rest} />
      )}
    </Field>
  );
});

export const TextArea = forwardRef<HTMLTextAreaElement, Common & React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function TextArea(
  { label, error, hint, wrapperClassName, required, className, ...rest },
  ref,
) {
  return (
    <Field label={label} error={error} hint={hint} required={required} {...(wrapperClassName ? { className: wrapperClassName } : {})}>
      {({ id, describedBy, invalid }) => (
        <textarea ref={ref} id={id} rows={4} aria-describedby={describedBy} aria-invalid={invalid || undefined} className={cn(control(invalid), 'py-2.5', className)} {...rest} />
      )}
    </Field>
  );
});

export const SelectField = forwardRef<HTMLSelectElement, Common & React.SelectHTMLAttributes<HTMLSelectElement>>(function SelectField(
  { label, error, hint, wrapperClassName, required, className, children, ...rest },
  ref,
) {
  return (
    <Field label={label} error={error} hint={hint} required={required} {...(wrapperClassName ? { className: wrapperClassName } : {})}>
      {({ id, describedBy, invalid }) => (
        <select ref={ref} id={id} aria-describedby={describedBy} aria-invalid={invalid || undefined} className={cn(control(invalid), 'pr-8', className)} {...rest}>
          {children}
        </select>
      )}
    </Field>
  );
});

export const Checkbox = forwardRef<HTMLInputElement, { label: React.ReactNode; error?: string | undefined } & React.InputHTMLAttributes<HTMLInputElement>>(function Checkbox(
  { label, error, className, ...rest },
  ref,
) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm">
        <input ref={ref} id={id} type="checkbox" aria-invalid={!!error || undefined} aria-describedby={error ? `${id}-err` : undefined} className="mt-0.5 size-5 shrink-0 accent-[var(--color-sun)]" {...rest} />
        <span>{label}</span>
      </label>
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-sm font-medium text-error">{error}</p>}
    </div>
  );
});
