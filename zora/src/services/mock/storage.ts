/** Acesso resiliente ao localStorage: nunca lança; dados corrompidos viram o valor padrão. */
import type { ZodType } from 'zod';

const PREFIX = 'zora:';

function ls(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readStored<T>(key: string, schema: ZodType<T>, fallback: T, storage: Storage | null = ls()): T {
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}

export function writeStored(key: string, value: unknown, storage: Storage | null = ls()): void {
  if (!storage) return;
  try {
    storage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* cota cheia ou modo privado: ignora, o site continua funcionando em memória */
  }
}

export function removeStored(key: string, storage: Storage | null = ls()): void {
  try {
    storage?.removeItem(PREFIX + key);
  } catch {
    /* ignora */
  }
}

/** Nome das chaves usadas (útil para o botão "restaurar dados de demonstração"). */
export const storageKeys = {
  overlay: (name: string) => `overlay:${name}`,
  session: 'session',
} as const;
