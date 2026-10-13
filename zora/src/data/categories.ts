import type { Category } from '@/domain/types';

export const categories: Category[] = [
  { id: 'home', name: { pt: 'Casa', en: 'Home' }, blurb: { pt: 'Para deixar cada cantinho com a sua cara.', en: 'To make every corner feel like you.' }, color: '#F5A9A0' },
  { id: 'stationery', name: { pt: 'Papelaria', en: 'Stationery' }, blurb: { pt: 'Cadernos, planners e pequenos prazeres de papel.', en: 'Notebooks, planners and small paper joys.' }, color: '#FBD66B' },
  { id: 'apparel', name: { pt: 'Vestuário e acessórios', en: 'Apparel & accessories' }, blurb: { pt: 'Arte para vestir e levar por aí.', en: 'Art to wear and carry around.' }, color: '#B9ADFB' },
  { id: 'tech', name: { pt: 'Tech', en: 'Tech' }, blurb: { pt: 'Seus eletrônicos também merecem ilustração.', en: 'Your gadgets deserve illustration too.' }, color: '#9CC9EE' },
  { id: 'pets', name: { pt: 'Pets', en: 'Pets' }, blurb: { pt: 'Para quem tem quatro patas na família.', en: 'For the four-legged family members.' }, color: '#F7C6A3' },
  { id: 'other', name: { pt: 'Outros', en: 'More' }, blurb: { pt: 'Garrafas, quebra-cabeças, bandeiras e mais.', en: 'Bottles, puzzles, flags and more.' }, color: '#A9D8A0' },
];
