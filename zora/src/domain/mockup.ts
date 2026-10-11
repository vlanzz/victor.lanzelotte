import { resolveSelection } from './pricing';
import type { MockupKind, Product, ProductType, Selection } from './types';

/**
 * Modelo de mockup: tudo que o desenho precisa saber (proporção da área de impressão,
 * cores, tamanho relativo…), calculado a partir do produto e das variações escolhidas.
 * É puro (sem React), então é testado à parte do desenho em SVG.
 */
export interface MockupModel {
  kind: MockupKind;
  /** id do tipo de produto, para pequenas variações de desenho (ex.: caderno × agenda × planner). */
  variant: string;
  /** largura / altura da área de impressão na variação escolhida. */
  aspect: number;
  fit: 'cover' | 'contain' | 'pattern';
  safeMargin: number;
  /** cor do produto (eixo "cor"); branco quando o produto não tem cor. */
  bodyColor: string;
  /** cor da moldura (eixo "moldura"), se houver. */
  frameColor: string | null;
  material: string | null;
  sizeId: string | null;
  /** tamanho visual relativo (0.62–1): tamanhos maiores ocupam mais da cena. */
  scale: number;
}

/** Tipos em que a proporção vem do tamanho escolhido (cm). Nos demais vale a proporção fixa do tipo. */
const aspectFromSize = new Set<MockupKind>([
  'wall-art', 'canvas', 'wood-frame', 'fridge-board', 'calendar', 'card', 'notebook', 'mousepad', 'deskmat',
  'laptop-skin', 'puzzle', 'blanket', 'rug', 'curtain', 'flag', 'pet-bed',
]);

/** Tipos em que o tamanho escolhido muda a escala visual na cena. */
const scaleFromSize = new Set<MockupKind>([
  'wall-art', 'canvas', 'wood-frame', 'fridge-board', 'calendar', 'card', 'notebook', 'mousepad', 'deskmat',
  'laptop-skin', 'puzzle', 'blanket', 'rug', 'curtain', 'flag', 'pet-bed', 'plate', 'tile', 'pillow', 'stickers',
  'bottle', 'mug', 'pouch', 'bandana',
]);

const FALLBACK_COLOR = '#FFFFFF';

export function buildMockupModel(type: ProductType, product: Product, selection: Selection = {}): MockupModel {
  const sel = resolveSelection(product, selection);
  const value = (axisKind: string) => {
    const axis = product.options.find((o) => o.kind === axisKind);
    return axis?.values.find((v) => v.id === sel[axis.id]);
  };
  const sizeAxis = product.options.find((o) => o.kind === 'size');
  const size = value('size');

  let aspect = type.printArea.aspect;
  if (aspectFromSize.has(type.mockupKind) && size?.dims) aspect = size.dims.w / size.dims.h;

  let scale = 1;
  if (scaleFromSize.has(type.mockupKind) && size?.dims && sizeAxis) {
    const areas = sizeAxis.values.map((v) => (v.dims ? v.dims.w * v.dims.h : 0)).filter(Boolean);
    const max = Math.max(...areas);
    const min = Math.min(...areas);
    scale = max === min ? 1 : 0.68 + 0.32 * Math.sqrt(((size.dims.w * size.dims.h) - min) / (max - min));
  } else if (scaleFromSize.has(type.mockupKind) && sizeAxis) {
    // tamanhos sem dimensões em cm (ex.: 325 ml × 450 ml): ordem dos valores define a escala
    const i = sizeAxis.values.findIndex((v) => v.id === sel[sizeAxis.id]);
    const n = sizeAxis.values.length;
    scale = n > 1 ? 0.84 + (0.16 * i) / (n - 1) : 1;
  }

  return {
    kind: type.mockupKind,
    variant: type.id,
    aspect,
    fit: type.printArea.fit,
    safeMargin: type.printArea.safeMargin,
    bodyColor: value('color')?.swatch ?? FALLBACK_COLOR,
    frameColor: value('frame')?.swatch ?? null,
    material: value('material')?.id ?? null,
    sizeId: size?.id ?? null,
    scale,
  };
}

/** Caixa (largura, altura) com a proporção dada que cabe em maxW × maxH. */
export function fitBox(aspect: number, maxW: number, maxH: number) {
  const w = Math.min(maxW, maxH * aspect);
  return { w, h: w / aspect };
}

/** Escurece/clareia uma cor hex (amount −1…1). Usado para sombras e volumes dos mockups. */
export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const ch = (v: number) => Math.round(Math.min(255, Math.max(0, amount < 0 ? v * (1 + amount) : v + (255 - v) * amount)));
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(ch);
  return `#${[r, g, b].map((x) => (x as number).toString(16).padStart(2, '0')).join('')}`;
}

/** true se a cor é escura (para escolher detalhes claros por cima). */
export function isDark(hex: string): boolean {
  const n = parseInt(hex.replace('#', ''), 16);
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum < 0.5;
}
