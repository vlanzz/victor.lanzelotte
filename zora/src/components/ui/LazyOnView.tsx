'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Só monta o conteúdo quando a área está perto de aparecer na tela. Usado para blocos pesados
 * abaixo da dobra (a biblioteca de formulários não entra no carregamento inicial da home).
 */
export function LazyOnView({ children, minHeight = 300 }: { children: React.ReactNode; minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    if (typeof IntersectionObserver === 'undefined') { const id = setTimeout(() => setShow(true), 0); return () => clearTimeout(id); }
    const io = new IntersectionObserver((e) => e.some((x) => x.isIntersecting) && setShow(true), { rootMargin: '600px' });
    io.observe(el);
    return () => io.disconnect();
  }, [show]);
  return <div ref={ref} style={show ? undefined : { minHeight }}>{show ? children : null}</div>;
}
