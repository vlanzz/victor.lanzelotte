import { z } from 'zod';
import { readStored, removeStored, writeStored, storageKeys } from './storage';

/** "Sobreposição" sobre os dados de demonstração: o que o admin criou/editou/removeu. */
export interface Overlay<T> {
  upserts: T[];
  deletes: string[];
}

const overlaySchema = z.object({
  upserts: z.array(z.object({}).loose()),
  deletes: z.array(z.string()),
});

export const emptyOverlay = <T,>(): Overlay<T> => ({ upserts: [], deletes: [] });

export function applyOverlay<T>(seed: T[], overlay: Overlay<T>, keyOf: (t: T) => string): T[] {
  const removed = new Set(overlay.deletes);
  const replaced = new Map(overlay.upserts.map((u) => [keyOf(u), u]));
  const merged = seed.filter((s) => !removed.has(keyOf(s))).map((s) => replaced.get(keyOf(s)) ?? s);
  const seedKeys = new Set(seed.map(keyOf));
  const added = overlay.upserts.filter((u) => !seedKeys.has(keyOf(u)) && !removed.has(keyOf(u)));
  return [...merged, ...added];
}

export function upsertInOverlay<T>(o: Overlay<T>, item: T, keyOf: (t: T) => string): Overlay<T> {
  const k = keyOf(item);
  return {
    upserts: [...o.upserts.filter((u) => keyOf(u) !== k), item],
    deletes: o.deletes.filter((d) => d !== k),
  };
}

export function deleteInOverlay<T>(o: Overlay<T>, key: string, keyOf: (t: T) => string): Overlay<T> {
  return {
    upserts: o.upserts.filter((u) => keyOf(u) !== key),
    deletes: o.deletes.includes(key) ? o.deletes : [...o.deletes, key],
  };
}

export function loadOverlay<T>(name: string): Overlay<T> {
  return readStored(storageKeys.overlay(name), overlaySchema, emptyOverlay()) as unknown as Overlay<T>;
}
export const saveOverlay = <T,>(name: string, o: Overlay<T>) => writeStored(storageKeys.overlay(name), o);
export const clearOverlay = (name: string) => removeStored(storageKeys.overlay(name));
