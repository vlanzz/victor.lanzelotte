export type Locale = 'pt' | 'en';
export type Currency = 'BRL' | 'USD';
/** Texto nos dois idiomas. */
export type L10n = Record<Locale, string>;
/** Valor em centavos (inteiro) — nunca usamos float para dinheiro. */
export type Cents = number;

export type CategoryId = 'home' | 'stationery' | 'apparel' | 'tech' | 'pets' | 'other';

export interface Category {
  id: CategoryId;
  name: L10n;
  blurb: L10n;
  /** Cor-tema da categoria (hex). */
  color: string;
}

export interface Niche {
  id: string;
  slug: string;
  name: L10n;
  blurb: L10n;
  /** Cor de fundo/tema da coleção (hex). */
  color: string;
  /** Cor do texto sobre `color`. */
  onColor: string;
}

/** Como o mockup é desenhado — ver components/domain/mockup. */
export type MockupKind =
  | 'wall-art' | 'canvas' | 'wood-frame' | 'fridge-board' | 'calendar'
  | 'mug' | 'bottle' | 'plate' | 'coaster' | 'tile' | 'puzzle'
  | 'pillow' | 'blanket' | 'curtain' | 'rug' | 'flag'
  | 'notebook' | 'stickers' | 'card' | 'mousepad' | 'deskmat' | 'laptop-skin' | 'phone-case'
  | 'tshirt' | 'tote' | 'cap' | 'socks' | 'pouch'
  | 'bandana' | 'pet-bowl' | 'pet-bed';

export type OptionKind = 'color' | 'size' | 'material' | 'frame';

export interface OptionValue {
  id: string;
  label: L10n;
  /** Cor (hex) — cor do produto ou da moldura. */
  swatch?: string;
  /** Dimensões em cm — para tamanhos. */
  dims?: { w: number; h: number };
  deltaBRL: Cents;
  /** Se ausente, é convertido do BRL pela taxa fixa. */
  deltaUSD?: Cents;
}

export interface OptionAxis {
  id: string;
  kind: OptionKind;
  label: L10n;
  values: OptionValue[];
}

export type Selection = Record<string, string>;

export interface PrintArea {
  /** largura / altura da área de impressão padrão. */
  aspect: number;
  /** margem de segurança (fração 0–0.2) onde a arte não deve ter elementos importantes. */
  safeMargin: number;
  fit: 'cover' | 'contain' | 'pattern';
}

export interface ProductType {
  id: string;
  slug: string;
  categoryId: CategoryId;
  name: L10n;
  mockupKind: MockupKind;
  printArea: PrintArea;
  /** Orientações de arte que ficam bem neste produto. */
  orientations: Orientation[];
}

export interface Product {
  id: string;
  slug: string;
  typeId: string;
  name: L10n;
  description: L10n;
  specs: { label: L10n; value: L10n }[];
  production: L10n;
  shipping: L10n;
  priceBRL: Cents;
  priceUSD?: Cents;
  options: OptionAxis[];
  defaultSelection: Selection;
  tags: string[];
  status: 'active' | 'draft';
}

export type Orientation = 'portrait' | 'landscape' | 'square';

export interface Art {
  id: string;
  slug: string;
  title: L10n;
  nicheIds: string[];
  /** Caminho público do arquivo, ex.: /art/pets/raposa.svg */
  file: string;
  palette: string[];
  orientation: Orientation;
  /** Se preenchido, só estes tipos de produto; senão vale a regra por orientação. */
  compatibleTypeIds?: string[];
  /** Tema visual usado pelo gerador de placeholders. */
  motif?: string;
  status: 'active' | 'draft';
}

/** Arte × Produto: o que o cliente compra. */
export interface CatalogItem {
  id: string;
  slug: string;
  artId: string;
  productId: string;
  featured?: boolean;
  isNew?: boolean;
  createdAt: string;
  status: 'active' | 'draft';
}

export interface Review {
  id: string;
  catalogItemId: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: L10n;
  body: L10n;
  createdAt: string;
  status: 'published' | 'pending' | 'hidden';
}

export type CouponType = 'percent' | 'fixed' | 'freeShipping';

export interface Coupon {
  code: string;
  type: CouponType;
  /** percent: 1–100 · fixed: centavos na moeda do cupom. */
  value: number;
  currency?: Currency;
  description: L10n;
  minSubtotal?: Cents;
  expiresAt?: string;
  maxUses?: number;
  uses: number;
  active: boolean;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  /** Apenas para o login fictício. */
  password: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  createdAt: string;
}

export type OrderStatus = 'pending' | 'paid' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderLine {
  catalogItemId: string;
  /** Snapshot para o pedido não mudar se o catálogo mudar. */
  name: L10n;
  artFile: string;
  optionsLabel: L10n;
  selection: Selection;
  qty: number;
  unitPrice: Cents;
}

export interface Order {
  id: string;
  number: string;
  customerId: string | null;
  email: string;
  createdAt: string;
  currency: Currency;
  locale: Locale;
  lines: OrderLine[];
  subtotal: Cents;
  discount: Cents;
  shipping: Cents;
  total: Cents;
  couponCode?: string;
  address: Address;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'pix';
  status: OrderStatus;
  history: { status: OrderStatus; at: string }[];
}

export interface CartLine {
  id: string;
  catalogItemId: string;
  selection: Selection;
  qty: number;
}
