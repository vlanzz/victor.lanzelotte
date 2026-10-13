import { fitBox, shade } from '@/domain/mockup';
import { ArtImage, GroundShadow, SoftShadow, type DrawProps } from './parts';

const C = 400;

/** Almofada: capa estampada com cantos "puxados" e outra almofada atrás mostrando a cor. */
export function Pillow({ m, href, uid }: DrawProps) {
  const s = 470 * m.scale;
  const x = C - s / 2;
  const y = C - s / 2;
  const back = m.bodyColor === '#FFFFFF' ? '#E9E1D2' : m.bodyColor;
  const path = (px: number, py: number, w: number, h: number, k: number) =>
    `M${px} ${py}Q${px + w / 2} ${py + k} ${px + w} ${py}Q${px + w - k} ${py + h / 2} ${px + w} ${py + h}Q${px + w / 2} ${py + h - k} ${px} ${py + h}Q${px + k} ${py + h / 2} ${px} ${py}Z`;
  return (
    <g>
      <GroundShadow cx={C} cy={y + s + 36} rx={s * 0.5} ry={18} />
      <g transform={`rotate(-9 ${C} ${C}) translate(-34 -10)`}>
        <path d={path(x + 20, y + 20, s, s, 22)} fill={shade(back, -0.12)} />
        <path d={path(x + 14, y + 14, s, s, 22)} fill={back} />
      </g>
      <path d={path(x, y + 14, s, s, 26)} fill="#000" opacity="0.12" />
      <clipPath id={`${uid}-pi`}><path d={path(x, y, s, s, 26)} /></clipPath>
      <g clipPath={`url(#${uid}-pi)`}>
        <ArtImage href={href} x={x} y={y} w={s} h={s} />
        <radialGradient id={`${uid}-pis`} cx="0.5" cy="0.45" r="0.75"><stop offset="0.5" stopColor="#fff" stopOpacity="0.1" /><stop offset="1" stopColor="#000" stopOpacity="0.28" /></radialGradient>
        <rect x={x} y={y} width={s} height={s} fill={`url(#${uid}-pis)`} />
        {[[x, y, 1, 1], [x + s, y, -1, 1], [x, y + s, 1, -1], [x + s, y + s, -1, -1]].map(([cx, cy, sx, sy], i) => (
          <path key={i} d={`M${cx} ${cy}l${(sx as number) * 70} ${(sy as number) * 24}M${cx} ${cy}l${(sx as number) * 24} ${(sy as number) * 70}`} stroke="#000" strokeOpacity="0.18" strokeWidth="6" strokeLinecap="round" />
        ))}
      </g>
      <path d={path(x, y, s, s, 26)} fill="none" stroke={shade(back, -0.2)} strokeWidth="5" />
    </g>
  );
}

