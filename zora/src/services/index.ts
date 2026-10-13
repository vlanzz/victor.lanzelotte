/**
 * ÚNICO ponto onde se escolhe a implementação de cada serviço.
 * Para usar um serviço real (Stripe, banco, fornecedor POD), implemente a interface em
 * services/ports e troque a linha correspondente abaixo.
 */
import { mockAuth } from './mock/auth';
import { mockCatalogRepo } from './mock/catalog';
import { mockOrderRepo } from './mock/orders';
import { mockPayment, mockPod, mockShipping } from './mock/payment';
import type { AuthService, CatalogRepo, OrderRepo, PaymentGateway, PodProvider, ShippingQuoter } from './ports';

export const catalogRepo: CatalogRepo = mockCatalogRepo;
export const orderRepo: OrderRepo = mockOrderRepo;
export const auth: AuthService = mockAuth;
export const payments: PaymentGateway = mockPayment;
export const shipping: ShippingQuoter = mockShipping;
export const pod: PodProvider = mockPod;
