import { ArtImage, GroundShadow, SoftShadow, type DrawProps } from './parts';

const C = 400;

/** Prato decorativo: aro de porcelana com a arte no centro. */
export function Plate({ m, href, uid }: DrawProps) {
  const R = 285 * m.scale;
  const r = R * 0.78;
  return (
    <g>
      <GroundShadow cx={C} cy={C + R * 0.9} rx={R * 0.9} ry={R * 0.12} />
      <circle cx={C} cy={C + 14} r={R} fill="#000" opacity="0.1" />
      <radialGradient id={`${uid}-pl`} cx="0.35" cy="0.3" r="0.9"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#E8E2D6" /></radialGradient>
      <circle cx={C} cy={C} r={R} fill={`url(#${uid}-pl)`} />
      <circle cx={C} cy={C} r={R * 0.9} fill="none" stroke="#000" strokeOpacity="0.07" strokeWidth="3" />
      <clipPath id={`${uid}-plc`}><circle cx={C} cy={C} r={r} /></clipPath>
      <g clipPath={`url(#${uid}-plc)`}><ArtImage href={href} x={C - r} y={C - r} w={r * 2} h={r * 2} /></g>
      <circle cx={C} cy={C} r={r} fill="none" stroke="#000" strokeOpacity="0.15" strokeWidth="3" />
      <path d={`M${C - R * 0.8} ${C - R * 0.45}A${R * 0.92} ${R * 0.92} 0 0 1 ${C - R * 0.2} ${C - R * 0.88}`} stroke="#fff" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.7" />
    </g>
  );
}

/** Porta-copos: dois, para mostrar a espessura e o verso (cortiça ou cerâmica). */
export function Coaster({ m, href, uid }: DrawProps) {
  const R = 215 * m.scale;
  const cork = m.material !== 'ceramic';
  const edge = cork ? '#C9A27A' : '#F4F0E8';
  return (
    <g>
      <GroundShadow cx={C} cy={C + R * 1.05} rx={R * 1.1} ry={R * 0.14} />
      <g transform={`translate(${R * 0.28} ${R * 0.34})`}>
        <circle cx={C} cy={C + 10} r={R} fill="#000" opacity="0.16" />
        <circle cx={C} cy={C} r={R} fill={cork ? '#B98D5E' : '#E8E2D6'} />
      </g>
      <circle cx={C - R * 0.12} cy={C - R * 0.12 + 16} r={R} fill="#000" opacity="0.12" />
      <circle cx={C - R * 0.12} cy={C - R * 0.12} r={R} fill={edge} />
      <clipPath id={`${uid}-co`}><circle cx={C - R * 0.12} cy={C - R * 0.12} r={R * 0.92} /></clipPath>
      <g clipPath={`url(#${uid}-co)`}><ArtImage href={href} x={C - R * 1.04} y={C - R * 1.04} w={R * 1.84} h={R * 1.84} /></g>
      <circle cx={C - R * 0.12} cy={C - R * 0.12} r={R * 0.92} fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="3" />
      <circle cx={C - R * 0.12} cy={C - R * 0.12} r={R} fill="none" stroke="#000" strokeOpacity="0.15" strokeWidth="2" />
    </g>
  );
}

/** Azulejo: peça quadrada com bisel e rejunte aparecendo ao lado. */
export function Tile({ m, href, uid }: DrawProps) {
  const s = 440 * m.scale;
  const x = C - s / 2;
  const y = C - s / 2;
  return (
    <g>
      <SoftShadow x={x} y={y} w={s} h={s} r={10} dy={20} />
      <rect x={x - 14} y={y - 14} width={s + 28} height={s + 28} rx="14" fill="#E9E4D9" opacity="0.8" />
      <rect x={x} y={y} width={s} height={s} rx="8" fill="#FBFAF6" />
      <clipPath id={`${uid}-ti`}><rect x={x + 10} y={y + 10} width={s - 20} height={s - 20} rx="4" /></clipPath>
      <g clipPath={`url(#${uid}-ti)`}><ArtImage href={href} x={x + 10} y={y + 10} w={s - 20} h={s - 20} /></g>
      <rect x={x} y={y} width={s} height={s} rx="8" fill="none" stroke="#000" strokeOpacity="0.14" strokeWidth="2" />
      <path d={`M${x + 14} ${y + 14}H${x + s * 0.55}`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
    </g>
  );
}

/** Quebra-cabeça montado, com as linhas de encaixe por cima. */
export function Puzzle({ m, href, uid }: DrawProps) {
  const w = 560 * m.scale;
  const h = w / m.aspect;
  const x = C - w / 2;
  const y = C - h / 2;
  const [cols, rows] = m.sizeId === '1000' ? [12, 9] : m.sizeId === '500' ? [9, 7] : [6, 5];
  const cw = w / cols;
  const ch = h / rows;
  let d = '';
  for (let c = 1; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const px = x + c * cw;
      const py = y + r * ch;
      const dir = (c + r) % 2 ? 1 : -1;
      d += `M${px} ${py}V${py + ch * 0.36}c${dir * -ch * 0.2} ${ch * 0.02} ${dir * -ch * 0.2} ${ch * 0.26} 0 ${ch * 0.26}s${dir * ch * 0.2} ${ch * 0.24} 0 ${ch * 0.24}V${py + ch}`;
    }
  }
  for (let r = 1; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = x + c * cw;
      const py = y + r * ch;
      const dir = (c + r) % 2 ? 1 : -1;
      d += `M${px} ${py}H${px + cw * 0.36}c${cw * 0.02} ${dir * -cw * 0.2} ${cw * 0.26} ${dir * -cw * 0.2} ${cw * 0.26} 0s${cw * 0.24} ${dir * cw * 0.2} ${cw * 0.24} 0H${px + cw}`;
    }
  }
  return (
    <g>
      <SoftShadow x={x} y={y} w={w} h={h} r={4} />
      <rect x={x} y={y} width={w} height={h} rx="4" fill="#fff" />
      <ArtImage href={href} x={x} y={y} w={w} h={h} />
      <path d={d} fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="2" transform="translate(1 1.5)" />
      <path d={d} fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.5" />
      <rect x={x} y={y} width={w} height={h} rx="4" fill="none" stroke="#000" strokeOpacity="0.2" strokeWidth="2" />
      <g transform={`rotate(14 ${x + w - 20} ${y + h - 10})`}>
        <path d={`M${x + w - 70} ${y + h + 24}h${cw * 0.9}v${ch * 0.9}h-${cw * 0.9}Z`} fill="#fff" />
        <rect x={x + w - 70} y={y + h + 24} width={cw * 0.9} height={ch * 0.9} fill="#000" opacity="0.1" />
      </g>
      <defs><clipPath id={`${uid}-pz`}><rect x={x} y={y} width={w} height={h} /></clipPath></defs>
    </g>
  );
}

