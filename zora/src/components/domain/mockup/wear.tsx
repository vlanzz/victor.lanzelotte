import { isDark, shade } from '@/domain/mockup';
import { ArtImage, GroundShadow, SoftShadow, type DrawProps } from './parts';

const C = 400;

/** Camiseta: silhueta frontal com estampa no peito, dobras e gola. */
export function Tshirt({ m, href, uid }: DrawProps) {
  const body = m.bodyColor;
  const s = m.scale;
  const line = isDark(body) ? '#fff' : '#000';
  const shirt = 'M290 150L345 122Q400 178 455 122L510 150L648 220L596 328L540 300V648Q400 668 260 648V300L204 328L152 220Z';
  return (
    <g transform={`translate(${C} ${C}) scale(${s}) translate(${-C} ${-C - 6})`}>
      <GroundShadow cx={C} cy={690} rx={250} ry={16} />
      <path d={shirt} fill={body} stroke={body === '#FFFFFF' ? '#E1D8C8' : 'none'} strokeWidth="3" />
      <clipPath id={`${uid}-ts`}><path d={shirt} /></clipPath>
      <g clipPath={`url(#${uid}-ts)`}>
        <linearGradient id={`${uid}-tsg`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.18" /><stop offset="0.2" stopColor="#000" stopOpacity="0" /><stop offset="0.45" stopColor="#fff" stopOpacity="0.16" /><stop offset="0.8" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <rect x="140" y="110" width="520" height="580" fill={`url(#${uid}-tsg)`} />
        <path d="M262 304L212 332M538 304L588 332" stroke={line} strokeOpacity="0.12" strokeWidth="5" />
        <path d="M300 520Q340 540 330 600M500 500Q470 540 480 590" stroke={line} strokeOpacity="0.07" strokeWidth="14" fill="none" strokeLinecap="round" />
        <rect x="262" y="620" width="276" height="30" fill={line} opacity="0.06" />
      </g>
      <path d="M345 122Q400 178 455 122" fill="none" stroke={shade(body, -0.22)} strokeWidth="14" strokeLinecap="round" />
      <path d="M352 130Q400 176 448 130" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="3" />
      <clipPath id={`${uid}-tsa`}><rect x="290" y="236" width="220" height="220" rx="6" /></clipPath>
      <g clipPath={`url(#${uid}-tsa)`}>
        <ArtImage href={href} x={290} y={236} w={220} h={220} fit="contain" />
        <rect x="290" y="236" width="220" height="220" fill="#fff" opacity="0.0" />
        <linearGradient id={`${uid}-tsp`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.08" /><stop offset="1" stopColor="#000" stopOpacity="0.1" /></linearGradient>
        <rect x="290" y="236" width="220" height="220" fill={`url(#${uid}-tsp)`} />
      </g>
    </g>
  );
}

/** Ecobag com alças e costuras. */
export function Tote({ m, href, uid }: DrawProps) {
  const body = m.bodyColor === '#FFFFFF' ? '#F3EBDD' : m.bodyColor;
  const dark = isDark(body);
  const bag = 'M196 270H604L624 700H176Z';
  return (
    <g>
      <GroundShadow cx={C} cy={708} rx={250} ry={15} />
      <path d="M290 280C290 90 510 90 510 280" fill="none" stroke={shade(body, -0.25)} strokeWidth="32" strokeLinecap="round" />
      <path d="M290 280C290 90 510 90 510 280" fill="none" stroke={body} strokeWidth="24" strokeLinecap="round" />
      <path d={bag} fill={body} />
      <clipPath id={`${uid}-tt`}><path d={bag} /></clipPath>
      <g clipPath={`url(#${uid}-tt)`}>
        <linearGradient id={`${uid}-ttg`} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#000" stopOpacity="0.14" /><stop offset="0.4" stopColor="#fff" stopOpacity="0.1" /><stop offset="1" stopColor="#000" stopOpacity="0.2" /></linearGradient>
        <rect x="170" y="260" width="470" height="450" fill={`url(#${uid}-ttg)`} />
        <path d="M196 270H604" stroke={dark ? '#fff' : '#000'} strokeOpacity="0.2" strokeWidth="4" strokeDasharray="10 8" transform="translate(0 16)" />
        <ArtImage href={href} x={270} y={380} w={260} h={260} fit="contain" />
      </g>
      <path d="M320 286Q320 360 300 420M480 286Q480 360 500 420" stroke="#000" strokeOpacity="0.08" strokeWidth="14" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Boné visto de frente com a arte no painel frontal. */
export function Cap({ m, href, uid }: DrawProps) {
  const body = m.bodyColor === '#FFFFFF' ? '#F1ECE2' : m.bodyColor;
  const crown = 'M170 470Q170 180 400 180Q630 180 630 470Z';
  const dark = isDark(body);
  return (
    <g>
      <GroundShadow cx={C} cy={640} rx={280} ry={16} />
      <path d="M130 480Q400 410 670 480Q690 560 400 616Q110 560 130 480Z" fill={shade(body, -0.22)} />
      <path d="M150 482Q400 424 650 482Q662 540 400 592Q138 540 150 482Z" fill={shade(body, -0.1)} />
      <path d="M170 490Q400 440 630 490" stroke="#fff" strokeOpacity="0.3" strokeWidth="4" fill="none" />
      <path d={crown} fill={body} />
      <clipPath id={`${uid}-cp`}><path d={crown} /></clipPath>
      <g clipPath={`url(#${uid}-cp)`}>
        <radialGradient id={`${uid}-cpg`} cx="0.4" cy="0.25" r="0.9"><stop offset="0" stopColor="#fff" stopOpacity="0.3" /><stop offset="1" stopColor="#000" stopOpacity="0.25" /></radialGradient>
        <rect x="160" y="170" width="480" height="320" fill={`url(#${uid}-cpg)`} />
        <path d="M400 190V470M290 205Q260 330 200 470M510 205Q540 330 600 470" stroke={dark ? '#fff' : '#000'} strokeOpacity="0.14" strokeWidth="3" fill="none" />
        <ArtImage href={href} x={275} y={285} w={250} h={165} fit="contain" />
      </g>
      <circle cx="400" cy="186" r="15" fill={shade(body, -0.25)} />
      {[300, 500].map((cx) => <circle key={cx} cx={cx} cy="226" r="5" fill={shade(body, -0.35)} />)}
    </g>
  );
}

/** Par de meias com estampa contínua e ponta/calcanhar em contraste. */
export function Socks({ m, href, uid }: DrawProps) {
  const trim = m.bodyColor === '#FFFFFF' ? '#241C3D' : m.bodyColor;
  const sock = 'M290 130H440V470Q440 520 490 540L560 568Q610 590 600 650Q592 696 530 696H330Q262 696 270 626Z';
  const tile = 170;
  const one = (dx: number, dy: number, rot: number, id: string, opacity = 1) => (
    <g transform={`translate(${dx} ${dy}) rotate(${rot} 420 400)`} opacity={opacity}>
      <clipPath id={`${uid}-${id}`}><path d={sock} /></clipPath>
      <path d={sock} fill="#000" opacity="0.12" transform="translate(5 8)" />
      <path d={sock} fill="#fff" />
      <g clipPath={`url(#${uid}-${id})`}>
        <rect x="260" y="120" width="360" height="590" fill={`url(#${uid}-sp)`} />
        <rect x="260" y="120" width="190" height="52" fill={trim} />
        <path d="M262 626Q262 696 330 696H380V600Z" fill={trim} />
        <path d="M530 696Q600 690 600 650Q600 600 560 568L520 560V696Z" fill={trim} />
        <linearGradient id={`${uid}-${id}-grad`} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0.18" /><stop offset="1" stopColor="#000" stopOpacity="0.16" /></linearGradient>
        <rect x="260" y="120" width="360" height="590" fill={`url(#${uid}-${id}-grad)`} />
      </g>
    </g>
  );
  return (
    <g transform="translate(0 -30)">
      <GroundShadow cx={C + 10} cy={722} rx={270} ry={14} />
      <pattern id={`${uid}-sp`} width={tile} height={tile} patternUnits="userSpaceOnUse">
        <rect width={tile} height={tile} fill="#FBF6EE" />
        <ArtImage href={href} x={8} y={8} w={tile - 16} h={tile - 16} />
      </pattern>
      {one(-110, 20, -4, 'a', 0.96)}
      {one(70, -10, 3, 'b')}
    </g>
  );
}

/** Necessaire com zíper, puxador e etiqueta. */
export function Pouch({ m, href, uid }: DrawProps) {
  const body = m.bodyColor === '#FFFFFF' ? '#F3EBDD' : m.bodyColor;
  const w = 560 * m.scale;
  const h = w / m.aspect;
  const x = C - w / 2;
  const y = C - h / 2 + 10;
  return (
    <g>
      <SoftShadow x={x} y={y} w={w} h={h} r={38} dy={22} />
      <rect x={x} y={y} width={w} height={h} rx="38" fill={body} />
      <clipPath id={`${uid}-po`}><rect x={x} y={y} width={w} height={h} rx="38" /></clipPath>
      <g clipPath={`url(#${uid}-po)`}>
        <linearGradient id={`${uid}-pog`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.2" /><stop offset="0.6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.2" /></linearGradient>
        <rect x={x} y={y} width={w} height={h} fill={`url(#${uid}-pog)`} />
        <rect x={x} y={y} width={w} height="38" fill={shade(body, -0.14)} />
        <path d={`M${x} ${y + 38}H${x + w}`} stroke="#000" strokeOpacity="0.2" strokeWidth="2" />
        <path d={`M${x + 20} ${y + 19}H${x + w - 20}`} stroke={isDark(body) ? '#fff' : '#241C3D'} strokeOpacity="0.7" strokeWidth="6" strokeDasharray="3 4" />
        <ArtImage href={href} x={x + w * 0.2} y={y + 62} w={w * 0.6} h={h - 62 - 28} fit="contain" />
      </g>
      <rect x={x + w - 80} y={y + 6} width="34" height="28" rx="8" fill="#C9C4BC" />
      <circle cx={x + w - 35} cy={y + 19} r="9" fill="#8d877c" />
    </g>
  );
}
