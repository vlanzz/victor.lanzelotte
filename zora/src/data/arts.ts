import type { Art, Orientation } from '@/domain/types';

/**
 * MANIFESTO DE ARTES — para trocar as artes placeholder pelas reais:
 * 1) coloque o arquivo (SVG/PNG/WebP) em public/art/<nicho>/
 * 2) ajuste `file` da arte correspondente abaixo (ou cadastre pelo painel admin).
 * Os placeholders são gerados por `npm run art` a partir desta lista (nicho + motif + palette).
 */
type Row = [niche: string, slug: string, pt: string, en: string, orientation: Orientation, motif: string, palette: string[]];

const rows: Row[] = [
  // Pets
  ['pets', 'gato-lua', 'Gato da lua', 'Moon cat', 'portrait', 'cat', ['#F7C6A3', '#241C3D', '#F2B33D', '#C8421C', '#FBF6EE']],
  ['pets', 'cachorro-sol', 'Cachorro ao sol', 'Sunny dog', 'square', 'dog', ['#FDE3D8', '#8A4B2A', '#F2B33D', '#241C3D', '#FBF6EE']],
  ['pets', 'raposa-aurora', 'Raposa da aurora', 'Dawn fox', 'landscape', 'fox', ['#F4E3CE', '#C8421C', '#FBF6EE', '#241C3D', '#F2B33D']],
  ['pets', 'patinhas', 'Patinhas por toda parte', 'Paws everywhere', 'square', 'paws', ['#241C3D', '#F7C6A3', '#F2B33D', '#8B7CF6', '#FBF6EE']],
  // Games e geek
  ['geek', 'coracao-pixel', 'Coração pixelado', 'Pixel heart', 'square', 'pixel-heart', ['#241C3D', '#C8421C', '#F2B33D', '#B9ADFB', '#FBF6EE']],
  ['geek', 'dados-d20', 'Rolou 20', 'Rolled a 20', 'portrait', 'dice', ['#2B2350', '#B9ADFB', '#F2B33D', '#FBF6EE', '#C8421C']],
  ['geek', 'portal-estelar', 'Portal estelar', 'Starry portal', 'landscape', 'portal', ['#1B1740', '#8B7CF6', '#F2B33D', '#E7A8D6', '#FBF6EE']],
  ['geek', 'controle-retro', 'Controle retrô', 'Retro controller', 'landscape', 'gamepad', ['#B9ADFB', '#241C3D', '#C8421C', '#F2B33D', '#FBF6EE']],
  // Profissões
  ['professions', 'cafe-dev', 'Dev movido a café', 'Coffee-powered dev', 'square', 'code', ['#E3F3EF', '#1B6F5F', '#241C3D', '#F2B33D', '#FBF6EE']],
  ['professions', 'jaleco-saude', 'Cuidar é arte', 'Caring is art', 'portrait', 'care', ['#E3F3EF', '#2E9C86', '#C8421C', '#241C3D', '#FBF6EE']],
  ['professions', 'lapis-design', 'Designer em ação', 'Designer at work', 'landscape', 'design', ['#FBF6EE', '#C8421C', '#8B7CF6', '#241C3D', '#F2B33D']],
  ['professions', 'ferramentas', 'Mão na massa', 'Hands-on', 'square', 'tools', ['#F4ECDD', '#241C3D', '#F2B33D', '#2E9C86', '#C8421C']],
  // Datas comemorativas
  ['dates', 'natal-estrela', 'Estrela de Natal', 'Christmas star', 'portrait', 'xmas', ['#1F4A3A', '#FBF6EE', '#F2B33D', '#C8421C', '#9DD3C7']],
  ['dates', 'maes-flores', 'Para a mãe, com flores', 'Flowers for mom', 'square', 'bouquet', ['#FDE3D8', '#C8421C', '#F5A9A0', '#2E9C86', '#241C3D']],
  ['dates', 'amor-coracoes', 'Dia dos namorados', 'Valentine’s hearts', 'square', 'hearts', ['#F5A9A0', '#C8421C', '#FBF6EE', '#241C3D', '#F2B33D']],
  ['dates', 'festa-confete', 'Hora da festa', 'Party time', 'landscape', 'confetti', ['#FBF6EE', '#C8421C', '#F2B33D', '#8B7CF6', '#2E9C86']],
  // Minimalista
  ['minimal', 'arcos-areia', 'Arcos de areia', 'Sand arches', 'portrait', 'arches', ['#F4ECDD', '#D8C3A5', '#C8694B', '#241C3D', '#FBF6EE']],
  ['minimal', 'sol-horizonte', 'Sol no horizonte', 'Sun on the horizon', 'landscape', 'horizon', ['#FBF6EE', '#C8421C', '#F2B33D', '#241C3D', '#D8C3A5']],
  ['minimal', 'formas-calmas', 'Formas calmas', 'Calm shapes', 'square', 'shapes', ['#EFE6D6', '#A9BFA0', '#F1C9C4', '#241C3D', '#D8C3A5']],
  ['minimal', 'linhas-suaves', 'Linhas suaves', 'Soft lines', 'portrait', 'lines', ['#FBF6EE', '#241C3D', '#C8694B', '#D8C3A5', '#A9BFA0']],
  // Natureza
  ['nature', 'folhagem', 'Folhagem', 'Foliage', 'portrait', 'leaves', ['#E8F3E1', '#3E5C4A', '#2E9C86', '#A9D8A0', '#F2B33D']],
  ['nature', 'flores-campo', 'Flores do campo', 'Wildflowers', 'landscape', 'wildflowers', ['#FBF6EE', '#C8421C', '#F2B33D', '#8B7CF6', '#3E5C4A']],
  ['nature', 'monstera', 'Monstera', 'Monstera', 'square', 'monstera', ['#F4ECDD', '#2E7358', '#3E5C4A', '#A9D8A0', '#241C3D']],
  ['nature', 'cogumelos', 'Cogumelos', 'Mushrooms', 'square', 'mushrooms', ['#F7E9D6', '#C8421C', '#FBF6EE', '#8A4B2A', '#3E5C4A']],
  // Infantil
  ['kids', 'dino-feliz', 'Dino feliz', 'Happy dino', 'square', 'dino', ['#FFF1C2', '#2E9C86', '#F2B33D', '#C8421C', '#241C3D']],
  ['kids', 'foguete-lua', 'Foguete e lua', 'Rocket and moon', 'portrait', 'rocket', ['#CFE6F7', '#8B7CF6', '#F2B33D', '#C8421C', '#241C3D']],
  ['kids', 'arco-iris', 'Arco-íris', 'Rainbow', 'landscape', 'rainbow', ['#FFF1C2', '#C8421C', '#F2B33D', '#2E9C86', '#8B7CF6']],
  ['kids', 'bichos-alegres', 'Bichos alegres', 'Happy critters', 'square', 'critters', ['#FDE3D8', '#F2B33D', '#2E9C86', '#8B7CF6', '#241C3D']],
  // Viagens
  ['travel', 'skyline-noite', 'Skyline à noite', 'Night skyline', 'landscape', 'skyline', ['#1B2748', '#F2B33D', '#9CC9EE', '#E7A8D6', '#FBF6EE']],
  ['travel', 'mapa-mundi', 'Mundo para explorar', 'World to explore', 'landscape', 'worldmap', ['#EAF3FA', '#26355D', '#2E9C86', '#F2B33D', '#C8421C']],
  ['travel', 'bonde-cidade', 'Bonde na cidade', 'City tram', 'portrait', 'tram', ['#FBF0D4', '#C8421C', '#26355D', '#F2B33D', '#241C3D']],
  ['travel', 'passaporte', 'Carimbos de viagem', 'Travel stamps', 'square', 'stamps', ['#F4ECDD', '#26355D', '#C8421C', '#2E9C86', '#F2B33D']],
  // Frases
  ['quotes', 'comece-agora', 'Comece agora', 'Start now', 'portrait', 'type-start', ['#F2B33D', '#241C3D', '#FBF6EE', '#C8421C', '#8B7CF6']],
  ['quotes', 'bom-dia-sol', 'Bom dia, sol', 'Good morning, sun', 'landscape', 'type-morning', ['#FBF6EE', '#C8421C', '#F2B33D', '#241C3D', '#F5A9A0']],
  ['quotes', 'sem-pressa', 'Sem pressa', 'No rush', 'square', 'type-slow', ['#E8F3E1', '#3E5C4A', '#FBF6EE', '#241C3D', '#A9D8A0']],
  ['quotes', 'cafe-primeiro', 'Café primeiro', 'Coffee first', 'portrait', 'type-coffee', ['#F4ECDD', '#8A4B2A', '#241C3D', '#F2B33D', '#FBF6EE']],
  // Música e abstrata
  ['music', 'ondas-sonoras', 'Ondas sonoras', 'Sound waves', 'landscape', 'waves', ['#241C3D', '#E7A8D6', '#8B7CF6', '#F2B33D', '#FBF6EE']],
  ['music', 'vinil', 'Vinil girando', 'Spinning vinyl', 'square', 'vinyl', ['#F5A9A0', '#241C3D', '#C8421C', '#F2B33D', '#FBF6EE']],
  ['music', 'abstrato-aurora', 'Abstrato aurora', 'Aurora abstract', 'portrait', 'aurora', ['#FBF6EE', '#E7A8D6', '#F2B33D', '#8B7CF6', '#C8421C']],
  ['music', 'ritmo-formas', 'Ritmo de formas', 'Rhythm of shapes', 'square', 'rhythm', ['#EFE6D6', '#C8421C', '#26355D', '#F2B33D', '#2E9C86']],
];

/** Artes que também aparecem em outra coleção. */
const alsoIn: Record<string, string[]> = {
  'raposa-aurora': ['nature'],
  'bichos-alegres': ['pets'],
  folhagem: ['minimal'],
  'arcos-areia': ['nature'],
  'natal-estrela': ['kids'],
  'cafe-primeiro': ['professions'],
  'abstrato-aurora': ['minimal'],
  'dados-d20': ['kids'],
};

export const arts: Art[] = rows.map(([niche, slug, pt, en, orientation, motif, palette]) => ({
  id: `art-${slug}`,
  slug,
  title: { pt, en },
  nicheIds: [niche, ...(alsoIn[slug] ?? [])],
  file: `/art/${niche}/${slug}.svg`,
  palette,
  orientation,
  motif,
  status: 'active',
}));
