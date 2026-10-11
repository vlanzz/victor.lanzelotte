import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Detecta o idioma do navegador (Accept-Language) e redireciona "/" para /pt ou /en.
export default createMiddleware(routing);

export const config = { matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'] };
