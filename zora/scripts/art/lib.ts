/** Primitivas SVG para o gerador de artes placeholder (originais, sem imagens externas). */
export type Pal = string[];
export const SIZE = { portrait: [600, 800], landscape: [800, 600], square: [700, 700] } as const;

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const hashStr = (s: string) => [...s].reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0, 7);

const f = (n: number) => +n.toFixed(1);
export const circle = (cx: number, cy: number, r: number, fill: string, extra = '') =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" ${extra}/>`;
export const ellipse = (cx: number, cy: number, rx: number, ry: number, fill: string, extra = '') =>
  `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${extra}/>`;
export const rect = (x: number, y: number, w: number, h: number, fill: string, rx = 0, extra = '') =>
  `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="${fill}" ${extra}/>`;
export const path = (d: string, fill = 'none', extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
export const line = (x1: number, y1: number, x2: number, y2: number, stroke: string, w = 6) =>
  `<path d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
export const g = (transform: string, body: string) => `<g transform="${transform}">${body}</g>`;
export const text = (x: number, y: number, s: string, size: number, fill: string, extra = '') =>
  `<text x="${f(x)}" y="${f(y)}" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" ${extra.includes('font-weight') ? '' : 'font-weight="700"'} fill="${fill}" ${extra}>${s}</text>`;

export const star = (cx: number, cy: number, r: number, fill: string, pts = 5, inner = 0.45) => {
  const d = Array.from({ length: pts * 2 }, (_, i) => {
    const a = (Math.PI * i) / pts - Math.PI / 2;
    const rr = i % 2 ? r * inner : r;
    return `${i ? 'L' : 'M'}${f(cx + rr * Math.cos(a))} ${f(cy + rr * Math.sin(a))}`;
  }).join('');
  return path(d + 'Z', fill);
};

export const sparkle = (cx: number, cy: number, r: number, fill: string) =>
  path(`M${cx} ${cy - r}Q${cx} ${cy} ${cx + r} ${cy}Q${cx} ${cy} ${cx} ${cy + r}Q${cx} ${cy} ${cx - r} ${cy}Q${cx} ${cy} ${cx} ${cy - r}Z`, fill);

/** Folha: ponta em (0,0) e comprimento `len` para cima, girada por `angle` graus. */
export const leaf = (x: number, y: number, len: number, angle: number, fill: string, wid = 0.32) =>
  g(`translate(${f(x)} ${f(y)}) rotate(${angle})`, path(`M0 0C${f(-len * wid)} ${f(-len * 0.35)} ${f(-len * wid)} ${f(-len * 0.8)} 0 ${f(-len)}C${f(len * wid)} ${f(-len * 0.8)} ${f(len * wid)} ${f(-len * 0.35)} 0 0Z`, fill));

export const heart = (cx: number, cy: number, s: number, fill: string) =>
  path(`M${cx} ${f(cy + s * 0.9)}C${f(cx - s * 1.6)} ${f(cy - s * 0.1)} ${f(cx - s * 0.8)} ${f(cy - s * 1.2)} ${cx} ${f(cy - s * 0.4)}C${f(cx + s * 0.8)} ${f(cy - s * 1.2)} ${f(cx + s * 1.6)} ${f(cy - s * 0.1)} ${cx} ${f(cy + s * 0.9)}Z`, fill);

export const wave = (y: number, amp: number, len: number, W: number, fill: string, phase = 0) => {
  let d = `M0 ${y}`;
  for (let x = 0; x <= W + len; x += len) d += `Q${f(x + len / 4 + phase)} ${f(y - amp)} ${f(x + len / 2 + phase)} ${y}T${f(x + len + phase)} ${y}`;
  return path(`${d}L${W + len * 2} 5000L-200 5000Z`, fill);
};

export const svg = (W: number, H: number, bg: string, body: string, title: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${title}"><rect width="${W}" height="${H}" fill="${bg}"/>${body}</svg>\n`;
