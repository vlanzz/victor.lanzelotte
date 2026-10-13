import { shade, type MockupModel } from '@/domain/mockup';

export interface DrawProps {
  m: MockupModel;
  /** caminho da imagem da arte */
  href: string;
  /** prefixo único para ids de clipPath/gradiente (várias instâncias na mesma página) */
  uid: string;
  /** paleta da arte (usada em produtos sem cor própria, como caminha pet) */
  palette: string[];
}

/** Arte desenhada num retângulo (cover = preenche e corta; contain = mostra inteira). */
export function ArtImage({ href, x, y, w, h, fit = 'cover' }: { href: string; x: number; y: number; w: number; h: number; fit?: 'cover' | 'contain' }) {
  return <image href={href} x={x} y={y} width={w} height={h} preserveAspectRatio={fit === 'contain' ? 'xMidYMid meet' : 'xMidYMid slice'} />;
}

/** Sombra suave embaixo de um objeto (camadas de retângulos, sem filtros pesados). */
export function SoftShadow({ x, y, w, h, r = 12, dy = 18, strength = 0.1 }: { x: number; y: number; w: number; h: number; r?: number; dy?: number; strength?: number }) {
  return (
    <g aria-hidden>
      {[28, 18, 9, 3].map((g, i) => (
        <rect key={g} x={x - g} y={y - g + dy} width={w + g * 2} height={h + g * 2} rx={r + g} fill="#241C3D" opacity={strength * (0.45 + i * 0.35) / 2} />
      ))}
    </g>
  );
}

/** Sombra de contato elíptica (objetos apoiados no chão). */
export function GroundShadow({ cx, cy, rx, ry, opacity = 0.18 }: { cx: number; cy: number; rx: number; ry: number; opacity?: number }) {
  return (
    <g aria-hidden>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#241C3D" opacity={opacity * 0.5} />
      <ellipse cx={cx} cy={cy} rx={rx * 0.8} ry={ry * 0.7} fill="#241C3D" opacity={opacity * 0.6} />
    </g>
  );
}

/** Gradiente horizontal para dar volume a cilindros. */
export function CylinderShade({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#000" stopOpacity="0.38" />
      <stop offset="0.14" stopColor="#000" stopOpacity="0.08" />
      <stop offset="0.3" stopColor="#fff" stopOpacity="0.38" />
      <stop offset="0.42" stopColor="#fff" stopOpacity="0" />
      <stop offset="0.8" stopColor="#000" stopOpacity="0.1" />
      <stop offset="1" stopColor="#000" stopOpacity="0.42" />
    </linearGradient>
  );
}

/**
 * Faixas verticais que simulam a arte "enrolada" num cilindro: cada faixa mostra um pedaço
 * da arte comprimido pelo cosseno do ângulo (mais estreito perto das bordas).
 */
export function WrapStrips({ href, uid, cx, w, y, h, aspect, wrapDeg = 210, strips = 40 }: {
  href: string; uid: string; cx: number; w: number; y: number; h: number; aspect: number; wrapDeg?: number; strips?: number;
}) {
  const R = w / 2;
  const PW = 1000;
  const PH = PW / aspect;
  const half = (wrapDeg * Math.PI) / 360; // meio ângulo da arte
  const vis = Math.PI / 2; // metade visível da frente do cilindro (90°)
  const span = Math.min(1, vis / half) * 0.5; // fração da arte visível de cada lado do centro
  const out = [];
  for (let i = 0; i < strips; i++) {
    const t0 = -vis + (2 * vis * i) / strips;
    const t1 = -vis + (2 * vis * (i + 1)) / strips;
    const dx0 = cx + R * Math.sin(t0);
    const dx1 = cx + R * Math.sin(t1);
    const u0 = 0.5 + (t0 / vis) * span;
    const u1 = 0.5 + (t1 / vis) * span;
    out.push(
      <svg key={i} x={dx0} y={y} width={dx1 - dx0 + 1.6} height={h} viewBox={`${u0 * PW} 0 ${(u1 - u0) * PW} ${PH}`} preserveAspectRatio="none">
        <image href={href} width={PW} height={PH} preserveAspectRatio="xMidYMid slice" />
      </svg>,
    );
  }
  void uid;
  return <>{out}</>;
}

export const edge = (hex: string) => shade(hex, -0.18);
