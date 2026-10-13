import { cn } from './cn';

/** Tabela de dados com rolagem horizontal no celular. */
export function Table({ children, caption, className }: { children: React.ReactNode; caption: string; className?: string }) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-line bg-white', className)} tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}
export const Th = ({ className, ...p }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th scope="col" className={cn('border-b border-line bg-paper-2 px-4 py-3 text-xs font-bold tracking-wide whitespace-nowrap text-ink-soft uppercase', className)} {...p} />
);
export const Td = ({ className, ...p }: React.TdHTMLAttributes<HTMLTableCellElement>) => <td className={cn('border-b border-line px-4 py-3 align-middle', className)} {...p} />;