/** Manta: retângulo com dobra e ondulações de tecido. */
export function Blanket({ m, href, uid }: DrawProps) {
  const { w, h } = fitBox(m.aspect, 520 * m.scale, 600 * m.scale);
  const x = C - w / 2;
  const y = C - h / 2;
  const wavy = `M${x} ${y}H${x + w}V${y + h - 10}Q${x + w * 0.75} ${y + h + 16} ${x + w / 2} ${y + h - 4}T${x} ${y + h - 10}Z`;
  return (
    <g>
      <SoftShadow x={x} y={y} w={w} h={h} r={10} dy={22} />
      <clipPath id={`${uid}-bl`}><path d={wavy} /></clipPath>
      <g clipPath={`url(#${uid}-bl)`}>
        <ArtImage href={href} x={x} y={y} w={w} h={h} />
        <linearGradient id={`${uid}-bls`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.12" /><stop offset="0.3" stopColor="#000" stopOpacity="0.1" /><stop offset="0.55" stopColor="#fff" stopOpacity="0.1" /><stop offset="0.8" stopColor="#000" stopOpacity="0.14" /><stop offset="1" stopColor="#fff" stopOpacity="0.05" />
        </linearGradient>
        <rect x={x} y={y} width={w} height={h} fill={`url(#${uid}-bls)`} />
        <path d={`M${x} ${y}H${x + w}V${y + h * 0.12}Q${x + w / 2} ${y + h * 0.17} ${x} ${y + h * 0.12}Z`} fill="#fff" opacity="0.28" />
        <path d={`M${x} ${y + h * 0.12}Q${x + w / 2} ${y + h * 0.17} ${x + w} ${y + h * 0.12}`} stroke="#000" strokeOpacity="0.2" strokeWidth="4" fill="none" />
      </g>
    </g>
  );
}

/** Cortina de box: pregas verticais, varão e argolas. */
export function Curtain({ m, href, uid }: DrawProps) {
  const { w, h } = fitBox(m.aspect, 480 * m.scale, 520 * m.scale);
  const x = C - w / 2;
  const y = C - h / 2 + 30;
  const pleats = Math.max(6, Math.round(w / 60));
  return (
    <g>
      <SoftShadow x={x} y={y} w={w} h={h} r={4} dy={16} />
      <clipPath id={`${uid}-cu`}><rect x={x} y={y} width={w} height={h} /></clipPath>
      <g clipPath={`url(#${uid}-cu)`}>
        <ArtImage href={href} x={x} y={y} w={w} h={h} />
        <linearGradient id={`${uid}-cup`} x1="0" x2="1" y1="0" y2="0" spreadMethod="repeat" gradientTransform={`scale(${1 / pleats} 1)`}>
          <stop offset="0" stopColor="#000" stopOpacity="0.22" /><stop offset="0.35" stopColor="#fff" stopOpacity="0.14" /><stop offset="0.7" stopColor="#000" stopOpacity="0.04" /><stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <rect x={x} y={y} width={w} height={h} fill={`url(#${uid}-cup)`} />
        <rect x={x} y={y + h - 22} width={w} height="22" fill="#fff" opacity="0.2" />
      </g>
      <rect x={x - 26} y={y - 26} width={w + 52} height="12" rx="6" fill="#B9B3A8" />
      <rect x={x - 26} y={y - 26} width={w + 52} height="4" rx="2" fill="#fff" opacity="0.7" />
      {Array.from({ length: pleats + 1 }, (_, i) => <ellipse key={i} cx={x + (w / pleats) * i} cy={y - 20} rx="5" ry="11" fill="none" stroke="#8d877c" strokeWidth="3" />)}
    </g>
  );
}

/** Tapete visto de cima, sobre piso de madeira, com franjas e borda. */
export function Rug({ m, href, uid }: DrawProps) {
  const { w, h } = fitBox(m.aspect, 520 * m.scale, 560 * m.scale);
  const x = C - w / 2;
  const y = C - h / 2;
  const plush = m.material === 'plush';
  return (
    <g>
      <clipPath id={`${uid}-fl`}><rect x="0" y="0" width="800" height="800" /></clipPath>
      <g clipPath={`url(#${uid}-fl)`}>
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x="0" y={i * 90} width="800" height="90" fill={i % 2 ? '#D9BE95' : '#E2C9A3'} stroke="#B89B72" strokeOpacity="0.5" strokeWidth="2" />)}
      </g>
      <SoftShadow x={x} y={y} w={w} h={h} r={12} dy={14} strength={0.2} />
      {Array.from({ length: Math.floor(h / 14) }, (_, i) => <path key={i} d={`M${x - 16} ${y + 8 + i * 14}h16M${x + w} ${y + 8 + i * 14}h16`} stroke="#F4EFE6" strokeWidth="4" strokeLinecap="round" />)}
      <clipPath id={`${uid}-ru`}><rect x={x} y={y} width={w} height={h} rx="12" /></clipPath>
      <g clipPath={`url(#${uid}-ru)`}>
        <ArtImage href={href} x={x} y={y} w={w} h={h} />
        <rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} rx="6" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="3" />
        {plush && Array.from({ length: 140 }, (_, i) => <circle key={i} cx={x + ((i * 97) % 1000) / 1000 * w} cy={y + ((i * 61) % 1000) / 1000 * h} r="2.2" fill="#fff" opacity="0.28" />)}
        <rect x={x} y={y} width={w} height={h} fill="#000" opacity="0.04" />
      </g>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="none" stroke="#000" strokeOpacity="0.2" strokeWidth="2" />
    </g>
  );
}

/** Bandeira presa a um mastro, com borda ondulada. */
export function Flag({ m, href, uid }: DrawProps) {
  const { w, h } = fitBox(m.aspect, 520 * m.scale, 420 * m.scale);
  const x = C - w / 2 + 20;
  const y = C - h / 2 - 20;
  const wave = `M${x} ${y}Q${x + w * 0.25} ${y - 22} ${x + w * 0.5} ${y}T${x + w} ${y}L${x + w - 12} ${y + h / 2}L${x + w} ${y + h}Q${x + w * 0.75} ${y + h + 22} ${x + w * 0.5} ${y + h}T${x} ${y + h}Z`;
  return (
    <g>
      <GroundShadow cx={x - 10} cy={y + h * 1.9 + 4} rx={50} ry={9} />
      <rect x={x - 22} y={y - 50} width="14" height={h * 1.9 + 60} rx="7" fill="#7a5a3c" />
      <circle cx={x - 15} cy={y - 56} r="13" fill="#F2B33D" />
      <SoftShadow x={x} y={y} w={w} h={h} r={4} dy={14} />
      <clipPath id={`${uid}-fg`}><path d={wave} /></clipPath>
      <g clipPath={`url(#${uid}-fg)`}>
        <ArtImage href={href} x={x} y={y - 24} w={w} h={h + 48} />
        <linearGradient id={`${uid}-fgs`} x1="0" x2="1" y1="0" y2="0" spreadMethod="repeat" gradientTransform={`scale(${1 / 2.2} 1)`}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" /><stop offset="0.5" stopColor="#000" stopOpacity="0.18" /><stop offset="1" stopColor="#fff" stopOpacity="0.22" />
        </linearGradient>
        <rect x={x} y={y - 24} width={w} height={h + 48} fill={`url(#${uid}-fgs)`} />
      </g>
      {[0.18, 0.5, 0.82].map((k) => <circle key={k} cx={x + 10} cy={y + h * k} r="6" fill="#C9C4BC" stroke="#8d877c" strokeWidth="2" />)}
    </g>
  );
}

