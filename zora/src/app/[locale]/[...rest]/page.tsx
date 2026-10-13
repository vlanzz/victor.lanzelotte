import { notFound } from 'next/navigation';

/** Captura qualquer rota desconhecida dentro de /pt ou /en e mostra a página 404 desenhada. */
export default function CatchAll() {
  notFound();
}
