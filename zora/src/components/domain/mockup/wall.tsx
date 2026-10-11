import { fitBox, isDark, shade } from '@/domain/mockup';
import { ArtImage, SoftShadow, type DrawProps } from './parts';

const C = 400;

/** Pôster, quadro com moldura, canvas, quadro de madeira, quadro magnético, calendário e cartão. */
export function WallArt({ m, href, uid }: DrawProps) {
  const { w, h } = fitBox(m.aspect, 520 * m.scale, 560 * m.scale);
  const x = C - w / 2;
  const y = C - h / 2;

  if (m.frameColor && m.variant !== 'wood-frame') {
    const f = Math.max(18, w * 0.055);
    const mat = Math.max(14, w * 0.075);
    const fw = w + f * 2;
    const fh = h + f * 2;
    const fx = C - fw / 2;
    const fy = C - fh / 2;
    return (
      <g>
        <SoftShadow x={fx} y={fy} w={fw} h={fh} r={4} />
        <rect x={fx} y={fy} width={fw} height={fh} fill={m.frameColor} />
        <path d={`M${fx} ${fy}L${fx + f} ${fy + f}H${fx + fw - f}L${fx + fw} ${fy}Z`} fill="#fff" opacity="0.22" />
        <path d={`M${fx + fw} ${fy + fh}L${fx + fw - f} ${fy + fh - f}H${fx + f}L${fx} ${fy + fh}Z`} fill="#000" opacity="0.2" />
        <rect x={fx + f} y={fy + f} width={w} height={h} fill="#FBF8F2" />
        <rect x={x + mat} y={y + mat} width={w - mat * 2} height={h - mat * 2} fill="#000" opacity="0.08" transform="translate(2 3)" />
        <ArtImage href={href} x={x + mat} y={y + mat} w={w - mat * 2} h={h - mat * 2} />
        <path d={`M${fx + f} ${fy + f}h${w}`} stroke="#000" strokeOpacity="0.18" strokeWidth="3" />
      </g>
    );
  }

  switch (m.kind) {
    case 'canvas': {
      const d = 24;
      return (
        <g>
          <SoftShadow x={x} y={y} w={w + d} h={h + d} r={2} dy={22} />
          <path d={`M${x + w} ${y}l${d} ${d * 0.6}V${y + h + d * 0.6}l-${d} ${d * 0.4}Z`} fill="#EDE6D8" />
          <path d={`M${x + w} ${y}l${d} ${d * 0.6}V${y + h + d * 0.6}l-${d} ${d * 0.4}Z`} fill="#000" opacity="0.12" />
          <path d={`M${x} ${y + h}l${d} ${d * 0.4}H${x + w + d}l-${d} -${d * 0.4}Z`} fill="#D9D0BE" />
          <ArtImage href={href} x={x} y={y} w={w} h={h} />
          <linearGradient id={`${uid}-cv`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="1" stopColor="#000" stopOpacity="0.08" />
          </linearGradient>
          <rect x={x} y={y} width={w} height={h} fill={`url(#${uid}-cv)`} />
        </g>
      );
    }
    case 'wood-frame': {
      const wood = m.frameColor ?? '#C9A276';
      const f = Math.max(22, w * 0.07);
      const fw = w + f * 2;
      const fh = h + f * 2;
      const fx = C - fw / 2;
      const fy = C - fh / 2;
      return (
        <g>
          <SoftShadow x={fx} y={fy} w={fw} h={fh} r={6} />
          <rect x={fx} y={fy} width={fw} height={fh} rx="6" fill={wood} />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${fx} ${fy + (fh / 9) * i + 10}Q${fx + fw / 2} ${fy + (fh / 9) * i + (i % 2 ? 22 : -2)} ${fx + fw} ${fy + (fh / 9) * i + 10}`} stroke={shade(wood, -0.25)} strokeOpacity="0.45" strokeWidth="2" fill="none" />
          ))}
          <rect x={fx + f - 6} y={fy + f - 6} width={w + 12} height={h + 12} fill="#000" opacity="0.18" />
          <ArtImage href={href} x={fx + f} y={fy + f} w={w} h={h} />
          <rect x={fx} y={fy} width={fw} height={fh} rx="6" fill="none" stroke="#000" strokeOpacity="0.2" strokeWidth="2" />
        </g>
      );
    }
    case 'fridge-board': {
      const strip = h * 0.2;
      return (
        <g>
          <SoftShadow x={x} y={y} w={w} h={h} r={18} />
          <clipPath id={`${uid}-fb`}><rect x={x} y={y} width={w} height={h} rx="18" /></clipPath>
          <g clipPath={`url(#${uid}-fb)`}>
            <ArtImage href={href} x={x} y={y} w={w} h={h - strip} />
            <rect x={x} y={y + h - strip} width={w} height={strip} fill="#FBF8F2" />
            {[0.35, 0.7].map((k) => <path key={k} d={`M${x + 24} ${y + h - strip * (1 - k)}H${x + w - 24}`} stroke="#C9C1B3" strokeWidth="2" strokeDasharray="6 6" />)}
            <path d={`M${x + 28} ${y + h - strip * 0.55}q14 -16 28 0t28 0t28 0`} stroke="#241C3D" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
          </g>
          {[[x + 26, y + 26, '#C8421C'], [x + w - 26, y + 26, '#F2B33D'], [x + w - 26, y + h - strip - 6, '#2E9C86']].map(([cx, cy, c], i) => (
            <g key={i}><circle cx={cx as number} cy={(cy as number) + 4} r="16" fill="#000" opacity="0.2" /><circle cx={cx as number} cy={cy as number} r="16" fill={c as string} /><circle cx={(cx as number) - 5} cy={(cy as number) - 5} r="5" fill="#fff" opacity="0.5" /></g>
          ))}
        </g>
      );
    }
    case 'calendar': {
      const top = h * 0.58;
      return (
        <g>
          <SoftShadow x={x} y={y} w={w} h={h} r={6} />
          <rect x={x} y={y} width={w} height={h} rx="6" fill="#FBF8F2" />
          <ArtImage href={href} x={x} y={y} w={w} h={top} />
          <rect x={x} y={y + top} width={w} height={h * 0.07} fill="#241C3D" />
          {Array.from({ length: 7 }, (_, i) => <rect key={i} x={x + 14 + i * ((w - 28) / 7) + 4} y={y + top + h * 0.025} width={(w - 28) / 7 - 8} height="4" rx="2" fill="#FBF6EE" opacity="0.7" />)}
          {Array.from({ length: 35 }, (_, i) => (
            <rect key={i} x={x + 14 + (i % 7) * ((w - 28) / 7) + 3} y={y + top + h * 0.1 + Math.floor(i / 7) * ((h * 0.3) / 5)} width={(w - 28) / 7 - 6} height={(h * 0.3) / 5 - 6} rx="3" fill={i === 12 ? '#C8421C' : '#E6DCCB'} opacity={i === 12 ? 1 : 0.7} />
          ))}
          {Array.from({ length: Math.floor(w / 36) }, (_, i) => <rect key={i} x={x + 18 + i * 36} y={y - 8} width="8" height="26" rx="4" fill="#3b3550" />)}
        </g>
      );
    }
    case 'card': {
      return (
        <g>
          <g transform={`rotate(-7 ${C} ${C})`}>
            <SoftShadow x={x - 30} y={y + 24} w={w + 20} h={h} r={4} />
            <rect x={x - 30} y={y + 24} width={w + 20} height={h} fill="#D8B98A" />
            <path d={`M${x - 30} ${y + 24}L${x + w / 2 - 20} ${y + 24 + h * 0.5}L${x + w - 10} ${y + 24}Z`} fill="#C4A474" />
          </g>
          <g transform={`rotate(4 ${C} ${C})`}>
            <SoftShadow x={x + 6} y={y - 10} w={w} h={h} r={3} />
            <rect x={x + 6} y={y - 10} width={w} height={h} fill="#fff" />
            <ArtImage href={href} x={x + 6 + 12} y={y - 10 + 12} w={w - 24} h={h - 24} />
          </g>
        </g>
      );
    }
    default: {
      // pôster sem moldura: papel com borda branca, curvatura e fita adesiva
      const b = 10;
      const dark = isDark('#FFFFFF');
      return (
        <g>
          <SoftShadow x={x} y={y} w={w} h={h} r={2} dy={16} strength={dark ? 0.1 : 0.12} />
          <rect x={x - b} y={y - b} width={w + b * 2} height={h + b * 2} fill="#FFFFFF" />
          <ArtImage href={href} x={x} y={y} w={w} h={h} />
          <linearGradient id={`${uid}-pp`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.1" />
          </linearGradient>
          <rect x={x - b} y={y - b} width={w + b * 2} height={h + b * 2} fill={`url(#${uid}-pp)`} />
          {[x - b + 24, x + w + b - 24 - 70].map((tx, i) => <rect key={i} x={tx} y={y - b - 12} width="70" height="26" fill="#F2B33D" opacity="0.7" transform={`rotate(${i ? 5 : -5} ${tx + 35} ${y - b})`} />)}
        </g>
      );
    }
  }
}
