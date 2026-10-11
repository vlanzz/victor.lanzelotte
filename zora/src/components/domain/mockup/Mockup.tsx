import { useId } from 'react';
import { buildMockupModel } from '@/domain/mockup';
import type { Art, MockupKind, Product, ProductType, Selection } from '@/domain/types';
import { Cap, Pouch, Socks, Tote, Tshirt } from './wear';
import { Blanket, Bandana, Curtain, Flag, PetBed, Pillow, Rug } from './fabric';
import { Bottle, Mug, PetBowl } from './cylinder';
import { Deskmat, LaptopSkin, Mousepad, Notebook, PhoneCase } from './flat';
import { Coaster, Plate, Puzzle, Stickers, Tile } from './round';
import { WallArt } from './wall';
import type { DrawProps } from './parts';

export type MockupView = 'main' | 'scene' | 'detail' | 'flat';

interface Entry {
  Draw: (p: DrawProps) => React.ReactNode;
  /** centro e largura da janela do "zoom" (vista de detalhe), no espaço 800×800 */
  detail?: { cx: number; cy: number; w: number };
}

/** Um desenho para cada tipo de mockup (o tipo é checado pelo TypeScript: nenhum pode faltar). */
const registry: Record<MockupKind, Entry> = {
  'wall-art': { Draw: WallArt }, canvas: { Draw: WallArt }, 'wood-frame': { Draw: WallArt },
  'fridge-board': { Draw: WallArt }, calendar: { Draw: WallArt }, card: { Draw: WallArt },
  mug: { Draw: Mug, detail: { cx: 400, cy: 430, w: 330 } }, bottle: { Draw: Bottle, detail: { cx: 400, cy: 420, w: 300 } },
  'pet-bowl': { Draw: PetBowl, detail: { cx: 400, cy: 400, w: 380 } },
  plate: { Draw: Plate }, coaster: { Draw: Coaster }, tile: { Draw: Tile }, puzzle: { Draw: Puzzle }, stickers: { Draw: Stickers },
  pillow: { Draw: Pillow }, blanket: { Draw: Blanket }, curtain: { Draw: Curtain }, rug: { Draw: Rug }, flag: { Draw: Flag },
  bandana: { Draw: Bandana }, 'pet-bed': { Draw: PetBed },
  notebook: { Draw: Notebook }, mousepad: { Draw: Mousepad }, deskmat: { Draw: Deskmat, detail: { cx: 400, cy: 400, w: 440 } },
  'laptop-skin': { Draw: LaptopSkin }, 'phone-case': { Draw: PhoneCase, detail: { cx: 400, cy: 290, w: 330 } },
  tshirt: { Draw: Tshirt, detail: { cx: 400, cy: 330, w: 330 } }, tote: { Draw: Tote, detail: { cx: 400, cy: 500, w: 360 } },
  cap: { Draw: Cap, detail: { cx: 400, cy: 360, w: 380 } }, socks: { Draw: Socks, detail: { cx: 410, cy: 330, w: 420 } },
  pouch: { Draw: Pouch },
};

interface MockupProps {
  type: ProductType;
  product: Product;
  selection?: Selection;
  art: Pick<Art, 'file' | 'palette' | 'orientation'>;
  view?: MockupView;
  /** cor de fundo da vista "scene" (ex.: cor do nicho) */
  accent?: string;
  /** texto alternativo */
  label: string;
  className?: string;
}

/**
 * Mockup dinâmico: SVG em camadas (base do produto + arte recortada na área de impressão
 * + sombras). Muda instantaneamente com cor, tamanho e moldura porque tudo é vetorial.
 */
export function Mockup({ type, product, selection, art, view = 'main', accent, label, className }: MockupProps) {
  const uid = useId().replace(/:/g, '');
  const m = buildMockupModel(type, product, selection);
  const { Draw, detail } = registry[m.kind];
  const props: DrawProps = { m, href: art.file, uid, palette: art.palette };

  let viewBox = '70 70 660 660';
  if (view === 'detail') {
    const d = detail ?? { cx: 400, cy: 400, w: 400 };
    viewBox = `${d.cx - d.w / 2} ${d.cy - d.w / 2} ${d.w} ${d.w}`;
  }

  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className={className} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={`${uid}-bg`} cx="0.5" cy="0.42" r="0.75">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F1E8D8" />
        </radialGradient>
      </defs>
      {view === 'scene' ? (
        <g aria-hidden>
          <rect x="-200" y="-200" width="1200" height="1200" fill={accent ?? art.palette[0] ?? '#F4ECDD'} />
          <circle cx="400" cy="470" r="360" fill="#fff" opacity="0.28" />
          <circle cx="400" cy="470" r="250" fill="#fff" opacity="0.22" />
          <rect x="-200" y="640" width="1200" height="400" fill="#241C3D" opacity="0.07" />
        </g>
      ) : (
        <rect x="-200" y="-200" width="1200" height="1200" fill={`url(#${uid}-bg)`} aria-hidden />
      )}
      {view === 'flat' ? <FlatArt href={art.file} aspect={m.aspect} uid={uid} /> : <Draw {...props} />}
    </svg>
  );
}

/** Vista "arte pura": a ilustração como será impressa, na proporção da área de impressão. */
function FlatArt({ href, aspect, uid }: { href: string; aspect: number; uid: string }) {
  const w = Math.min(640, 640 * aspect);
  const h = w / aspect;
  const hh = Math.min(h, 640);
  const ww = hh * aspect;
  const x = 400 - ww / 2;
  const y = 400 - hh / 2;
  return (
    <g>
      <rect x={x + 6} y={y + 14} width={ww} height={hh} fill="#241C3D" opacity="0.12" />
      <clipPath id={`${uid}-fa`}><rect x={x} y={y} width={ww} height={hh} /></clipPath>
      <g clipPath={`url(#${uid}-fa)`}><image href={href} x={x} y={y} width={ww} height={hh} preserveAspectRatio="xMidYMid slice" /></g>
      <rect x={x} y={y} width={ww} height={hh} fill="none" stroke="#241C3D" strokeOpacity="0.2" strokeWidth="2" strokeDasharray="10 8" />
    </g>
  );
}
