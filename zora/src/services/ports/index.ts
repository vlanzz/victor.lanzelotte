/**
 * PORTAS (interfaces) da camada de serviços. A interface do site só conhece estas interfaces.
 * Hoje há implementações "mock" (services/mock). Para integrar algo real, implemente a interface
 * e troque a linha correspondente em services/index.ts.
 */
import type { ShippingMethod } from '@/config/shipping';
import type { CatalogSnapshot } from '@/domain/catalog';
import type {
  Address, Art, CatalogItem, Coupon, Currency, Customer, Order, OrderStatus, Product, Review,
} from '@/domain/types';

export interface CatalogRepo {
  getSnapshot(): Promise<CatalogSnapshot>;
  saveProduct(p: Product): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  saveArt(a: Art): Promise<void>;
  deleteArt(id: string): Promise<void>;
  saveItem(i: CatalogItem): Promise<void>;
  deleteItem(id: string): Promise<void>;
  saveReview(r: Review): Promise<void>;
  getCoupons(): Promise<Coupon[]>;
  saveCoupon(c: Coupon): Promise<void>;
  deleteCoupon(code: string): Promise<void>;
  /** Volta tudo para os dados de demonstração. */
  reset(): Promise<void>;
}

export type NewOrder = Omit<Order, 'id' | 'number' | 'createdAt' | 'status' | 'history'>;

export interface OrderRepo {
  list(): Promise<Order[]>;
  listByCustomer(customerId: string): Promise<Order[]>;
  get(id: string): Promise<Order | null>;
  create(order: NewOrder): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
}

export type AuthResult = { ok: true; customer: Customer } | { ok: false; error: 'invalid_credentials' | 'email_taken' };

export interface AuthService {
  getSession(): Promise<Customer | null>;
  login(email: string, password: string): Promise<AuthResult>;
  register(input: { name: string; email: string; password: string }): Promise<AuthResult>;
  logout(): Promise<void>;
  /** Telas de recuperação de senha são simuladas: não envia e-mail. */
  requestPasswordReset(email: string): Promise<void>;
  updateProfile(patch: { name?: string; email?: string }): Promise<Customer | null>;
  saveAddress(address: Address): Promise<Customer | null>;
  deleteAddress(id: string): Promise<Customer | null>;
  listCustomers(): Promise<Customer[]>;
}

export interface PaymentRequest {
  amount: number;
  currency: Currency;
  method: 'card' | 'pix';
  email: string;
}
export type PaymentResult =
  | { ok: true; reference: string; pixCode?: string }
  | { ok: false; error: 'card_declined' | 'unknown' };

/** Futuro: Stripe (PaymentIntent + Pix). Hoje não cobra nada. */
export interface PaymentGateway {
  pay(req: PaymentRequest): Promise<PaymentResult>;
}

export interface ShippingQuote {
  method: ShippingMethod;
  price: number;
  days: [number, number];
}
/** Futuro: cotação real (fornecedor POD / transportadora), com impostos de importação. */
export interface ShippingQuoter {
  quote(input: { currency: Currency; subtotal: number; country: string }): Promise<ShippingQuote[]>;
}

/** Futuro: Printful / Printify / Gelato. */
export interface PodProvider {
  submitOrder(order: Order): Promise<{ externalId: string }>;
  getStatus(externalId: string): Promise<OrderStatus>;
}
