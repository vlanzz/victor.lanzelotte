import localFont from 'next/font/local';

/** Fontes locais (via @fontsource, sem requisição externa), pré-carregadas e com fallback ajustado (menos layout shift). */
export const fraunces = localFont({
  src: '../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-soft-normal.woff2',
  variable: '--font-fraunces',
  weight: '100 900',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

export const figtree = localFont({
  src: '../../node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2',
  variable: '--font-figtree',
  weight: '300 900',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});
