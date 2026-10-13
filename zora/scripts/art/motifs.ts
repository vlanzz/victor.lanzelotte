import { circle, ellipse, g, heart, leaf, line, path, rect, sparkle, star, text, wave, type Pal } from './lib';

type Motif = (W: number, H: number, p: Pal, r: () => number) => string;

const stars = (W: number, H: number, r: () => number, color: string, n = 14, maxY = 1) =>
  Array.from({ length: n }, () => sparkle(r() * W, r() * H * maxY, 6 + r() * 12, color)).join('');

export const motifs: Record<string, Motif> = {
  /* ===== PETS ===== */
  cat: (W, H, p, r) =>
    circle(W / 2, H * 0.36, W * 0.3, p[2]!) + stars(W, H, r, p[3]!, 10, 0.5) +
    g(`translate(${W / 2} ${H * 0.62})`,
      path('M-120 200C-130 60 -90 -10 -60 -20L-80 -90L-30 -60Q0 -70 30 -60L80 -90L60 -20C90 -10 130 60 120 200Z', p[1]!) +
      path('M120 190C190 190 210 120 170 80', 'none', `stroke="${p[1]}" stroke-width="26" stroke-linecap="round"`) +
      circle(-32, -10, 9, p[2]!) + circle(32, -10, 9, p[2]!) + path('M-8 12L8 12L0 22Z', p[3]!)) +
    rect(0, H * 0.9, W, H * 0.1, p[1]!),

  dog: (W, H, p) =>
    circle(W / 2, H / 2, W * 0.42, p[2]!, 'opacity=".9"') +
    path(`M${W * 0.24} ${H * 0.34}C${W * 0.1} ${H * 0.36} ${W * 0.1} ${H * 0.7} ${W * 0.22} ${H * 0.72}C${W * 0.3} ${H * 0.68} ${W * 0.3} ${H * 0.45} ${W * 0.3} ${H * 0.34}Z`, p[1]!) +
    path(`M${W * 0.76} ${H * 0.34}C${W * 0.9} ${H * 0.36} ${W * 0.9} ${H * 0.7} ${W * 0.78} ${H * 0.72}C${W * 0.7} ${H * 0.68} ${W * 0.7} ${H * 0.45} ${W * 0.7} ${H * 0.34}Z`, p[1]!) +
    ellipse(W / 2, H * 0.52, W * 0.23, W * 0.25, p[4]!) + ellipse(W / 2, H * 0.6, W * 0.13, W * 0.1, p[2]!, 'opacity=".5"') +
    circle(W * 0.42, H * 0.46, 14, p[3]!) + circle(W * 0.58, H * 0.46, 14, p[3]!) +
    ellipse(W / 2, H * 0.56, 24, 16, p[3]!) + path(`M${W * 0.46} ${H * 0.62}Q${W / 2} ${H * 0.72} ${W * 0.54} ${H * 0.62}Z`, '#E07A8A'),

  fox: (W, H, p) =>
    rect(0, H * 0.62, W, H * 0.38, p[3]!, 0, 'opacity=".12"') +
    [0, 1, 2, 3].map((i) => circle(W * 0.5, H * 0.66, W * (0.42 - i * 0.07), [p[2]!, p[1]!, p[4]!, p[2]!][i]!, `opacity="${0.18 + i * 0.08}"`)).join('') +
    g(`translate(${W / 2} ${H * 0.55})`,
      path('M-150 -110L-70 -40L70 -40L150 -110L130 40L0 150L-130 40Z', p[1]!) +
      path('M-60 10L0 150L60 10Q0 60 -60 10Z', p[2]!) +
      path('M-150 -110L-110 -30L-70 -40Z', p[3]!) + path('M150 -110L110 -30L70 -40Z', p[3]!) +
      circle(-48, -2, 10, p[3]!) + circle(48, -2, 10, p[3]!) + circle(0, 140, 14, p[3]!)),

  paws: (W, H, p, r) => {
    let out = '';
    for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) {
      const cx = 70 + x * 140 + (y % 2) * 50, cy = 70 + y * 140, a = (r() - 0.5) * 70;
      const col = [p[1]!, p[2]!, p[3]!, p[4]!][(x + y) % 4]!;
      out += g(`translate(${cx} ${cy}) rotate(${a}) scale(${0.9 + r() * 0.25})`,
        ellipse(0, 12, 26, 22, col) + ellipse(-26, -22, 9, 13, col) + ellipse(-9, -34, 9, 13, col) + ellipse(9, -34, 9, 13, col) + ellipse(26, -22, 9, 13, col));
    }
    return out;
  },

  /* ===== GEEK ===== */
  'pixel-heart': (W, H, p, r) => {
    const map = ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000'];
    const s = 62, ox = (W - 7 * s) / 2, oy = H * 0.3;
    const cells = map.flatMap((row, y) => [...row].map((c, x) => (c === '1' ? rect(ox + x * s, oy + y * s, s - 4, s - 4, y < 2 && x > 4 ? p[4]! : p[1]!) : ''))).join('');
    const bits = Array.from({ length: 26 }, () => rect(Math.floor(r() * 14) * 50, Math.floor(r() * 14) * 50, 20, 20, [p[2]!, p[3]!][Math.floor(r() * 2)]!, 0, 'opacity=".5"')).join('');
    return bits + cells + rect(ox + s * 5, oy + s * 0.3, s * 0.55, s * 0.55, p[4]!, 0, 'opacity=".9"');
  },

  dice: (W, H, p, r) =>
    stars(W, H, r, p[2]!, 18) +
    g(`translate(${W / 2} ${H * 0.48})`,
      path('M0 -230L200 -110L200 120L0 230L-200 120L-200 -110Z', p[1]!) +
      path('M0 -230L0 -80L-200 -110Z', p[3]!, 'opacity=".5"') + path('M0 -230L0 -80L200 -110Z', p[4]!, 'opacity=".25"') +
      path('M-200 -110L0 -80L-200 120Z', p[3]!, 'opacity=".3"') + path('M200 -110L0 -80L200 120Z', p[0]!, 'opacity=".25"') +
      path('M0 -80L-200 120L0 230L200 120Z', p[2]!, 'opacity=".35"') +
      text(0, 30, '20', 110, p[4]!, 'text-anchor="middle"')),

  portal: (W, H, p, r) =>
    stars(W, H, r, p[4]!, 24) +
    [0, 1, 2, 3, 4, 5].map((i) => ellipse(W / 2, H / 2, W * (0.12 + i * 0.065), H * (0.2 + i * 0.07), 'none', `stroke="${[p[1]!, p[3]!, p[2]!][i % 3]}" stroke-width="${10 - i}" opacity="${1 - i * 0.12}"`)).join('') +
    ellipse(W / 2, H / 2, W * 0.1, H * 0.16, p[2]!, 'opacity=".9"'),

  gamepad: (W, H, p) =>
    g(`translate(${W / 2} ${H / 2})`,
      path('M-260 -40Q-240 -140 -140 -140L140 -140Q240 -140 260 -40L290 110Q300 170 240 170Q200 170 170 120L120 70L-120 70L-170 120Q-200 170 -240 170Q-300 170 -290 110Z', p[1]!) +
      rect(-200, -40, 90, 28, p[4]!, 6) + rect(-169, -71, 28, 90, p[4]!, 6) +
      circle(160, -50, 24, p[2]!) + circle(110, -10, 24, p[3]!) + circle(210, -10, 24, p[4]!) + circle(160, 30, 24, p[2]!) +
      circle(-70, 30, 30, p[0]!, 'opacity=".35"') + circle(60, 30, 30, p[0]!, 'opacity=".35"')) +
    text(60, H * 0.12, 'PLAY', 60, p[1]!, 'opacity=".25"'),

  /* ===== PROFISSÕES ===== */
  code: (W, H, p, r) =>
    rect(W * 0.12, H * 0.2, W * 0.76, H * 0.46, p[2]!, 24) + rect(W * 0.16, H * 0.24, W * 0.68, H * 0.38, p[3]!, 14) +
    text(W * 0.5, H * 0.5, '&lt;/&gt;', 120, p[4]!, 'text-anchor="middle"') +
    path(`M${W * 0.04} ${H * 0.68}L${W * 0.96} ${H * 0.68}L${W * 0.9} ${H * 0.74}L${W * 0.1} ${H * 0.74}Z`, p[2]!) +
    g(`translate(${W * 0.78} ${H * 0.8})`, rect(-40, -10, 80, 70, p[4]!, 12) + path('M40 5Q80 5 70 40Q60 55 40 50', 'none', `stroke="${p[4]}" stroke-width="12"`) +
      path('M-15 -20Q-5 -50 -15 -70M15 -20Q25 -50 15 -70', 'none', `stroke="${p[2]}" stroke-width="8" stroke-linecap="round"`)) +
    stars(W, H, r, p[3]!, 8, 0.17),

  care: (W, H, p) =>
    circle(W / 2, H * 0.4, W * 0.34, p[1]!, 'opacity=".25"') + heart(W / 2, H * 0.4, W * 0.2, p[2]!) +
    rect(W / 2 - 14, H * 0.4 - 52, 28, 100, p[4]!, 6) + rect(W / 2 - 50, H * 0.4 - 14, 100, 28, p[4]!, 6) +
    path(`M0 ${H * 0.75}L${W * 0.28} ${H * 0.75}L${W * 0.36} ${H * 0.66}L${W * 0.46} ${H * 0.84}L${W * 0.55} ${H * 0.7}L${W * 0.6} ${H * 0.75}L${W} ${H * 0.75}`, 'none', `stroke="${p[3]}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"`),

  design: (W, H, p) =>
    ['#C8421C', '#F2B33D', '#8B7CF6', '#241C3D'].map((c, i) => rect(W * 0.1 + i * W * 0.2, H * 0.68, W * 0.17, H * 0.18, c, 14)).join('') +
    path(`M${W * 0.1} ${H * 0.55}C${W * 0.3} ${H * 0.05} ${W * 0.55} ${H * 0.75} ${W * 0.9} ${H * 0.2}`, 'none', `stroke="${p[1]}" stroke-width="10" stroke-dasharray="2 22" stroke-linecap="round"`) +
    [[W * 0.1, H * 0.55], [W * 0.9, H * 0.2]].map(([x, y]) => rect(x! - 12, y! - 12, 24, 24, p[0]!, 0, `stroke="${p[3]}" stroke-width="5"`)).join('') +
    g(`translate(${W * 0.5} ${H * 0.36}) rotate(-35)`, rect(-130, -22, 220, 44, p[4]!, 6) + path('M90 -22L150 0L90 22Z', '#F4D8B0') + path('M130 -8L150 0L130 8Z', p[3]!) + rect(-130, -22, 36, 44, p[1]!, 6)),

  tools: (W, H, p) =>
    circle(W / 2, H / 2, W * 0.4, p[1]!, 'opacity=".15"') +
    g(`translate(${W / 2} ${H / 2})`,
      Array.from({ length: 8 }, (_, i) => rect(-24, -170, 48, 70, p[3]!, 8, `transform="rotate(${i * 45})"`)).join('') +
      circle(0, 0, 130, p[3]!) + circle(0, 0, 60, p[0]!) +
      g('rotate(40)', rect(-18, -250, 36, 500, p[2]!, 18) + rect(-48, -260, 96, 54, p[1]!, 12)) +
      g('rotate(-40)', rect(-14, -230, 28, 460, p[4]!, 14, 'opacity=".95"') + rect(-60, -250, 120, 52, p[4]!, 10, 'opacity=".95"'))),

  /* ===== DATAS ===== */
  xmas: (W, H, p, r) =>
    stars(W, H, r, p[1]!, 16) +
    g(`translate(${W / 2} ${H * 0.2})`, star(0, 0, 54, p[2]!)) +
    [0, 1, 2].map((i) => path(`M${W / 2} ${H * (0.24 + i * 0.16)}L${W * (0.72 + i * 0.07)} ${H * (0.5 + i * 0.16)}L${W * (0.28 - i * 0.07)} ${H * (0.5 + i * 0.16)}Z`, [p[4]!, '#2E7358', p[4]!][i]!)).join('') +
    rect(W / 2 - 24, H * 0.82, 48, 60, '#8A4B2A') +
    [[0.42, 0.42], [0.58, 0.55], [0.38, 0.66], [0.62, 0.7], [0.5, 0.58]].map(([x, y], i) => circle(W * x!, H * y!, 14, [p[3]!, p[2]!, p[1]!][i % 3]!)).join('') +
    Array.from({ length: 30 }, () => circle(r() * W, r() * H, 3 + r() * 4, p[1]!, 'opacity=".8"')).join(''),

  bouquet: (W, H, p, r) => {
    const fl = (x: number, y: number, s: number, c: string) =>
      Array.from({ length: 6 }, (_, i) => ellipse(x + Math.cos((i * Math.PI) / 3) * s, y + Math.sin((i * Math.PI) / 3) * s, s * 0.85, s * 0.55, c, `transform="rotate(${i * 60} ${x + Math.cos((i * Math.PI) / 3) * s} ${y + Math.sin((i * Math.PI) / 3) * s})"`)).join('') + circle(x, y, s * 0.6, p[4]!);
    return [[0.3, 0.38], [0.5, 0.28], [0.7, 0.38], [0.4, 0.5], [0.62, 0.52]].map(([x, y]) => line(W * x!, H * y!, W / 2, H * 0.82, p[3]!, 8)).join('') +
      leaf(W * 0.42, H * 0.7, 120, -50, p[3]!) + leaf(W * 0.58, H * 0.7, 120, 50, p[3]!) +
      [[0.3, 0.38, p[2]!], [0.5, 0.28, p[1]!], [0.7, 0.38, p[2]!], [0.4, 0.5, p[1]!], [0.62, 0.52, p[2]!]].map(([x, y, c]) => fl(W * (x as number), H * (y as number), 34 + r() * 8, c as string)).join('') +
      path(`M${W * 0.36} ${H * 0.8}L${W * 0.64} ${H * 0.8}L${W * 0.58} ${H * 0.95}L${W * 0.42} ${H * 0.95}Z`, p[4]!) + rect(W * 0.34, H * 0.78, W * 0.32, 22, p[1]!, 6);
  },

  hearts: (W, H, p, r) =>
    Array.from({ length: 22 }, () => g(`rotate(${(r() - 0.5) * 60} ${W / 2} ${H / 2})`, heart(r() * W, r() * H, 22 + r() * 40, [p[1]!, p[2]!, p[3]!, p[4]!][Math.floor(r() * 4)]!))).join('') +
    heart(W / 2, H / 2, 150, p[1]!) + heart(W / 2 - 40, H / 2 - 40, 40, p[4]!),

  confetti: (W, H, p, r) =>
    Array.from({ length: 60 }, () => {
      const c = [p[1]!, p[2]!, p[3]!, p[4]!][Math.floor(r() * 4)]!, x = r() * W, y = r() * H, s = 10 + r() * 22;
      return r() < 0.4 ? circle(x, y, s / 2, c) : rect(x, y, s, s / 2.5, c, 3, `transform="rotate(${r() * 180} ${x} ${y})"`);
    }).join('') +
    g(`translate(${W / 2} ${H * 0.52})`, path('M-110 120L0 -150L110 120Z', p[1]!) + [0, 1, 2].map((i) => path(`M${-90 + i * 20} ${90 - i * 70}L${90 - i * 20} ${90 - i * 70}`, 'none', `stroke="${p[0]}" stroke-width="14"`)).join('') + circle(0, -156, 24, p[2]!)),

  /* ===== MINIMAL ===== */
  arches: (W, H, p) =>
    [0, 1, 2].map((i) => path(`M${W * (0.12 + i * 0.28)} ${H * 0.82}L${W * (0.12 + i * 0.28)} ${H * (0.5 - i * 0.06)}A${W * 0.13} ${W * 0.13} 0 0 1 ${W * (0.38 + i * 0.28)} ${H * (0.5 - i * 0.06)}L${W * (0.38 + i * 0.28)} ${H * 0.82}Z`, [p[1]!, p[2]!, p[3]!][i]!, i === 2 ? 'opacity=".9"' : '')).join('') +
    circle(W * 0.5, H * 0.2, W * 0.07, p[2]!) + rect(0, H * 0.82, W, 6, p[3]!),

  horizon: (W, H, p) =>
    circle(W / 2, H * 0.58, W * 0.2, p[2]!) + circle(W / 2, H * 0.58, W * 0.13, p[1]!) +
    rect(0, H * 0.58, W, H * 0.42, p[0]!) + [0, 1, 2, 3].map((i) => rect(W * 0.2 + i * 14, H * (0.62 + i * 0.07), W * (0.6 - i * 0.056), 6, p[3]!, 3, `opacity="${0.8 - i * 0.18}"`)).join(''),

  shapes: (W, H, p) =>
    circle(W * 0.36, H * 0.4, W * 0.2, p[1]!) + rect(W * 0.46, H * 0.44, W * 0.3, W * 0.3, p[2]!, 24) +
    path(`M${W * 0.2} ${H * 0.82}L${W * 0.32} ${H * 0.6}L${W * 0.44} ${H * 0.82}Z`, p[4]!) + circle(W * 0.66, H * 0.28, W * 0.06, p[3]!),

  lines: (W, H, p) =>
    Array.from({ length: 9 }, (_, i) => path(`M${W * 0.1} ${H * (0.2 + i * 0.07)}Q${W * 0.5} ${H * (0.1 + i * 0.07 + (i % 2 ? 0.1 : -0.02))} ${W * 0.9} ${H * (0.2 + i * 0.07)}`, 'none', `stroke="${[p[1]!, p[2]!, p[3]!, p[4]!][i % 4]}" stroke-width="${i % 3 ? 4 : 10}" stroke-linecap="round"`)).join('') +
    circle(W * 0.72, H * 0.78, W * 0.07, p[2]!),

  /* ===== NATUREZA ===== */
  leaves: (W, H, p, r) =>
    path(`M${W / 2} ${H * 0.95}C${W * 0.45} ${H * 0.6} ${W * 0.55} ${H * 0.3} ${W / 2} ${H * 0.05}`, 'none', `stroke="${p[1]}" stroke-width="10" stroke-linecap="round"`) +
    Array.from({ length: 9 }, (_, i) => {
      const y = H * (0.88 - i * 0.09), side = i % 2 ? 1 : -1;
      return leaf(W / 2 + (i % 2 ? 4 : -4), y, 150 - i * 6, side * (55 + r() * 15), [p[2]!, p[3]!, p[1]!][i % 3]!);
    }).join('') + leaf(W / 2, H * 0.1, 120, 0, p[3]!),

  wildflowers: (W, H, p, r) =>
    Array.from({ length: 9 }, (_, i) => {
      const x = W * (0.08 + i * 0.105), top = H * (0.25 + r() * 0.25), c = [p[1]!, p[2]!, p[3]!][i % 3]!;
      return path(`M${x} ${H}Q${x + (r() - 0.5) * 80} ${H * 0.65} ${x} ${top}`, 'none', `stroke="${p[4]}" stroke-width="7" stroke-linecap="round"`) +
        leaf(x, H * 0.85, 90, i % 2 ? 40 : -40, p[4]!) +
        Array.from({ length: 5 }, (_, k) => ellipse(x, top - 22, 11, 24, c, `transform="rotate(${k * 72} ${x} ${top})"`)).join('') + circle(x, top, 12, p[2]!);
    }).join(''),

  monstera: (W, H, p) =>
    g(`translate(${W / 2} ${H * 0.52}) rotate(-8)`,
      path('M0 280C-300 160 -300 -180 0 -300C300 -180 300 160 0 280Z', p[1]!) +
      path('M0 280L0 -300', 'none', `stroke="${p[3]}" stroke-width="10"`) +
      [-1, 1].flatMap((s) => [-170, -90, -10, 70, 150].map((y) => path(`M0 ${y}L${s * 250} ${y - 50}`, 'none', `stroke="${p[0]}" stroke-width="30" stroke-linecap="round"`))).join('') +
      [-1, 1].flatMap((s) => [-130, -50, 30, 110].map((y) => circle(s * 90, y, 12, p[0]!))).join('')),

  mushrooms: (W, H, p, r) =>
    [[0.3, 0.62, 1.2], [0.62, 0.7, 0.9], [0.78, 0.5, 0.6], [0.14, 0.78, 0.55]].map(([x, y, s]) =>
      g(`translate(${W * x!} ${H * y!}) scale(${s})`, path('M-34 0L-26 110Q0 125 26 110L34 0Z', p[1]!) + path('M-140 0Q-130 -140 0 -150Q130 -140 140 0Z', p[2]!) +
        [[-70, -70], [20, -105], [75, -45], [-20, -40]].map(([cx, cy]) => circle(cx!, cy!, 15, p[1]!)).join(''))).join('') +
    rect(0, H * 0.9, W, H * 0.1, p[4]!) + Array.from({ length: 12 }, () => circle(r() * W, r() * H, 3, p[3]!, 'opacity=".4"')).join(''),

  /* ===== INFANTIL ===== */
  dino: (W, H, p) =>
    circle(W * 0.8, H * 0.2, 60, p[2]!) + wave(H * 0.86, 20, 120, W, p[4]!, 0) +
    g(`translate(${W / 2} ${H * 0.55})`,
      [-110, -50, 10, 70].map((x, i) => path(`M${x} ${-120 + i * 8}L${x + 30} ${-185 + i * 8}L${x + 60} ${-120 + i * 8}Z`, p[2]!)).join('') +
      path('M-190 120Q-170 -20 -40 -60Q40 -150 150 -80Q230 -30 190 40Q170 70 120 70L110 190L50 190L50 120L-80 120L-90 190L-150 190Z', p[1]!) +
      path('M-190 120Q-260 120 -270 60Q-230 90 -190 70Z', p[1]!) + circle(130, -35, 14, p[4]!) + circle(133, -35, 6, p[3]!) +
      path('M100 20Q140 50 180 20', 'none', `stroke="${p[3]}" stroke-width="8" stroke-linecap="round"`) + circle(-40, 40, 10, p[2]!, 'opacity=".6"') + circle(20, 70, 14, p[2]!, 'opacity=".6"')),

  rocket: (W, H, p, r) =>
    stars(W, H, r, p[2]!, 16) + circle(W * 0.78, H * 0.18, 56, p[4]!, 'opacity=".9"') +
    g(`translate(${W / 2} ${H * 0.5}) rotate(15)`,
      path('M0 -230C80 -150 90 -40 70 90L-70 90C-90 -40 -80 -150 0 -230Z', p[4]!) + path('M-70 30L-130 120L-70 90Z', p[3]!) + path('M70 30L130 120L70 90Z', p[3]!) +
      circle(0, -60, 34, p[1]!) + circle(0, -60, 22, p[0]!) + path('M-40 110Q0 260 40 110Z', p[2]!)) +
    ellipse(W * 0.2, H * 0.78, 90, 36, p[4]!) + ellipse(W * 0.34, H * 0.84, 70, 30, p[4]!),

  rainbow: (W, H, p) =>
    ['#C8421C', '#F2B33D', '#2E9C86', '#8B7CF6', '#F5A9A0'].map((c, i) => path(`M${W * (0.1 + i * 0.04)} ${H * 0.78}A${W * (0.4 - i * 0.04)} ${W * (0.4 - i * 0.04)} 0 0 1 ${W * (0.9 - i * 0.04)} ${H * 0.78}`, 'none', `stroke="${c}" stroke-width="${W * 0.04}"`)).join('') +
    [[0.16, 0.8], [0.84, 0.8]].map(([x, y]) => circle(W * x! - 30, H * y!, 40, p[0] === '#FFF1C2' ? '#FFFFFF' : p[4]!) + circle(W * x!, H * y! - 20, 52, '#FFFFFF') + circle(W * x! + 40, H * y!, 38, '#FFFFFF')).join('') + star(W * 0.5, H * 0.2, 26, p[2]!),

  critters: (W, H, p) =>
    [[0.28, 0.3, p[1]!, 'bear'], [0.7, 0.3, p[2]!, 'cat'], [0.28, 0.72, p[3]!, 'bunny'], [0.7, 0.72, p[4]!, 'owl']].map(([x, y, c, k]) =>
      g(`translate(${W * (x as number)} ${H * (y as number)})`,
        (k === 'bunny' ? ellipse(-30, -100, 18, 55, c as string) + ellipse(30, -100, 18, 55, c as string) : k === 'cat' ? path('M-70 -40L-60 -110L-15 -70ZM70 -40L60 -110L15 -70Z', c as string) : circle(-62, -60, 28, c as string) + circle(62, -60, 28, c as string)) +
        circle(0, 0, 90, c as string) + circle(-30, -10, 10, '#241C3D') + circle(30, -10, 10, '#241C3D') + path('M-12 22Q0 34 12 22', 'none', 'stroke="#241C3D" stroke-width="6" stroke-linecap="round"') + circle(-52, 18, 12, '#F5A9A0', 'opacity=".7"') + circle(52, 18, 12, '#F5A9A0', 'opacity=".7"'))).join(''),

  /* ===== VIAGENS ===== */
  skyline: (W, H, p, r) =>
    stars(W, H, r, p[4]!, 14, 0.4) + circle(W * 0.8, H * 0.2, 46, p[1]!) +
    Array.from({ length: 11 }, (_, i) => {
      const bw = W / 10, bh = H * (0.25 + r() * 0.35), x = i * (W / 11), c = [p[2]!, '#2B3A66', '#33477F'][i % 3]!;
      const wins = Array.from({ length: 12 }, (_, k) => (r() > 0.45 ? rect(x + 10 + (k % 3) * 16, H - bh + 14 + Math.floor(k / 3) * 26, 9, 14, p[1]!, 2) : '')).join('');
      return rect(x, H - bh, bw, bh, c) + wins;
    }).join(''),

  worldmap: (W, H, p, r) =>
    circle(W / 2, H / 2, H * 0.42, p[1]!, 'opacity=".12"') +
    [[0.33, 0.4, 0.14, 0.17], [0.5, 0.36, 0.1, 0.13], [0.52, 0.62, 0.09, 0.13], [0.68, 0.44, 0.13, 0.14], [0.78, 0.7, 0.06, 0.05], [0.25, 0.63, 0.06, 0.12]].map(([x, y, rx, ry], i) =>
      path(`M${W * (x! - rx!)} ${H * y!}Q${W * x!} ${H * (y! - ry! * 1.3)} ${W * (x! + rx!)} ${H * (y! - ry! * 0.2)}Q${W * (x! + rx! * 0.8)} ${H * (y! + ry!)} ${W * x!} ${H * (y! + ry! * 1.1)}Q${W * (x! - rx! * 0.9)} ${H * (y! + ry! * 0.5)} ${W * (x! - rx!)} ${H * y!}Z`, [p[2]!, p[1]!, p[2]!][i % 3]!)).join('') +
    path(`M${W * 0.28} ${H * 0.66}Q${W * 0.45} ${H * 0.15} ${W * 0.72} ${H * 0.4}`, 'none', `stroke="${p[4]}" stroke-width="6" stroke-dasharray="4 16" stroke-linecap="round"`) +
    [[0.28, 0.66], [0.72, 0.4]].map(([x, y]) => circle(W * x!, H * y!, 14, p[4]!) + circle(W * x!, H * y!, 5, p[0]!)).join('') +
    stars(W, H, r, p[3]!, 6),

  tram: (W, H, p) =>
    rect(0, H * 0.78, W, H * 0.22, p[2]!, 0, 'opacity=".9"') + line(0, H * 0.7, W, H * 0.7, p[4]!, 4) +
    g(`translate(${W / 2} ${H * 0.52})`,
      rect(-190, -130, 380, 250, p[1]!, 40) + rect(-190, 20, 380, 24, p[3]!) + rect(-160, -100, 90, 90, p[0]!, 14) + rect(-45, -100, 90, 90, p[0]!, 14) + rect(70, -100, 90, 90, p[0]!, 14) +
      circle(-110, 130, 28, p[4]!) + circle(110, 130, 28, p[4]!) + line(0, -130, 0, -200, p[4]!, 8) + line(-60, -200, 60, -200, p[4]!, 6)),

  stamps: (W, H, p, r) =>
    [[0.28, 0.28, -8], [0.7, 0.3, 6], [0.3, 0.7, 5], [0.7, 0.7, -5]].map(([x, y, a], i) =>
      g(`translate(${W * x!} ${H * y!}) rotate(${a})`,
        rect(-110, -110, 220, 220, 'none', 20, `stroke="${[p[1]!, p[2]!, p[3]!, p[4]!][i]}" stroke-width="8" stroke-dasharray="14 8"`) +
        circle(0, 0, 66, 'none', `stroke="${[p[1]!, p[2]!, p[3]!, p[4]!][i]}" stroke-width="8"`) + star(0, 0, 40, [p[1]!, p[2]!, p[3]!, p[4]!][i]!) +
        text(0, 100, ['ROMA', 'RIO', 'KYOTO', 'LIMA'][i]!, 26, [p[1]!, p[2]!, p[3]!, p[4]!][i]!, 'text-anchor="middle"'))).join('') + stars(W, H, r, p[4]!, 0),

  /* ===== FRASES ===== */
  'type-start': (W, H, p) =>
    circle(W / 2, H * 0.85, W * 0.5, p[2]!, 'opacity=".35"') + text(W / 2, H * 0.3, 'comece', 120, p[1]!, 'text-anchor="middle" font-style="italic"') +
    text(W / 2, H * 0.47, 'agora.', 150, p[3]!, 'text-anchor="middle"') + line(W * 0.2, H * 0.55, W * 0.8, H * 0.55, p[1]!, 6) +
    text(W / 2, H * 0.64, 'um passo por vez', 44, p[1]!, 'text-anchor="middle" font-weight="400"'),

  'type-morning': (W, H, p) =>
    circle(W * 0.5, H * 0.95, H * 0.5, p[2]!) + Array.from({ length: 11 }, (_, i) => line(W / 2 + Math.cos(Math.PI + (i * Math.PI) / 10) * H * 0.55, H * 0.95 + Math.sin(Math.PI + (i * Math.PI) / 10) * H * 0.55, W / 2 + Math.cos(Math.PI + (i * Math.PI) / 10) * H * 0.68, H * 0.95 + Math.sin(Math.PI + (i * Math.PI) / 10) * H * 0.68, p[2]!, 12)).join('') +
    text(W / 2, H * 0.34, 'bom dia,', 110, p[3]!, 'text-anchor="middle" font-style="italic"') + text(W / 2, H * 0.55, 'sol.', 130, p[1]!, 'text-anchor="middle"'),

  'type-slow': (W, H, p) =>
    ellipse(W * 0.5, H * 0.74, W * 0.34, H * 0.1, p[4]!, 'opacity=".7"') +
    g(`translate(${W / 2} ${H * 0.62})`, ellipse(0, 0, 120, 80, p[1]!) + circle(120, -20, 40, p[1]!) + path('M-90 -10Q-40 -90 40 -50', 'none', `stroke="${p[0]}" stroke-width="8" stroke-linecap="round"`) + line(135, -50, 150, -85, p[1]!, 6) + circle(122, -22, 6, p[3]!)) +
    text(W / 2, H * 0.2, 'sem', 90, p[3]!, 'text-anchor="middle" font-style="italic"') + text(W / 2, H * 0.34, 'pressa.', 110, p[3]!, 'text-anchor="middle"'),

  'type-coffee': (W, H, p) =>
    text(W / 2, H * 0.24, 'café', 150, p[1]!, 'text-anchor="middle"') + text(W / 2, H * 0.37, 'primeiro.', 90, p[2]!, 'text-anchor="middle" font-style="italic"') +
    g(`translate(${W / 2} ${H * 0.66})`, path('M-120 -60L120 -60L100 110Q0 140 -100 110Z', p[2]!) + path('M120 -30Q190 -30 180 30Q170 80 110 70', 'none', `stroke="${p[2]}" stroke-width="22"`) +
      path('M-40 -90Q-20 -130 -40 -170M20 -90Q40 -130 20 -170', 'none', `stroke="${p[3]}" stroke-width="10" stroke-linecap="round"`) + ellipse(0, -60, 120, 22, p[1]!)),

  /* ===== MÚSICA E ABSTRATA ===== */
  waves: (W, H, p, r) =>
    [0, 1, 2, 3, 4].map((i) => wave(H * (0.3 + i * 0.13), 40 + i * 6, 150 - i * 12, W, [p[1]!, p[2]!, p[3]!, p[4]!, p[1]!][i]!, i * 25)).join('') + stars(W, H, r, p[3]!, 5, 0.25),

  vinyl: (W, H, p) =>
    g(`translate(${W * 0.45} ${H * 0.5})`, circle(0, 0, W * 0.38, p[1]!) + [0.32, 0.26, 0.2].map((k) => circle(0, 0, W * k, 'none', `stroke="${p[0]}" stroke-width="2" opacity=".35"`)).join('') + circle(0, 0, W * 0.13, p[2]!) + circle(0, 0, 12, p[0]!) + path(`M${-W * 0.3} ${-W * 0.1}A${W * 0.32} ${W * 0.32} 0 0 1 ${-W * 0.1} ${-W * 0.3}`, 'none', `stroke="${p[4]}" stroke-width="10" opacity=".25" stroke-linecap="round"`)) +
    g(`translate(${W * 0.88} ${H * 0.12}) rotate(25)`, circle(0, 0, 28, p[3]!) + rect(-7, 0, 14, 300, p[3]!, 7) + rect(-18, 290, 36, 56, p[2]!, 8)),

  aurora: (W, H, p) =>
    [[0.3, 0.3, 0.5, p[1]!], [0.7, 0.45, 0.45, p[2]!], [0.4, 0.7, 0.5, p[3]!], [0.75, 0.82, 0.35, p[4]!]].map(([x, y, s, c], i) => ellipse(W * (x as number), H * (y as number), W * (s as number) * 0.6, W * (s as number) * 0.45, c as string, `opacity=".${7 - i}" transform="rotate(${i * 25 - 20} ${W * (x as number)} ${H * (y as number)})"`)).join('') +
    circle(W * 0.5, H * 0.52, W * 0.18, p[0]!, 'opacity=".85"'),

  rhythm: (W, H, p) => {
    const cols = [p[1]!, p[2]!, p[3]!, p[4]!];
    return Array.from({ length: 6 }, (_, i) => Array.from({ length: 6 }, (_, j) => {
      const k = (i * 7 + j * 3) % 4, x = 40 + j * 105, y = 40 + i * 105;
      return k === 0 ? circle(x + 45, y + 45, 42, cols[(i + j) % 4]!) : k === 1 ? rect(x, y, 90, 90, cols[(i + j) % 4]!, 14) : k === 2 ? path(`M${x} ${y + 90}A90 90 0 0 1 ${x + 90} ${y}L${x + 90} ${y + 90}Z`, cols[(i + j) % 4]!) : path(`M${x + 45} ${y}L${x + 90} ${y + 90}L${x} ${y + 90}Z`, cols[(i + j) % 4]!);
    }).join('')).join('');
  },
};
