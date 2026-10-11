'use client';
import dynamic from 'next/dynamic';
import { LazyOnView } from '@/components/ui/LazyOnView';

const Newsletter = dynamic(() => import('./Newsletter').then((m) => m.Newsletter), { ssr: false });

export function LazyNewsletter() {
  return <LazyOnView minHeight={380}><Newsletter /></LazyOnView>;
}