/** Cartela de adesivos recortados no formato da ilustração. */
export function Stickers({ m, href, uid }: DrawProps) {
  const s = 560 * m.scale;
  const x = C - s / 2;
  const y = C - s / 2;
  const holo = m.material === 'holo';
  const cell = s / 2;
  const shapes = [
    (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 -${r * 2} 0Z`,
    (cx: number, cy: number, r: number) => `M${cx - r + 30} ${cy - r}h${(r - 30) * 2}q30 0 30 30v${(r - 30) * 2}q0 30 -30 30h-${(r - 30) * 2}q-30 0 -30 -30v-${(r - 30) * 2}q0 -30 30 -30Z`,
    (cx: number, cy: number, r: number) => `M${cx} ${cy - r}L${cx + r * 0.87} ${cy - r / 2}L${cx + r * 0.87} ${cy + r / 2}L${cx} ${cy + r}L${cx - r * 0.87} ${cy + r / 2}L${cx - r * 0.87} ${cy - r / 2}Z`,
    (cx: number, cy: number, r: number) => `M${cx - r} ${cy + r * 0.2}Q${cx - r} ${cy - r} ${cx} ${cy - r}Q${cx + r} ${cy - r} ${cx + r} ${cy + r * 0.2}Q${cx + r} ${cy + r} ${cx} ${cy + r}Q${cx - r} ${cy + r} ${cx - r} ${cy + r * 0.2}Z`,
  ];
  const offsets = [[0, 0], [-0.25, 0.1], [0.2, -0.15], [0.1, 0.25]];
  return (
    <g>
      <SoftShadow x={x} y={y} w={s} h={s} r={26} />
      <rect x={x} y={y} width={s} height={s} rx="26" fill="#FBF8F2" />
      <rect x={x + 10} y={y + 10} width={s - 20} height={s - 20} rx="18" fill="none" stroke="#C9C1B3" strokeDasharray="8 8" strokeWidth="2" />
      {shapes.map((fn, i) => {
        const cx = x + cell * (i % 2) + cell / 2;
        const cy = y + cell * Math.floor(i / 2) + cell / 2;
        const r = cell * 0.36;
        const id = `${uid}-st${i}`;
        const [ox, oy] = offsets[i] as [number, number];
        const big = r * 2 * 1.5;
        return (
          <g key={i}>
            <path d={fn(cx, cy, r)} fill="#000" opacity="0.14" transform="translate(3 6)" />
            <path d={fn(cx, cy, r + 8)} fill="#fff" stroke="#E6E0D4" strokeWidth="1.5" />
            <clipPath id={id}><path d={fn(cx, cy, r)} /></clipPath>
            <g clipPath={`url(#${id})`}>
              <ArtImage href={href} x={cx - big / 2 + ox * r} y={cy - big / 2 + oy * r} w={big} h={big} />
              {holo && <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={`url(#${uid}-holo)`} />}
            </g>
          </g>
        );
      })}
      {holo && (
        <linearGradient id={`${uid}-holo`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8B7CF6" stopOpacity="0.45" /><stop offset="0.35" stopColor="#9CC9EE" stopOpacity="0.3" /><stop offset="0.65" stopColor="#F5A9A0" stopOpacity="0.4" /><stop offset="1" stopColor="#F2B33D" stopOpacity="0.35" />
        </linearGradient>
      )}
    </g>
  );
}

