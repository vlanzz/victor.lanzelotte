import { fitBox, shade } from '@/domain/mockup';
import { ArtImage, SoftShadow, type DrawProps } from './parts';

const C = 400;

/** Caderno, agenda e planner (variam por `m.variant`). */
export function Notebook({ m, href, uid }: DrawProps) {
  const { w, h } = fitBox(m.aspect, 440 * m.scale, 600 * m.scale);
  const x = C - w / 2;
  const y = C - h / 2;
  const diary = m.variant === 'diary';
  const planner = m.variant === 'planner';
  const spine = Math.max(16, w * 0.07);
  return (
    <g>
      <SoftShadow x={x} y={y} w={w} h={h} r={14} />
      {/* páginas aparecendo atrás */}
      <rect x={x + 8} y={y + 8} width={w} height={h} rx="14" fill="#F3EBDD" />
      <rect x={x + 4} y={y + 4} width={w} height={h} rx="14" fill="#fff" />
      <clipPath id={`${uid}-nb`}><path d={`M${x} ${y}H${x + w - 16}Q${x + w} ${y} ${x + w} ${y + 16}V${y + h - 16}Q${x + w} ${y + h} ${x + w - 16} ${y + h}H${x}Z`} /></clipPath>
      <g clipPath={`url(#${uid}-nb)`}>
        <ArtImage href={href} x={x} y={y} w={w} h={h} />
        <rect x={x} y={y} width={spine} height={h} fill="#000" opacity="0.22" />
        <rect x={x + spine} y={y} width="3" height={h} fill="#fff" opacity="0.3" />
        {diary && <rect x={x + w - 34} y={y} width="16" height={h} fill={m.bodyColor === '#FFFFFF' ? '#241C3D' : m.bodyColor} opacity="0.95" />}
        {diary && <path d={`M${x + w - 80} ${y + h}v28l12 -10 12 10v-28`} fill="#C8421C" />}
        {diary && <rect x={x} y={y + h - 40} width={w} height="40" fill={shade(m.bodyColor === '#FFFFFF' ? '#241C3D' : m.bodyColor, -0.1)} opacity="0.0" />}
      </g>
      {!diary && !planner && Array.from({ length: Math.floor(h / 44) }, (_, i) => (
        <g key={i}><rect x={x - 12} y={y + 26 + i * 44} width="38" height="12" rx="6" fill="#3b3550" /><rect x={x - 12} y={y + 26 + i * 44} width="38" height="4" rx="2" fill="#fff" opacity="0.35" /></g>
      ))}
      {planner && ['#C8421C', '#F2B33D', '#2E9C86', '#8B7CF6'].map((c, i) => <rect key={c} x={x + w - 2} y={y + 40 + i * 70} width="26" height="48" rx="8" fill={c} />)}
    </g>
  );
}

/** Mousepad: tapete retangular com mouse ao lado. */
export function Mousepad({ m, href, uid }: DrawProps) {
  const { w, h } = fitBox(m.aspect, 560 * m.scale, 500 * m.scale);
  const x = C - w / 2;
  const y = C - h / 2;
  return (
    <g>
      <SoftShadow x={x} y={y} w={w} h={h} r={36} />
      <rect x={x} y={y + 8} width={w} height={h} rx="36" fill="#2b2540" />
      <clipPath id={`${uid}-mp`}><rect x={x} y={y} width={w} height={h} rx="36" /></clipPath>
      <g clipPath={`url(#${uid}-mp)`}><ArtImage href={href} x={x} y={y} w={w} h={h} /></g>
      <rect x={x} y={y} width={w} height={h} rx="36" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" />
      <g transform={`translate(${x + w * 0.62} ${y + h * 0.4})`} opacity="0.92">
        <rect x="0" y="6" width="70" height="108" rx="35" fill="#000" opacity="0.25" />
        <rect x="0" y="0" width="70" height="108" rx="35" fill="#F4F0E8" />
        <path d="M35 0V48M0 54H70" stroke="#2b2540" strokeOpacity="0.4" strokeWidth="2" />
      </g>
    </g>
  );
}

