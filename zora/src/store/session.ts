import { create } from 'zustand';
import { auth } from '@/services';
import type { Customer } from '@/domain/types';

interface SessionState {
  customer: Customer | null;
  loaded: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

/** A sessão vive no serviço de auth (mock: localStorage); este store só guarda o cliente atual em memória. */
export const useSession = create<SessionState>()((set) => ({
  customer: null,
  loaded: false,
  refresh: async () => set({ customer: await auth.getSession(), loaded: true }),
  logout: async () => {
    await auth.logout();
    set({ customer: null });
  },
}));
