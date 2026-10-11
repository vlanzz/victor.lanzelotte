import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import type { Currency } from '@/domain/types';
import { persistOptions } from './persist';

const schema = z.object({ currency: z.enum(['BRL', 'USD']).nullable() });

interface PreferencesState {
  /** null = ainda não escolhida: usa o padrão do idioma (PT→BRL, EN→USD). */
  currency: Currency | null;
  setCurrency: (c: Currency) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({ currency: null, setCurrency: (currency) => set({ currency }) }),
    persistOptions<PreferencesState, z.infer<typeof schema>>('prefs', schema, (s) => ({ currency: s.currency })),
  ),
);
