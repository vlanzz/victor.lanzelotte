import { isDark, shade } from '@/domain/mockup';
import { CylinderShade, GroundShadow, WrapStrips, type DrawProps } from './parts';

const C = 400;

/** Caneca: arte "enrolada" no cilindro (faixas), alça e interior na cor escolhida. */
export function Mug({ m, href, uid }: DrawProps) {
  const R = 175 * m.scale;
  const H = 340 * m.scale;
  const ry = R * 0.26;
  const top = C - H / 2 + 10;
  const bottom = top + H;
  const trim = m.bodyColor;
  const body = `M${C - R} ${top}V${bottom}A${R} ${ry} 0 0 0 ${C + R} ${bottom}V${top}Z`;
  return (
    <g>
      <GroundShadow cx={C + 20} cy={bottom + ry * 0.6} rx={R * 1.35} ry={ry * 0.9} />
      <path d={`M${C + R - 6} ${top + H * 0.2}C${C + R + 130} ${top + H * 0.05} ${C + R + 130} ${bottom - H * 0.12} ${C + R - 6} ${bottom - H * 0.22}`} stroke={shade(trim, -0.2)} strokeWidth="40" strokeLinecap="round" fill="none" />
      <path d={`M${C + R - 6} ${top + H * 0.2}C${C + R + 130} ${top + H * 0.05} ${C + R + 130} ${bottom - H * 0.12} ${C + R - 6} ${bottom - H * 0.22}`} stroke={trim} strokeWidth="30" strokeLinecap="round" fill="none" />
      <path d={`M${C + R - 6} ${top + H * 0.2}C${C + R + 118} ${top + H * 0.08} ${C + R + 118} ${bottom - H * 0.15} ${C + R - 6} ${bottom - H * 0.22}`} stroke="#fff" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" fill="none" />
      <clipPath id={`${uid}-mug`}><path d={body} /></clipPath>
      <g clipPath={`url(#${uid}-mug)`}>
        <rect x={C - R} y={top} width={R * 2} height={H + ry} fill="#fff" />
        <WrapStrips href={href} uid={uid} cx={C} w={R * 2} y={top} h={H + ry} aspect={2.4} wrapDeg={215} />
        <defs><CylinderShade id={`${uid}-sh`} /></defs>
        <rect x={C - R} y={top} width={R * 2} height={H + ry} fill={`url(#${uid}-sh)`} />
      </g>
      <ellipse cx={C} cy={top} rx={R} ry={ry} fill="#F4F0E8" />
      <ellipse cx={C} cy={top + 2} rx={R - 9} ry={ry - 6} fill={shade(trim, isDark(trim) ? 0.1 : -0.12)} />
      <ellipse cx={C} cy={top + 6} rx={R - 22} ry={ry - 14} fill={shade(trim, -0.3)} opacity="0.35" />
      <path d={`M${C - R} ${top}A${R} ${ry} 0 0 1 ${C + R} ${top}`} stroke="#fff" strokeOpacity="0.8" strokeWidth="3" fill="none" />
    </g>
  );
}

/** Garrafa térmica: corpo colorido com faixa de arte, tampa e alça. */
export function Bottle({ m, href, uid }: DrawProps) {
  const W = 150 * m.scale;
  const H = 520 * (0.88 + m.scale * 0.12);
  const top = C - H / 2 + 20;
  const bottom = top + H;
  const body = m.bodyColor;
  const bandTop = top + H * 0.3;
  const bandH = H * 0.44;
  const dark = isDark(body);
  const bodyPath = `M${C - W / 2} ${top + 80}Q${C - W / 2} ${top + 40} ${C - W * 0.3} ${top + 28}H${C + W * 0.3}Q${C + W / 2} ${top + 40} ${C + W / 2} ${top + 80}V${bottom - 26}Q${C + W / 2} ${bottom} ${C + W / 2 - 26} ${bottom}H${C - W / 2 + 26}Q${C - W / 2} ${bottom} ${C - W / 2} ${bottom - 26}Z`;
  return (
    <g>
      <GroundShadow cx={C} cy={bottom + 6} rx={W * 0.8} ry={14} />
      <rect x={C - W * 0.17} y={top - 66} width={W * 0.34} height="46" rx="10" fill="#241C3D" />
      <path d={`M${C - W * 0.12} ${top - 64}C${C - W * 0.12} ${top - 120} ${C + W * 0.38} ${top - 120} ${C + W * 0.38} ${top - 64}`} stroke="#241C3D" strokeWidth="9" fill="none" strokeLinecap="round" />
      <rect x={C - W * 0.22} y={top - 24} width={W * 0.44} height="34" rx="6" fill="#3b3550" />
      <clipPath id={`${uid}-bt`}><path d={bodyPath} /></clipPath>
      <path d={bodyPath} fill={body} />
      <g clipPath={`url(#${uid}-bt)`}>
        <WrapStrips href={href} uid={uid} cx={C} w={W} y={bandTop} h={bandH} aspect={1.9} wrapDeg={260} strips={28} />
        <defs><CylinderShade id={`${uid}-sh`} /></defs>
        <rect x={C - W / 2} y={top} width={W} height={H} fill={`url(#${uid}-sh)`} />
        <rect x={C - W / 2} y={bottom - 36} width={W} height="36" fill="#000" opacity={dark ? 0.25 : 0.12} />
      </g>
    </g>
  );
}

/** Comedouro de cerâmica visto de lado, com faixa de arte ao redor. */
export function PetBowl({ m, href, uid }: DrawProps) {
  const R = 250 * m.scale;
  const base = R * 0.66;
  const H = 190 * m.scale;
  const top = C - H / 2;
  const bottom = top + H;
  const ry = R * 0.22;
  const body = `M${C - R} ${top}L${C - base} ${bottom}A${base} ${ry * 0.6} 0 0 0 ${C + base} ${bottom}L${C + R} ${top}Z`;
  return (
    <g>
      <GroundShadow cx={C} cy={bottom + ry * 0.5} rx={R * 1.05} ry={ry * 0.7} />
      <clipPath id={`${uid}-pb`}><path d={body} /></clipPath>
      <path d={body} fill={m.bodyColor} />
      <g clipPath={`url(#${uid}-pb)`}>
        <WrapStrips href={href} uid={uid} cx={C} w={R * 2} y={top + H * 0.14} h={H * 0.64} aspect={2.8} wrapDeg={230} strips={44} />
        <defs><CylinderShade id={`${uid}-sh`} /></defs>
        <rect x={C - R} y={top} width={R * 2} height={H + ry} fill={`url(#${uid}-sh)`} />
        <rect x={C - R} y={top} width={R * 2} height={H * 0.1} fill="#fff" opacity="0.25" />
      </g>
      <ellipse cx={C} cy={top} rx={R} ry={ry} fill={shade(m.bodyColor, -0.06)} />
      <ellipse cx={C} cy={top + 4} rx={R - 14} ry={ry - 9} fill={shade(m.bodyColor, -0.28)} />
      <path d={`M${C - R + 18} ${top + 6}A${R - 14} ${ry - 9} 0 0 1 ${C + R - 18} ${top + 6}`} stroke="#000" strokeOpacity="0.12" strokeWidth="4" fill="none" />
      <path d={`M${C - R} ${top}A${R} ${ry} 0 0 1 ${C + R} ${top}`} stroke="#fff" strokeOpacity="0.7" strokeWidth="3" fill="none" />
    </g>
  );
}
