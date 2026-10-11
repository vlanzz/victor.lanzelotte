import type { Niche } from '@/domain/types';

const INK = '#241C3D';

export const niches: Niche[] = [
  { id: 'pets', slug: 'pets', name: { pt: 'Pets', en: 'Pets' }, blurb: { pt: 'Gatos, cachorros e todos os bichinhos que mandam na casa.', en: 'Cats, dogs and every little critter who runs the house.' }, color: '#F7C6A3', onColor: INK },
  { id: 'geek', slug: 'games-geek', name: { pt: 'Games e cultura geek', en: 'Games & geek culture' }, blurb: { pt: 'Pixels, dados e portais para outros mundos.', en: 'Pixels, dice and portals to other worlds.' }, color: '#B9ADFB', onColor: INK },
  { id: 'professions', slug: 'professions', name: { pt: 'Profissões', en: 'Professions' }, blurb: { pt: 'Para quem ama o que faz (ou ama quem faz).', en: 'For those who love what they do (or who love someone who does).' }, color: '#9DD3C7', onColor: INK },
  { id: 'dates', slug: 'special-dates', name: { pt: 'Datas comemorativas', en: 'Special dates' }, blurb: { pt: 'Natal, Dia das Mães e todo motivo para presentear.', en: 'Christmas, Mother’s Day and every reason to gift.' }, color: '#F5A9A0', onColor: INK },
  { id: 'minimal', slug: 'minimal-decor', name: { pt: 'Decoração minimalista', en: 'Minimalist decor' }, blurb: { pt: 'Formas calmas, cores suaves, muito respiro.', en: 'Calm shapes, soft colors, lots of breathing room.' }, color: '#E8DFCC', onColor: INK },
  { id: 'nature', slug: 'nature-botanical', name: { pt: 'Natureza e botânica', en: 'Nature & botanical' }, blurb: { pt: 'Folhas, flores e um pouco de mato dentro de casa.', en: 'Leaves, flowers and a bit of wild indoors.' }, color: '#A9D8A0', onColor: INK },
  { id: 'kids', slug: 'kids', name: { pt: 'Infantil', en: 'Kids' }, blurb: { pt: 'Cores vivas e personagens para os pequenos.', en: 'Bright colors and characters for little ones.' }, color: '#FBD66B', onColor: INK },
  { id: 'travel', slug: 'travel-cities', name: { pt: 'Viagens e cidades', en: 'Travel & cities' }, blurb: { pt: 'Mapas, skylines e lugares que moram na gente.', en: 'Maps, skylines and places that live in us.' }, color: '#9CC9EE', onColor: INK },
  { id: 'quotes', slug: 'quotes-typography', name: { pt: 'Frases e tipografia', en: 'Quotes & typography' }, blurb: { pt: 'Palavras que merecem moldura.', en: 'Words that deserve a frame.' }, color: '#F2B33D', onColor: INK },
  { id: 'music', slug: 'music-abstract', name: { pt: 'Música e arte abstrata', en: 'Music & abstract art' }, blurb: { pt: 'Ondas, ritmos e formas livres.', en: 'Waves, rhythms and free-form shapes.' }, color: '#E7A8D6', onColor: INK },
];
