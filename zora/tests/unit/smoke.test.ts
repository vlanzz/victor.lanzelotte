import { describe, expect, it } from 'vitest';
import pt from '@/messages/pt';
import en from '@/messages/en';

const keys = (o: Record<string, unknown>, p = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v as Record<string, unknown>, `${p}${k}.`) : [`${p}${k}`],
  );

describe('i18n', () => {
  it('PT e EN têm exatamente as mesmas chaves', () => {
    expect(keys(en).sort()).toEqual(keys(pt).sort());
  });
});
