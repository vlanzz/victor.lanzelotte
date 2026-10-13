import { z } from 'zod';
import { customers as seedCustomers } from '@/data/customers';
import type { Address, Customer } from '@/domain/types';
import type { AuthService } from '../ports';
import { applyOverlay, loadOverlay, saveOverlay, upsertInOverlay } from './overlay';
import { readStored, removeStored, storageKeys, writeStored } from './storage';

const id = (c: Customer) => c.id;
const all = () => applyOverlay(seedCustomers, loadOverlay<Customer>('customers'), id);
const save = (c: Customer) => saveOverlay('customers', upsertInOverlay(loadOverlay<Customer>('customers'), c, id));
const sessionSchema = z.string().nullable();
const sessionId = () => readStored(storageKeys.session, sessionSchema, null);

async function update(fn: (c: Customer) => Customer): Promise<Customer | null> {
  const me = all().find((c) => c.id === sessionId());
  if (!me) return null;
  const next = fn(me);
  save(next);
  return next;
}

export const mockAuth: AuthService = {
  async getSession() { return all().find((c) => c.id === sessionId()) ?? null; },
  async login(email, password) {
    const c = all().find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password);
    if (!c) return { ok: false, error: 'invalid_credentials' };
    writeStored(storageKeys.session, c.id);
    return { ok: true, customer: c };
  },
  async register({ name, email, password }) {
    if (all().some((x) => x.email.toLowerCase() === email.trim().toLowerCase())) return { ok: false, error: 'email_taken' };
    const c: Customer = {
      id: `cus-${Date.now().toString(36)}`, name, email: email.trim(), password, role: 'customer',
      addresses: [], createdAt: new Date().toISOString(),
    };
    save(c);
    writeStored(storageKeys.session, c.id);
    return { ok: true, customer: c };
  },
  async logout() { removeStored(storageKeys.session); },
  async requestPasswordReset() { /* simulado: nenhum e-mail é enviado */ },
  updateProfile: (patch) => update((c) => ({ ...c, ...patch })),
  saveAddress: (a: Address) => update((c) => ({
    ...c, addresses: c.addresses.some((x) => x.id === a.id) ? c.addresses.map((x) => (x.id === a.id ? a : x)) : [...c.addresses, a],
  })),
  deleteAddress: (aid) => update((c) => ({ ...c, addresses: c.addresses.filter((x) => x.id !== aid) })),
  async listCustomers() { return all(); },
};
