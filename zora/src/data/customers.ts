import type { Address, Customer } from '@/domain/types';

const addr = (id: string, name: string, line1: string, city: string, state: string, postalCode: string, country = 'BR'): Address => ({
  id, label: 'Casa', name, line1, city, state, postalCode, country,
});

export const DEMO_CUSTOMER_ID = 'cus-ana';
export const DEMO_ADMIN_ID = 'cus-admin';

export const customers: Customer[] = [
  { id: DEMO_CUSTOMER_ID, name: 'Ana Souza', email: 'ana@zora.demo', password: 'demo1234', role: 'customer', createdAt: '2026-02-10T12:00:00Z',
    addresses: [addr('adr-ana-1', 'Ana Souza', 'Rua das Acácias, 120', 'São Paulo', 'SP', '01310-100')] },
  { id: DEMO_ADMIN_ID, name: 'Equipe Zora', email: 'admin@zora.demo', password: 'admin1234', role: 'admin', createdAt: '2026-01-02T12:00:00Z', addresses: [] },
  { id: 'cus-bruno', name: 'Bruno Martins', email: 'bruno@exemplo.com', password: 'demo1234', role: 'customer', createdAt: '2026-03-05T12:00:00Z',
    addresses: [addr('adr-bruno-1', 'Bruno Martins', 'Av. Atlântica, 800', 'Rio de Janeiro', 'RJ', '22010-000')] },
  { id: 'cus-carla', name: 'Carla Silva', email: 'carla@exemplo.com', password: 'demo1234', role: 'customer', createdAt: '2026-04-18T12:00:00Z',
    addresses: [addr('adr-carla-1', 'Carla Silva', 'Rua da Bahia, 45', 'Belo Horizonte', 'MG', '30160-011')] },
  { id: 'cus-emma', name: 'Emma Johnson', email: 'emma@example.com', password: 'demo1234', role: 'customer', createdAt: '2026-05-22T12:00:00Z',
    addresses: [addr('adr-emma-1', 'Emma Johnson', '221 Maple Street', 'Portland', 'OR', '97201', 'US')] },
  { id: 'cus-lucas', name: 'Lucas Pereira', email: 'lucas@exemplo.com', password: 'demo1234', role: 'customer', createdAt: '2026-06-30T12:00:00Z',
    addresses: [addr('adr-lucas-1', 'Lucas Pereira', 'Rua XV de Novembro, 300', 'Curitiba', 'PR', '80020-310')] },
  { id: 'cus-sofia', name: 'Sofia García', email: 'sofia@example.com', password: 'demo1234', role: 'customer', createdAt: '2026-07-14T12:00:00Z',
    addresses: [addr('adr-sofia-1', 'Sofia García', 'Calle Mayor 12', 'Madrid', 'MD', '28013', 'ES')] },
];
