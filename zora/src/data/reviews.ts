import type { L10n, Review } from '@/domain/types';
import { catalogItems } from './catalog-items';
import { pick, rng } from './random';

const authors = ['Ana P.', 'Bruno M.', 'Carla S.', 'Diego R.', 'Eduarda L.', 'Felipe A.', 'Gabi T.', 'Heitor C.', 'Isabela F.', 'João V.', 'Karen B.', 'Lucas O.', 'Marina D.', 'Nina G.', 'Otávio H.', 'Paula N.'];

const good: { title: L10n; body: L10n }[] = [
  { title: { pt: 'Lindo demais!', en: 'So beautiful!' }, body: { pt: 'A estampa é ainda mais bonita pessoalmente. As cores vieram vivas e o acabamento é caprichado.', en: 'The print is even prettier in person. Colors are vivid and the finish is great.' } },
  { title: { pt: 'Presente perfeito', en: 'Perfect gift' }, body: { pt: 'Dei de presente e a pessoa amou. Chegou bem embalado e dentro do prazo.', en: 'Gave it as a gift and they loved it. Arrived well packed and on time.' } },
  { title: { pt: 'Qualidade surpreendente', en: 'Surprising quality' }, body: { pt: 'Esperava algo mais simples, mas a qualidade do material surpreendeu. Recomendo.', en: 'I expected something simpler, but the material quality was a surprise. Recommended.' } },
  { title: { pt: 'Combina com tudo', en: 'Goes with everything' }, body: { pt: 'Ficou ótimo aqui em casa e já recebi vários elogios. Vou comprar outras artes.', en: 'Looks great at home and I have already got lots of compliments. I will buy more art.' } },
  { title: { pt: 'Arte autoral de verdade', en: 'Truly original art' }, body: { pt: 'Dá para sentir o cuidado na ilustração. É diferente de tudo que já vi em lojas por aí.', en: 'You can feel the care in the illustration. Different from anything I have seen elsewhere.' } },
];
const mid: { title: L10n; body: L10n }[] = [
  { title: { pt: 'Bom, mas demorou', en: 'Good, but slow' }, body: { pt: 'O produto é bonito, só achei que a entrega demorou um pouco mais do que o previsto.', en: 'The product is nice, I just thought delivery took a bit longer than expected.' } },
  { title: { pt: 'Cor um pouco diferente', en: 'Slightly different color' }, body: { pt: 'Gostei do resultado, mas a cor ficou um tom mais escuro do que na tela.', en: 'I liked the result, but the color came out a shade darker than on screen.' } },
];

function build(): Review[] {
  const out: Review[] = [];
  catalogItems.forEach((item, idx) => {
    const r = rng(1000 + idx);
    const count = Math.floor(r() * 7); // 0–6
    for (let i = 0; i < count; i++) {
      const isMid = r() < 0.18;
      const tpl = pick(r, isMid ? mid : good);
      const rating = (isMid ? (r() < 0.5 ? 3 : 4) : r() < 0.35 ? 4 : 5) as Review['rating'];
      const day = 1 + Math.floor(r() * 27);
      const month = 5 + Math.floor(r() * 5);
      out.push({
        id: `rev-${idx}-${i}`,
        catalogItemId: item.id,
        author: pick(r, authors),
        rating,
        title: tpl.title,
        body: tpl.body,
        createdAt: new Date(Date.UTC(2026, month, day)).toISOString(),
        status: r() < 0.04 ? 'pending' : 'published',
      });
    }
  });
  return out;
}

export const reviews: Review[] = build();
