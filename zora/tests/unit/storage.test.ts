import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { readStored, writeStored } from '@/services/mock/storage';
import { applyOverlay, deleteInOverlay, emptyOverlay, upsertInOverlay } from '@/services/mock/overlay';

class MemStorage implements Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
  data = new Map<string, string>();
  getItem(k: string) { return this.data.get(k) ?? null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}
const mem = () => new MemStorage() as unknown as Storage;

describe('persistência resiliente', () => {
  const schema = z.object({ n: z.number() });
  it('lê o que foi escrito', () => {
    const s = mem();
    writeStored('k', { n: 3 }, s);
    expect(readStored('k', schema, { n: 0 }, s)).toEqual({ n: 3 });
  });
  it('JSON corrompido ou fora do formato vira o padrão', () => {
    const s = mem();
    s.setItem('zora:k', '{oops');
    expect(readStored('k', schema, { n: 0 }, s)).toEqual({ n: 0 });
    s.setItem('zora:k', JSON.stringify({ n: 'x' }));
    expect(readStored('k', schema, { n: 0 }, s)).toEqual({ n: 0 });
  });
  it('sem localStorage não quebra', () => {
    expect(readStored('k', schema, { n: 1 }, null)).toEqual({ n: 1 });
    expect(() => writeStored('k', {}, null)).not.toThrow();
  });
});

describe('overlay do admin', () => {
  type T = { id: string; v: number };
  const key = (t: T) => t.id;
  const seed: T[] = [{ id: 'a', v: 1 }, { id: 'b', v: 2 }];
  it('edita, cria e remove sem alterar o seed', () => {
    let o = emptyOverlay<T>();
    o = upsertInOverlay(o, { id: 'a', v: 10 }, key);
    o = upsertInOverlay(o, { id: 'c', v: 3 }, key);
    o = deleteInOverlay(o, 'b', key);
    expect(applyOverlay(seed, o, key)).toEqual([{ id: 'a', v: 10 }, { id: 'c', v: 3 }]);
    expect(seed).toHaveLength(2);
  });
  it('recriar um item removido o traz de volta', () => {
    let o = deleteInOverlay(emptyOverlay<T>(), 'b', key);
    o = upsertInOverlay(o, { id: 'b', v: 5 }, key);
    expect(applyOverlay(seed, o, key)).toContainEqual({ id: 'b', v: 5 });
  });
});