/** Bandana triangular com a estampa em repetição e nós nas pontas. */
export function Bandana({ m, href, uid }: DrawProps) {
  const s = 560 * m.scale;
  const x = C - s / 2;
  const y = C - s * 0.42;
  const tri = `M${x} ${y}Q${C} ${y - 18} ${x + s} ${y}L${C + 18} ${y + s * 0.78}Q${C} ${y + s * 0.84} ${C - 18} ${y + s * 0.78}Z`;
  const tile = s * 0.5;
  const base = m.bodyColor === '#FFFFFF' ? '#FBF6EE' : m.bodyColor;
  return (
    <g>
      <GroundShadow cx={C} cy={y + s * 0.86} rx={s * 0.3} ry={14} />
      <path d={tri} fill="#000" opacity="0.12" transform="translate(0 14)" />
      <clipPath id={`${uid}-bd`}><path d={tri} /></clipPath>
      <pattern id={`${uid}-bdp`} width={tile} height={tile} patternUnits="userSpaceOnUse" x={x} y={y}>
        <rect width={tile} height={tile} fill={base} />
        <ArtImage href={href} x={0} y={0} w={tile} h={tile} />
      </pattern>
      <path d={tri} fill={`url(#${uid}-bdp)`} />
      <g clipPath={`url(#${uid}-bd)`}>
        <path d={tri} fill="none" stroke={base} strokeWidth="26" />
        <linearGradient id={`${uid}-bds`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.18" /><stop offset="1" stopColor="#000" stopOpacity="0.14" /></linearGradient>
        <path d={tri} fill={`url(#${uid}-bds)`} />
      </g>
      <path d={`M${x} ${y}q-34 -10 -44 -42q22 -4 44 12`} fill={shade(base, -0.1)} />
      <path d={`M${x + s} ${y}q34 -10 44 -42q-22 -4 -44 12`} fill={shade(base, -0.1)} />
    </g>
  );
}

/** Caminha pet vista de cima: borda acolchoada e centro estampado. */
export function PetBed({ m, href, uid, palette }: DrawProps) {
  const { w, h } = fitBox(m.aspect, 560 * m.scale, 480 * m.scale);
  const x = C - w / 2;
  const y = C - h / 2;
  const rim = shade(palette[1] ?? '#C9A276', 0.2);
  const inset = Math.min(w, h) * 0.17;
  return (
    <g>
      <SoftShadow x={x} y={y} w={w} h={h} r={Math.min(w, h) * 0.4} dy={20} strength={0.2} />
      <rect x={x} y={y} width={w} height={h} rx={Math.min(w, h) * 0.4} fill={rim} />
      <radialGradient id={`${uid}-pbr`} cx="0.5" cy="0.2" r="0.9"><stop offset="0" stopColor="#fff" stopOpacity="0.38" /><stop offset="1" stopColor="#000" stopOpacity="0.2" /></radialGradient>
      <rect x={x} y={y} width={w} height={h} rx={Math.min(w, h) * 0.4} fill={`url(#${uid}-pbr)`} />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <path key={i} d={`M${C + Math.cos(a) * (w / 2 - inset * 0.4)} ${C + Math.sin(a) * (h / 2 - inset * 0.4)}l${Math.cos(a) * -14} ${Math.sin(a) * -14}`} stroke="#000" strokeOpacity="0.15" strokeWidth="5" strokeLinecap="round" />;
      })}
      <clipPath id={`${uid}-pb`}><rect x={x + inset} y={y + inset} width={w - inset * 2} height={h - inset * 2} rx={Math.min(w, h) * 0.22} /></clipPath>
      <g clipPath={`url(#${uid}-pb)`}>
        <ArtImage href={href} x={x + inset} y={y + inset} w={w - inset * 2} h={h - inset * 2} />
        <rect x={x + inset} y={y + inset} width={w - inset * 2} height={h - inset * 2} fill="none" stroke="#000" strokeOpacity="0.22" strokeWidth="26" />
      </g>
    </g>
  );
}
