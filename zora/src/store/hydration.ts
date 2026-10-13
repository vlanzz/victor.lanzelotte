import { create } from 'zustand';

/** Vira true quando os stores persistidos terminaram de ler o localStorage (evita "pisca" de contagens). */
export const useHydration = create<{ done: boolean }>()(() => ({ done: false }));
