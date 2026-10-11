// Valida o contraste WCAG AA dos pares de cores usados no site. Rode: npm run contrast
const c = {
  paper: '#FBF6EE', paper2: '#F4ECDD', white: '#FFFFFF', ink: '#241C3D', inkSoft: '#5A5270',
  sun: '#C8421C', sunDark: '#A73414', honey: '#F2B33D', lavender: '#8B7CF6', lavenderText: '#5B49D6',
  mint: '#2E9C86', mintText: '#1B6F5F', error: '#B42318', success: '#1B6F5F', warning: '#8A5A00',
};

function lum(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x! + 0.05) / (y! + 0.05);
};

// [texto, fundo, mínimo]
const pairs: [keyof typeof c, keyof typeof c, number][] = [
  ['ink', 'paper', 4.5], ['ink', 'paper2', 4.5], ['inkSoft', 'paper', 4.5], ['inkSoft', 'paper2', 4.5],
  ['white', 'sun', 4.5], ['white', 'sunDark', 4.5], ['sun', 'paper', 4.5], ['ink', 'honey', 4.5],
  ['lavenderText', 'paper', 4.5], ['mintText', 'paper', 4.5], ['white', 'ink', 4.5],
  ['error', 'paper', 4.5], ['success', 'paper', 4.5], ['warning', 'paper', 4.5],
  ['lavender', 'paper', 3], ['mint', 'paper', 3], // só decorativo / componentes gráficos (3:1)
];

let fail = 0;
for (const [fg, bg, min] of pairs) {
  const r = ratio(c[fg], c[bg]);
  const ok = r >= min;
  if (!ok) fail++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${fg} on ${bg}: ${r.toFixed(2)} (min ${min})`);
}
process.exit(fail ? 1 : 0);
