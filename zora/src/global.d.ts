import type messages from './messages/pt';

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof messages;
    Locale: 'pt' | 'en';
  }
}
