import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { arts } from '@/data/arts';

describe('artes placeholder', () => {
  it('todo arquivo do manifesto existe em public/', () => {
    for (const a of arts) expect(existsSync(join(process.cwd(), 'public', a.file)), a.file).toBe(true);
  });
  it('slugs de arte são únicos', () => {
    expect(new Set(arts.map((a) => a.slug)).size).toBe(arts.length);
  });
});
