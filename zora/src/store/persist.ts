import { createJSONStorage, type PersistOptions } from 'zustand/middleware';
import type { ZodType } from 'zod';

/** localStorage que nunca lança (modo privado, cota cheia, bloqueio). */
const safeStorage = createJSONStorage(() => ({
  getItem: (k: string) => {
    try { return window.localStorage.getItem(k); } catch { return null; }
  },
  setItem: (k: string, v: string) => {
    try { window.localStorage.setItem(k, v); } catch { /* ignora */ }
  },
  removeItem: (k: string) => {
    try { window.localStorage.removeItem(k); } catch { /* ignora */ }
  },
}));

/**
 * Opções comuns: chave versionada, hidratação manual (evita diferença servidor×cliente)
 * e validação com Zod — dado corrompido é descartado e o estado volta ao padrão.
 */
export function persistOptions<S, P>(name: string, schema: ZodType<P>, pick: (s: S) => P): PersistOptions<S, P> {
  return {
    name: `zora:${name}`,
    version: 1,
    storage: safeStorage as PersistOptions<S, P>['storage'],
    skipHydration: true,
    partialize: pick,
    merge: (persisted, current) => {
      const parsed = schema.safeParse(persisted);
      return parsed.success ? { ...current, ...parsed.data } : current;
    },
  };
}
