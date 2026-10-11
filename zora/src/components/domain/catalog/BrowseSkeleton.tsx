import { Skeleton } from '@/components/ui/Skeleton';

/** Estado "carregando" da listagem (também usado como fallback do Suspense). */
export function BrowseSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr]" aria-busy="true">
      <div className="hidden space-y-4 lg:block">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-24" />)}</div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="space-y-3"><Skeleton className="aspect-square rounded-lg" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/3" /></li>
        ))}
      </ul>
    </div>
  );
}
