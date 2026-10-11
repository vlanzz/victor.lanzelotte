'use client';
import { useEffect, useState } from 'react';

/**
 * Desenha os primeiros itens na hora e o resto em lotes, logo depois. Evita uma tarefa longa
 * que trava a página (importante em celulares) quando cada item é pesado, como os mockups em SVG.
 * Use `key` para recomeçar quando a lista mudar.
 */
export function ProgressiveList<T>({ items, first = 4, step = 4, render }: { items: T[]; first?: number; step?: number; render: (item: T, index: number) => React.ReactNode }) {
  const [count, setCount] = useState(first);
  useEffect(() => {
    if (count >= items.length) return;
    const id = setTimeout(() => setCount((c) => c + step), 16);
    return () => clearTimeout(id);
  }, [count, items.length, step]);
  return <>{items.slice(0, count).map(render)}</>;
}
