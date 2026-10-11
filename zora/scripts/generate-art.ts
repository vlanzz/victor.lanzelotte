/**
 * Gera as artes placeholder em public/art/<nicho>/<slug>.svg a partir de src/data/arts.ts.
 * Rode: npm run art   (somente para os placeholders; artes reais não passam por aqui)
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { arts } from '../src/data/arts';
import { hashStr, rng, SIZE, svg } from './art/lib';
import { motifs } from './art/motifs';

const root = join(import.meta.dirname, '..', 'public');
let n = 0;
for (const art of arts) {
  const motif = motifs[art.motif ?? ''];
  if (!motif) throw new Error(`Motif desconhecido: ${art.motif} (${art.slug})`);
  const [w, h] = SIZE[art.orientation];
  const body = motif(w, h, art.palette, rng(hashStr(art.slug)));
  const file = join(root, art.file);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, svg(w, h, art.palette[0]!, body, art.title.pt));
  n++;
}
console.log(`${n} artes geradas em public/art/`);
