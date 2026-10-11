'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { buildEntries, type CatalogEntry, type CatalogSnapshot } from '@/domain/catalog';
import type { Coupon } from '@/domain/types';
import { seedSnapshot } from '@/services/mock/catalog';
import { catalogRepo } from '@/services';

interface CatalogContextValue {
  snapshot: CatalogSnapshot;
  entries: CatalogEntry[];
  coupons: Coupon[];
  bySlug: (slug: string) => CatalogEntry | undefined;
  byId: (id: string) => CatalogEntry | undefined;
  /** Relê os dados (use depois de alterações feitas no admin). */
  refresh: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

/**
 * Começa com os dados de demonstração (primeira pintura igual no servidor e no cliente) e,
 * ao montar, aplica o que o admin alterou (guardado em localStorage).
 */
export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<CatalogSnapshot>(seedSnapshot);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const refresh = useCallback(async () => {
    const [s, c] = await Promise.all([catalogRepo.getSnapshot(), catalogRepo.getCoupons()]);
    setSnapshot(s);
    setCoupons(c);
  }, []);

  useEffect(() => {
    let alive = true;
    void Promise.all([catalogRepo.getSnapshot(), catalogRepo.getCoupons()]).then(([s, c]) => {
      if (!alive) return;
      setSnapshot(s);
      setCoupons(c);
    });
    return () => { alive = false; };
  }, []);

  const value = useMemo<CatalogContextValue>(() => {
    const entries = buildEntries(snapshot);
    const slugs = new Map(entries.map((e) => [e.item.slug, e]));
    const ids = new Map(entries.map((e) => [e.item.id, e]));
    return { snapshot, entries, coupons, bySlug: (s) => slugs.get(s), byId: (i) => ids.get(i), refresh };
  }, [snapshot, coupons, refresh]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog precisa estar dentro de <CatalogProvider>');
  return ctx;
}