/** Deskmat: tapete grande com teclado e mouse por cima. */
export function Deskmat({ m, href, uid }: DrawProps) {
  const { w, h } = fitBox(m.aspect, 700 * m.scale, 340 * m.scale);
  const x = C - w / 2;
  const y = C - h / 2;
  const kw = w * 0.5;
  const kh = h * 0.34;
  return (
    <g>
      <SoftShadow x={x} y={y} w={w} h={h} r={22} />
      <rect x={x} y={y + 7} width={w} height={h} rx="22" fill="#2b2540" />
      <clipPath id={`${uid}-dm`}><rect x={x} y={y} width={w} height={h} rx="22" /></clipPath>
      <g clipPath={`url(#${uid}-dm)`}><ArtImage href={href} x={x} y={y} w={w} h={h} /></g>
      <g transform={`translate(${x + w * 0.2} ${y + h * 0.52})`} opacity="0.94">
        <rect x="0" y="5" width={kw} height={kh} rx="10" fill="#000" opacity="0.28" />
        <rect x="0" y="0" width={kw} height={kh} rx="10" fill="#1F1F24" />
        {Array.from({ length: 4 }, (_, r) => Array.from({ length: 15 }, (_, c) => <rect key={`${r}-${c}`} x={8 + c * ((kw - 16) / 15)} y={8 + r * ((kh - 14) / 4)} width={(kw - 16) / 15 - 3} height={(kh - 14) / 4 - 3} rx="2" fill="#3a3a44" />))}
      </g>
      <g transform={`translate(${x + w * 0.78} ${y + h * 0.5})`} opacity="0.94">
        <rect x="0" y="4" width="36" height="58" rx="18" fill="#000" opacity="0.25" />
        <rect x="0" y="0" width="36" height="58" rx="18" fill="#F4F0E8" />
        <path d="M18 0V26M0 30H36" stroke="#1F1F24" strokeOpacity="0.4" strokeWidth="1.5" />
      </g>
    </g>
  );
}

/** Skin de notebook: tampa vista de cima, com a logo recortada. */
export function LaptopSkin({ m, href, uid }: DrawProps) {
  const { w, h } = fitBox(m.aspect, 600 * m.scale, 420 * m.scale);
  const x = C - w / 2;
  const y = C - h / 2 - 20;
  return (
    <g>
      <SoftShadow x={x} y={y} w={w} h={h + 22} r={28} />
      <rect x={x - 22} y={y + h - 2} width={w + 44} height="24" rx="12" fill="#C9C4BC" />
      <rect x={x - 22} y={y + h - 2} width={w + 44} height="8" rx="4" fill="#fff" opacity="0.5" />
      <clipPath id={`${uid}-ls`}><rect x={x} y={y} width={w} height={h} rx="26" /></clipPath>
      <g clipPath={`url(#${uid}-ls)`}>
        <rect x={x} y={y} width={w} height={h} fill="#E3E0DA" />
        <ArtImage href={href} x={x} y={y} w={w} h={h} />
        <circle cx={x + w / 2} cy={y + h / 2} r={Math.min(w, h) * 0.1} fill="#E3E0DA" opacity="0.92" />
        <circle cx={x + w / 2} cy={y + h / 2} r={Math.min(w, h) * 0.1} fill="none" stroke="#000" strokeOpacity="0.08" strokeWidth="2" />
      </g>
      <rect x={x} y={y} width={w} height={h} rx="26" fill="none" stroke="#000" strokeOpacity="0.18" strokeWidth="3" />
      <rect x={x} y={y} width={w} height={h} rx="26" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
    </g>
  );
}

/** Capinha de celular vista por trás, com recorte das câmeras. */
export function PhoneCase({ m, href, uid }: DrawProps) {
  const { w, h } = fitBox(0.5, 330 * m.scale, 640 * m.scale);
  const x = C - w / 2;
  const y = C - h / 2;
  const cam = w * 0.4;
  const tough = m.material === 'tough';
  return (
    <g>
      <SoftShadow x={x} y={y} w={w} h={h} r={56} dy={22} />
      <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx="58" fill={tough ? '#241C3D' : '#D9D3C8'} />
      <clipPath id={`${uid}-pc`}><rect x={x} y={y} width={w} height={h} rx="54" /></clipPath>
      <g clipPath={`url(#${uid}-pc)`}>
        <ArtImage href={href} x={x} y={y} w={w} h={h} />
        <linearGradient id={`${uid}-pcs`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.28" /><stop offset="0.4" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.18" /></linearGradient>
        <rect x={x} y={y} width={w} height={h} fill={`url(#${uid}-pcs)`} />
      </g>
      <g>
        <rect x={x + 18} y={y + 18} width={cam} height={cam * 1.08} rx={cam * 0.28} fill="#1c1a24" />
        <rect x={x + 18} y={y + 18} width={cam} height={cam * 1.08} rx={cam * 0.28} fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" />
        {[[0.3, 0.3], [0.7, 0.3], [0.3, 0.72]].map(([a, b], i) => (
          <g key={i}><circle cx={x + 18 + cam * (a as number)} cy={y + 18 + cam * 1.08 * (b as number)} r={cam * 0.19} fill="#0c0b12" /><circle cx={x + 18 + cam * (a as number)} cy={y + 18 + cam * 1.08 * (b as number)} r={cam * 0.1} fill="#3a4a7a" /><circle cx={x + 18 + cam * (a as number) - 4} cy={y + 18 + cam * 1.08 * (b as number) - 4} r="3" fill="#fff" opacity="0.7" /></g>
        ))}
      </g>
      <rect x={x + w} y={y + h * 0.22} width="5" height="70" rx="2" fill="#7d7889" />
      <rect x={x - 5} y={y + h * 0.18} width="5" height="46" rx="2" fill="#7d7889" />
    </g>
  );
}
