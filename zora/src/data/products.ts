import type {
  CategoryId, Cents, L10n, MockupKind, OptionAxis, OptionValue, Orientation, PrintArea, Product, ProductType,
} from '@/domain/types';

/* ---------- Blocos reutilizáveis ---------- */

const COLORS: Record<string, [hex: string, pt: string, en: string]> = {
  white: ['#FFFFFF', 'Branco', 'White'],
  black: ['#1F1F24', 'Preto', 'Black'],
  cream: ['#F3EBDD', 'Creme', 'Cream'],
  navy: ['#26355D', 'Azul-marinho', 'Navy'],
  sage: ['#A9BFA0', 'Verde-sálvia', 'Sage'],
  blush: ['#F1C9C4', 'Rosé', 'Blush'],
  sand: ['#D8C3A5', 'Areia', 'Sand'],
  mustard: ['#E0A93B', 'Mostarda', 'Mustard'],
  oak: ['#C9A276', 'Carvalho', 'Oak'],
  walnut: ['#6B4A33', 'Nogueira', 'Walnut'],
};

/** Eixo de cor. `extra` = acréscimo por cor (centavos BRL). */
const color = (ids: string[], extra: Record<string, number> = {}, kind: 'color' | 'frame' = 'color'): OptionAxis => ({
  id: kind,
  kind,
  label: kind === 'frame' ? { pt: 'Moldura', en: 'Frame' } : { pt: 'Cor', en: 'Color' },
  values: ids.map((id): OptionValue => {
    const [hex, pt, en] = COLORS[id] as [string, string, string];
    return { id, label: { pt, en }, swatch: hex, deltaBRL: extra[id] ?? 0 };
  }),
});

type SizeRow = [id: string, pt: string, en: string, delta: Cents, w?: number, h?: number];
const size = (rows: SizeRow[], label: L10n = { pt: 'Tamanho', en: 'Size' }, id = 'size'): OptionAxis => ({
  id,
  kind: 'size',
  label,
  values: rows.map(([vid, pt, en, delta, w, h]) => ({
    id: vid, label: { pt, en }, deltaBRL: delta, ...(w && h ? { dims: { w, h } } : {}),
  })),
});

const material = (rows: [id: string, pt: string, en: string, delta: Cents][]): OptionAxis => ({
  id: 'material',
  kind: 'material',
  label: { pt: 'Material', en: 'Material' },
  values: rows.map(([id, pt, en, deltaBRL]) => ({ id, label: { pt, en }, deltaBRL })),
});

const frameSizes = (rows: [string, number, number, Cents][]): OptionAxis =>
  size(rows.map(([id, w, h, d]) => [id, `${w} × ${h} cm`, `${w} × ${h} cm`, d, w, h] as SizeRow));

const P = { cover: 'cover', contain: 'contain', pattern: 'pattern' } as const;
const ALL: Orientation[] = ['portrait', 'landscape', 'square'];
const PORT: Orientation[] = ['portrait', 'square'];
const LAND: Orientation[] = ['landscape', 'square'];

interface Row {
  id: string;
  cat: CategoryId;
  kind: MockupKind;
  pt: string;
  en: string;
  aspect: number;
  fit: PrintArea['fit'];
  safe?: number;
  orient: Orientation[];
  price: Cents;
  descPt: string;
  descEn: string;
  matPt: string;
  matEn: string;
  options: OptionAxis[];
  tags: string[];
}

const rows: Row[] = [
  /* ===== Casa ===== */
  { id: 'mug', cat: 'home', kind: 'mug', pt: 'Caneca de cerâmica', en: 'Ceramic mug', aspect: 2.4, fit: P.cover, safe: 0.06, orient: LAND, price: 6990,
    descPt: 'A caneca que faz a primeira xícara do dia parecer um pequeno ritual. Estampa contínua ao redor, com alça e interior coloridos.',
    descEn: 'The mug that turns the first cup of the day into a small ritual. Wrap-around print with a colored handle and inside.',
    matPt: 'Cerâmica de alta resistência', matEn: 'High-strength ceramic',
    options: [color(['white', 'cream', 'black', 'navy', 'sage', 'blush'], { black: 500 }), size([['325', '325 ml', '325 ml', 0], ['450', '450 ml', '450 ml', 1500]])],
    tags: ['caneca', 'mug', 'café', 'coffee', 'cozinha', 'kitchen', 'presente', 'gift'] },
  { id: 'plate', cat: 'home', kind: 'plate', pt: 'Prato decorativo', en: 'Decorative plate', aspect: 1, fit: P.cover, safe: 0.08, orient: ['square'], price: 8990,
    descPt: 'Porcelana branca com a ilustração no centro. Para servir, pendurar na parede ou simplesmente admirar.',
    descEn: 'White porcelain with the illustration at its center. To serve on, hang on a wall, or simply admire.',
    matPt: 'Porcelana', matEn: 'Porcelain',
    options: [size([['20', '20 cm', '20 cm', 0, 20, 20], ['26', '26 cm', '26 cm', 2000, 26, 26]])],
    tags: ['prato', 'plate', 'cozinha', 'kitchen', 'parede', 'wall'] },
  { id: 'pillow', cat: 'home', kind: 'pillow', pt: 'Almofada', en: 'Throw pillow', aspect: 1, fit: P.cover, safe: 0.04, orient: ['square', 'landscape'], price: 12990,
    descPt: 'Capa de tecido macio com a arte na frente e cor lisa atrás. Acompanha enchimento.',
    descEn: 'Soft fabric cover with art on the front and a solid color on the back. Insert included.',
    matPt: 'Poliéster tipo linho', matEn: 'Linen-look polyester',
    options: [color(['white', 'cream', 'sage', 'blush', 'black']), size([['40', '40 × 40 cm', '40 × 40 cm', 0, 40, 40], ['50', '50 × 50 cm', '50 × 50 cm', 2000, 50, 50]])],
    tags: ['almofada', 'pillow', 'cushion', 'sofá', 'sofa', 'sala', 'living room'] },
  { id: 'rug', cat: 'home', kind: 'rug', pt: 'Tapete', en: 'Rug', aspect: 1.5, fit: P.cover, safe: 0.05, orient: ALL, price: 28990,
    descPt: 'Um tapete que vira o centro da sala. Estampa de ponta a ponta e base antiderrapante.',
    descEn: 'A rug that becomes the center of the room. Edge-to-edge print with a non-slip back.',
    matPt: 'Microfibra com base antiderrapante', matEn: 'Microfiber with non-slip backing',
    options: [size([['60x90', '60 × 90 cm', '60 × 90 cm', 0, 60, 90], ['80x120', '80 × 120 cm', '80 × 120 cm', 12000, 80, 120], ['120x180', '120 × 180 cm', '120 × 180 cm', 32000, 120, 180]]), material([['flat', 'Plano', 'Flat', 0], ['plush', 'Felpudo', 'Plush', 3000]])],
    tags: ['tapete', 'rug', 'carpet', 'sala', 'living room', 'quarto', 'bedroom'] },
  { id: 'decor-frame', cat: 'home', kind: 'wall-art', pt: 'Quadro decorativo com moldura', en: 'Framed art print', aspect: 0.75, fit: P.cover, safe: 0.06, orient: ALL, price: 14990,
    descPt: 'Impressão em papel fosco com moldura de madeira pronta para pendurar, com vidro acrílico.',
    descEn: 'Matte paper print with a ready-to-hang wooden frame and acrylic glazing.',
    matPt: 'Papel fosco 250 g/m², moldura de madeira', matEn: '250 gsm matte paper, wooden frame',
    options: [frameSizes([['21x30', 21, 30, 0], ['30x40', 30, 40, 4000], ['50x70', 50, 70, 12000]]), color(['black', 'white', 'oak', 'walnut'], { oak: 1500, walnut: 1500 }, 'frame')],
    tags: ['quadro', 'frame', 'decoração', 'decor', 'parede', 'wall', 'arte', 'art'] },
  { id: 'poster', cat: 'home', kind: 'wall-art', pt: 'Pôster', en: 'Poster', aspect: 0.75, fit: P.cover, safe: 0.05, orient: ALL, price: 6990,
    descPt: 'Pôster com cores vivas e papel de gramatura generosa. Sem moldura, para você escolher a sua.',
    descEn: 'Vivid-color poster on generous-weight paper. Unframed, so you can choose your own.',
    matPt: 'Papel couché 200 g/m²', matEn: '200 gsm coated paper',
    options: [frameSizes([['21x30', 21, 30, 0], ['30x40', 30, 40, 2500], ['50x70', 50, 70, 7000], ['60x90', 60, 90, 11000]]), material([['matte', 'Fosco', 'Matte', 0], ['gloss', 'Brilho', 'Gloss', 500]])],
    tags: ['pôster', 'poster', 'print', 'parede', 'wall', 'arte', 'art'] },
  { id: 'canvas', cat: 'home', kind: 'canvas', pt: 'Canvas', en: 'Canvas', aspect: 0.75, fit: P.cover, safe: 0.04, orient: ALL, price: 15990,
    descPt: 'Tecido canvas esticado em chassi de madeira, com a arte contornando as laterais.',
    descEn: 'Canvas stretched over a wooden frame, with the art wrapping around the edges.',
    matPt: 'Canvas de algodão e poliéster, chassi de pinus', matEn: 'Cotton-poly canvas, pine stretcher bars',
    options: [frameSizes([['30x40', 30, 40, 0], ['40x60', 40, 60, 5000], ['60x90', 60, 90, 14000]])],
    tags: ['canvas', 'tela', 'quadro', 'parede', 'wall', 'arte', 'art'] },
  { id: 'tile', cat: 'home', kind: 'tile', pt: 'Azulejo decorativo', en: 'Decorative tile', aspect: 1, fit: P.cover, safe: 0.06, orient: ['square'], price: 4990,
    descPt: 'Azulejo cerâmico para usar como peça de parede, trivet ou apoio de panela.',
    descEn: 'Ceramic tile to use as a wall piece, trivet or pot stand.',
    matPt: 'Cerâmica com cortiça no verso', matEn: 'Ceramic with cork backing',
    options: [size([['15', '15 × 15 cm', '15 × 15 cm', 0, 15, 15], ['20', '20 × 20 cm', '20 × 20 cm', 1500, 20, 20]])],
    tags: ['azulejo', 'tile', 'parede', 'wall', 'cozinha', 'kitchen'] },
  { id: 'coaster', cat: 'home', kind: 'coaster', pt: 'Porta-copos', en: 'Coaster', aspect: 1, fit: P.cover, safe: 0.06, orient: ['square'], price: 3990,
    descPt: 'Porta-copos redondo que protege a mesa e dá charme à xícara.',
    descEn: 'A round coaster that protects the table and adds charm to your cup.',
    matPt: 'Cortiça ou cerâmica', matEn: 'Cork or ceramic',
    options: [material([['cork', 'Cortiça', 'Cork', 0], ['ceramic', 'Cerâmica', 'Ceramic', 1500]])],
    tags: ['porta-copos', 'coaster', 'mesa', 'table', 'bar'] },
  { id: 'blanket', cat: 'home', kind: 'blanket', pt: 'Manta', en: 'Throw blanket', aspect: 0.75, fit: P.cover, safe: 0.04, orient: ALL, price: 21990,
    descPt: 'Manta macia para sofá e cama, com a ilustração estampada de ponta a ponta.',
    descEn: 'Soft throw for sofa and bed, with the illustration printed edge to edge.',
    matPt: 'Microfibra felpuda', matEn: 'Fleece microfiber',
    options: [size([['100x150', '100 × 150 cm', '100 × 150 cm', 0, 100, 150], ['130x180', '130 × 180 cm', '130 × 180 cm', 9000, 130, 180]])],
    tags: ['manta', 'blanket', 'throw', 'sofá', 'sofa', 'cama', 'bed'] },
  { id: 'shower-curtain', cat: 'home', kind: 'curtain', pt: 'Cortina de box', en: 'Shower curtain', aspect: 1, fit: P.cover, safe: 0.04, orient: ALL, price: 18990,
    descPt: 'Cortina impermeável com ilhós reforçados. Transforma o banheiro num cantinho de galeria.',
    descEn: 'Waterproof curtain with reinforced grommets. Turns the bathroom into a little gallery.',
    matPt: 'Poliéster impermeável', matEn: 'Waterproof polyester',
    options: [size([['180x180', '180 × 180 cm', '180 × 180 cm', 0, 180, 180], ['180x200', '180 × 200 cm', '180 × 200 cm', 1500, 180, 200]])],
    tags: ['cortina', 'curtain', 'banheiro', 'bathroom', 'box'] },

  /* ===== Papelaria ===== */
  { id: 'notebook', cat: 'stationery', kind: 'notebook', pt: 'Caderno', en: 'Notebook', aspect: 0.72, fit: P.cover, safe: 0.05, orient: PORT, price: 5990,
    descPt: 'Capa dura com a arte e miolo de 80 folhas. Espiral dupla para abrir flat.',
    descEn: 'Hardcover with the art and 80 sheets inside. Double spiral binding so it lies flat.',
    matPt: 'Capa dura laminada, papel 90 g/m²', matEn: 'Laminated hardcover, 90 gsm paper',
    options: [size([['a5', 'A5', 'A5', 0, 14.8, 21], ['a4', 'A4', 'A4', 2000, 21, 29.7]]), material([['lined', 'Pautado', 'Lined', 0], ['dotted', 'Pontilhado', 'Dotted', 0], ['blank', 'Liso', 'Blank', 0]])],
    tags: ['caderno', 'notebook', 'papelaria', 'stationery', 'estudo', 'study'] },
  { id: 'diary', cat: 'stationery', kind: 'notebook', pt: 'Agenda', en: 'Diary', aspect: 0.72, fit: P.cover, safe: 0.05, orient: PORT, price: 6990,
    descPt: 'Agenda com visão semanal, páginas de metas e capa dura ilustrada.',
    descEn: 'Weekly-view diary with goals pages and an illustrated hardcover.',
    matPt: 'Capa dura laminada, papel 90 g/m²', matEn: 'Laminated hardcover, 90 gsm paper',
    options: [size([['a5', 'A5', 'A5', 0, 14.8, 21]]), color(['black', 'navy', 'cream'])],
    tags: ['agenda', 'diary', 'organização', 'organization', 'papelaria', 'stationery'] },
  { id: 'planner', cat: 'stationery', kind: 'notebook', pt: 'Planner', en: 'Planner', aspect: 0.72, fit: P.cover, safe: 0.05, orient: PORT, price: 7490,
    descPt: 'Planner mensal e semanal sem data, para começar quando você quiser.',
    descEn: 'Undated monthly and weekly planner, so you can start whenever you like.',
    matPt: 'Capa dura laminada, papel 90 g/m²', matEn: 'Laminated hardcover, 90 gsm paper',
    options: [size([['a5', 'A5', 'A5', 0, 14.8, 21], ['a4', 'A4', 'A4', 2500, 21, 29.7]])],
    tags: ['planner', 'planejamento', 'planning', 'organização', 'organization'] },
  { id: 'stickers', cat: 'stationery', kind: 'stickers', pt: 'Adesivos', en: 'Stickers', aspect: 1, fit: P.contain, safe: 0.1, orient: ['square', 'portrait'], price: 2990,
    descPt: 'Adesivos de vinil com corte no formato da ilustração. Resistentes à água.',
    descEn: 'Die-cut vinyl stickers shaped to the illustration. Water-resistant.',
    matPt: 'Vinil adesivo', matEn: 'Adhesive vinyl',
    options: [size([['5', '5 cm', '5 cm', 0, 5, 5], ['8', '8 cm', '8 cm', 1000, 8, 8]]), material([['vinyl', 'Vinil', 'Vinyl', 0], ['holo', 'Holográfico', 'Holographic', 1500]])],
    tags: ['adesivo', 'sticker', 'papelaria', 'stationery', 'laptop'] },
  { id: 'card', cat: 'stationery', kind: 'card', pt: 'Cartão', en: 'Greeting card', aspect: 0.72, fit: P.cover, safe: 0.06, orient: PORT, price: 1490,
    descPt: 'Cartão com envelope kraft e espaço para a sua mensagem por dentro.',
    descEn: 'Greeting card with a kraft envelope and room for your message inside.',
    matPt: 'Papel 300 g/m², envelope kraft', matEn: '300 gsm paper, kraft envelope',
    options: [size([['10x15', '10 × 15 cm', '10 × 15 cm', 0, 10, 15], ['15x21', '15 × 21 cm', '15 × 21 cm', 500, 15, 21]])],
    tags: ['cartão', 'card', 'presente', 'gift', 'felicitações', 'greeting'] },
  { id: 'calendar', cat: 'stationery', kind: 'calendar', pt: 'Calendário de parede', en: 'Wall calendar', aspect: 0.75, fit: P.cover, safe: 0.05, orient: PORT, price: 4990,
    descPt: 'Calendário com a arte no topo e dias organizados em grade. Furo para pendurar.',
    descEn: 'Calendar with the art on top and days in a tidy grid. Hanging hole included.',
    matPt: 'Papel 170 g/m², espiral metálica', matEn: '170 gsm paper, metal spiral',
    options: [size([['a4', 'A4', 'A4', 0, 21, 29.7], ['a3', 'A3', 'A3', 2500, 29.7, 42]])],
    tags: ['calendário', 'calendar', 'parede', 'wall', 'organização', 'organization'] },
  { id: 'mousepad', cat: 'stationery', kind: 'mousepad', pt: 'Mousepad', en: 'Mouse pad', aspect: 1.15, fit: P.cover, safe: 0.04, orient: ALL, price: 5490,
    descPt: 'Superfície lisa para deslizar o mouse e base de borracha que não escorrega.',
    descEn: 'Smooth surface for gliding and a rubber base that stays put.',
    matPt: 'Tecido com base de borracha', matEn: 'Fabric with rubber base',
    options: [size([['23x20', '23 × 20 cm', '23 × 20 cm', 0, 23, 20], ['30x25', '30 × 25 cm', '30 × 25 cm', 1500, 30, 25]])],
    tags: ['mousepad', 'mouse', 'escritório', 'office', 'computador', 'computer'] },

  /* ===== Vestuário e acessórios ===== */
  { id: 'tshirt', cat: 'apparel', kind: 'tshirt', pt: 'Camiseta', en: 'T-shirt', aspect: 0.85, fit: P.contain, safe: 0.08, orient: ['square', 'portrait'], price: 9990,
    descPt: 'Camiseta de algodão penteado com estampa frontal. Caimento unissex e toque macio.',
    descEn: 'Combed-cotton tee with a front print. Unisex fit and a soft hand-feel.',
    matPt: 'Algodão penteado 30.1', matEn: 'Combed cotton 30/1',
    options: [color(['white', 'black', 'cream', 'navy', 'sage', 'blush', 'mustard']), size([['s', 'P', 'S', 0], ['m', 'M', 'M', 0], ['l', 'G', 'L', 0], ['xl', 'GG', 'XL', 1000]])],
    tags: ['camiseta', 'tshirt', 't-shirt', 'tee', 'roupa', 'clothing', 'vestuário', 'apparel'] },
  { id: 'tote', cat: 'apparel', kind: 'tote', pt: 'Ecobag', en: 'Tote bag', aspect: 1, fit: P.contain, safe: 0.1, orient: ['square', 'portrait'], price: 5990,
    descPt: 'Ecobag de algodão cru, resistente e lavável. Cabe o dia inteiro.',
    descEn: 'Raw-cotton tote that is sturdy and washable. Fits a whole day.',
    matPt: 'Algodão cru 280 g/m²', matEn: '280 gsm raw cotton',
    options: [color(['cream', 'black', 'navy', 'sand'])],
    tags: ['ecobag', 'tote', 'bolsa', 'bag', 'sacola'] },
  { id: 'cap', cat: 'apparel', kind: 'cap', pt: 'Boné', en: 'Cap', aspect: 1.6, fit: P.contain, safe: 0.12, orient: LAND, price: 7990,
    descPt: 'Boné de aba curva com a arte bordada no painel frontal em impressão de alta definição.',
    descEn: 'Curved-brim cap with high-definition print on the front panel.',
    matPt: 'Sarja de algodão, ajuste traseiro', matEn: 'Cotton twill, adjustable strap',
    options: [color(['white', 'black', 'navy', 'sand'])],
    tags: ['boné', 'cap', 'hat', 'acessório', 'accessory'] },
  { id: 'socks', cat: 'apparel', kind: 'socks', pt: 'Meias', en: 'Socks', aspect: 1, fit: P.pattern, orient: ['square'], price: 4990,
    descPt: 'Meias com estampa contínua e ponta/calcanhar em contraste. Confortáveis e divertidas.',
    descEn: 'All-over printed socks with contrast toe and heel. Comfortable and fun.',
    matPt: 'Poliéster e elastano', matEn: 'Polyester and spandex',
    options: [size([['p', '34–38', '34–38 (US 4–7)', 0], ['g', '39–43', '39–43 (US 8–11)', 0]]), color(['white', 'black'])],
    tags: ['meias', 'socks', 'acessório', 'accessory'] },
  { id: 'pouch', cat: 'apparel', kind: 'pouch', pt: 'Necessaire', en: 'Pouch', aspect: 1.5, fit: P.contain, safe: 0.1, orient: LAND, price: 5490,
    descPt: 'Necessaire com zíper para maquiagem, cabos e tudo que anda solto na bolsa.',
    descEn: 'Zippered pouch for makeup, cables and everything rattling around your bag.',
    matPt: 'Lona de algodão com forro impermeável', matEn: 'Cotton canvas with waterproof lining',
    options: [size([['s', 'Pequena', 'Small', 0, 18, 12], ['l', 'Grande', 'Large', 1500, 24, 16]]), color(['cream', 'black'])],
    tags: ['necessaire', 'pouch', 'bolsa', 'bag', 'maquiagem', 'makeup'] },

  /* ===== Tech ===== */
  { id: 'phone-case', cat: 'tech', kind: 'phone-case', pt: 'Capinha de celular', en: 'Phone case', aspect: 0.5, fit: P.cover, safe: 0.03, orient: PORT, price: 7990,
    descPt: 'Capinha com impressão que cobre toda a traseira e bordas elevadas para proteger a tela.',
    descEn: 'Case with full-back print and raised edges to protect the screen.',
    matPt: 'Policarbonato com acabamento fosco', matEn: 'Polycarbonate, matte finish',
    options: [size([['iphone-15', 'iPhone 15', 'iPhone 15', 0], ['iphone-15-pro', 'iPhone 15 Pro', 'iPhone 15 Pro', 0], ['galaxy-s24', 'Galaxy S24', 'Galaxy S24', 0], ['pixel-9', 'Pixel 9', 'Pixel 9', 0]], { pt: 'Modelo', en: 'Model' }, 'model'), material([['slim', 'Slim', 'Slim', 0], ['tough', 'Reforçada', 'Tough', 2000]])],
    tags: ['capinha', 'phone case', 'celular', 'phone', 'smartphone', 'tech'] },
  { id: 'deskmat', cat: 'tech', kind: 'deskmat', pt: 'Deskmat', en: 'Desk mat', aspect: 2.2, fit: P.cover, safe: 0.04, orient: ['landscape'], price: 12990,
    descPt: 'Tapete grande para mesa: acomoda teclado e mouse e deixa o setup com identidade.',
    descEn: 'Large desk mat that fits keyboard and mouse and gives your setup some identity.',
    matPt: 'Tecido com base de borracha, 3 mm', matEn: 'Fabric with rubber base, 3 mm',
    options: [size([['80x30', '80 × 30 cm', '80 × 30 cm', 0, 80, 30], ['90x40', '90 × 40 cm', '90 × 40 cm', 2000, 90, 40], ['120x60', '120 × 60 cm', '120 × 60 cm', 8000, 120, 60]])],
    tags: ['deskmat', 'mesa', 'desk', 'setup', 'gamer', 'escritório', 'office'] },
  { id: 'laptop-skin', cat: 'tech', kind: 'laptop-skin', pt: 'Skin para notebook', en: 'Laptop skin', aspect: 1.45, fit: P.cover, safe: 0.04, orient: LAND, price: 8990,
    descPt: 'Adesivo de vinil que protege a tampa do notebook e sai sem deixar resíduo.',
    descEn: 'Vinyl skin that protects your laptop lid and peels off cleanly.',
    matPt: 'Vinil removível', matEn: 'Removable vinyl',
    options: [size([['13', '13"', '13"', 0, 30, 21], ['15', '15"', '15"', 1000, 35, 24], ['16', '16"', '16"', 1500, 36, 25]])],
    tags: ['skin', 'notebook', 'laptop', 'macbook', 'adesivo', 'sticker', 'tech'] },

  /* ===== Pets ===== */
  { id: 'bandana', cat: 'pets', kind: 'bandana', pt: 'Bandana pet', en: 'Pet bandana', aspect: 1.6, fit: P.pattern, orient: ALL, price: 3990,
    descPt: 'Bandana triangular com fecho de snap: estilo para o seu pet, sem apertar.',
    descEn: 'Triangle bandana with a snap closure: style for your pet without the squeeze.',
    matPt: 'Algodão leve', matEn: 'Lightweight cotton',
    options: [size([['s', 'P', 'S', 0], ['m', 'M', 'M', 500], ['l', 'G', 'L', 1000]]), color(['white', 'cream', 'black'])],
    tags: ['bandana', 'pet', 'cachorro', 'dog', 'gato', 'cat'] },
  { id: 'pet-bowl', cat: 'pets', kind: 'pet-bowl', pt: 'Comedouro pet', en: 'Pet bowl', aspect: 2.8, fit: P.cover, safe: 0.06, orient: LAND, price: 5990,
    descPt: 'Comedouro de cerâmica com base antiderrapante e arte ao redor.',
    descEn: 'Ceramic bowl with a non-slip base and wrap-around art.',
    matPt: 'Cerâmica esmaltada', matEn: 'Glazed ceramic',
    options: [size([['350', '350 ml', '350 ml', 0], ['700', '700 ml', '700 ml', 1500]]), color(['white', 'sage', 'blush'])],
    tags: ['comedouro', 'pet bowl', 'pet', 'cachorro', 'dog', 'gato', 'cat'] },
  { id: 'pet-bed', cat: 'pets', kind: 'pet-bed', pt: 'Caminha pet', en: 'Pet bed', aspect: 1.25, fit: P.cover, safe: 0.05, orient: ALL, price: 17990,
    descPt: 'Caminha acolchoada com capa removível lavável e estampa na parte de cima.',
    descEn: 'Padded bed with a removable washable cover and a printed top.',
    matPt: 'Poliéster com enchimento de fibra siliconada', matEn: 'Polyester with silicone-fiber fill',
    options: [size([['s', '50 × 40 cm', '50 × 40 cm', 0, 50, 40], ['m', '70 × 55 cm', '70 × 55 cm', 8000, 70, 55], ['l', '90 × 70 cm', '90 × 70 cm', 16000, 90, 70]])],
    tags: ['caminha', 'pet bed', 'cama', 'bed', 'pet', 'cachorro', 'dog', 'gato', 'cat'] },

  /* ===== Outros ===== */
  { id: 'bottle', cat: 'other', kind: 'bottle', pt: 'Garrafa térmica', en: 'Insulated bottle', aspect: 1.9, fit: P.cover, safe: 0.06, orient: LAND, price: 11990,
    descPt: 'Garrafa de aço inox com parede dupla: mantém gelado por 24 h e quente por 12 h.',
    descEn: 'Double-wall stainless steel bottle: cold for 24 h, hot for 12 h.',
    matPt: 'Aço inoxidável 304', matEn: '304 stainless steel',
    options: [color(['white', 'black', 'navy', 'sage', 'blush']), size([['350', '350 ml', '350 ml', 0], ['500', '500 ml', '500 ml', 2500]])],
    tags: ['garrafa', 'bottle', 'térmica', 'insulated', 'água', 'water'] },
  { id: 'puzzle', cat: 'other', kind: 'puzzle', pt: 'Quebra-cabeça', en: 'Jigsaw puzzle', aspect: 1.33, fit: P.cover, safe: 0.03, orient: LAND, price: 8990,
    descPt: 'Quebra-cabeça de papelão rígido com caixa ilustrada. Para montar com calma.',
    descEn: 'Rigid-board jigsaw puzzle in an illustrated box. Meant to be assembled slowly.',
    matPt: 'Papelão rígido, acabamento fosco', matEn: 'Rigid board, matte finish',
    options: [size([['120', '120 peças', '120 pieces', 0, 28, 21], ['500', '500 peças', '500 pieces', 3500, 50, 38], ['1000', '1000 peças', '1000 pieces', 7000, 68, 48]])],
    tags: ['quebra-cabeça', 'puzzle', 'jigsaw', 'jogo', 'game'] },
  { id: 'wood-frame', cat: 'other', kind: 'wood-frame', pt: 'Quadro de madeira', en: 'Wood print', aspect: 0.75, fit: P.cover, safe: 0.04, orient: ALL, price: 18990,
    descPt: 'A arte impressa direto sobre painel de madeira natural, com o veio aparecendo.',
    descEn: 'Art printed directly on a natural wood panel with the grain showing through.',
    matPt: 'MDF com acabamento natural', matEn: 'MDF with natural finish',
    options: [frameSizes([['20x30', 20, 30, 0], ['30x40', 30, 40, 4000], ['40x60', 40, 60, 9500]]), color(['oak', 'walnut', 'black'], {}, 'frame')],
    tags: ['quadro', 'madeira', 'wood', 'parede', 'wall', 'rústico', 'rustic'] },
  { id: 'flag', cat: 'other', kind: 'flag', pt: 'Bandeira', en: 'Flag', aspect: 1.5, fit: P.cover, safe: 0.04, orient: LAND, price: 8990,
    descPt: 'Bandeira de poliéster resistente, com ilhós metálicos para pendurar.',
    descEn: 'Durable polyester flag with metal grommets for hanging.',
    matPt: 'Poliéster 110 g/m²', matEn: '110 gsm polyester',
    options: [size([['90x60', '90 × 60 cm', '90 × 60 cm', 0, 90, 60], ['150x90', '150 × 90 cm', '150 × 90 cm', 7500, 150, 90]])],
    tags: ['bandeira', 'flag', 'parede', 'wall', 'decoração', 'decor'] },
  { id: 'fridge-board', cat: 'other', kind: 'fridge-board', pt: 'Quadro magnético de geladeira', en: 'Fridge magnetic board', aspect: 0.75, fit: P.cover, safe: 0.06, orient: PORT, price: 6990,
    descPt: 'Quadro magnético flexível com a arte: recados e lista de compras ficam à vista.',
    descEn: 'Flexible magnetic board with the art: notes and shopping lists stay in sight.',
    matPt: 'Lâmina magnética com superfície escrevível', matEn: 'Magnetic sheet with write-on surface',
    options: [size([['a4', 'A4', 'A4', 0, 21, 29.7], ['a3', 'A3', 'A3', 3000, 29.7, 42]])],
    tags: ['quadro', 'magnético', 'magnetic', 'geladeira', 'fridge', 'recados', 'notes'] },
];

export const productTypes: ProductType[] = rows.map((r) => ({
  id: r.id,
  slug: r.id,
  categoryId: r.cat,
  name: { pt: r.pt, en: r.en },
  mockupKind: r.kind,
  printArea: { aspect: r.aspect, safeMargin: r.safe ?? 0.05, fit: r.fit },
  orientations: r.orient,
}));

const PRODUCTION: L10n = {
  pt: 'Produzido sob demanda por um parceiro de impressão após a confirmação do pedido. Leva de 2 a 5 dias úteis para produzir.',
  en: 'Made on demand by a print partner once your order is confirmed. Production takes 2–5 business days.',
};
const SHIPPING: L10n = {
  pt: 'Envio para todo o Brasil e para o exterior. O prazo de entrega é somado ao de produção e informado no checkout. (Texto de exemplo.)',
  en: 'Ships across Brazil and worldwide. Delivery time is added to production time and shown at checkout. (Sample text.)',
};

export const products: Product[] = rows.map((r) => {
  const defaults = Object.fromEntries(r.options.map((o) => [o.id, o.values[0]?.id ?? '']));
  return {
    id: `prod-${r.id}`,
    slug: r.id,
    typeId: r.id,
    name: { pt: r.pt, en: r.en },
    description: { pt: r.descPt, en: r.descEn },
    specs: [
      { label: { pt: 'Material', en: 'Material' }, value: { pt: r.matPt, en: r.matEn } },
      { label: { pt: 'Impressão', en: 'Printing' }, value: { pt: 'Digital de alta definição, cores vivas', en: 'High-definition digital, vivid colors' } },
      { label: { pt: 'Cuidados', en: 'Care' }, value: { pt: 'Evite produtos abrasivos; siga as instruções da embalagem.', en: 'Avoid abrasive products; follow the package instructions.' } },
    ],
    production: PRODUCTION,
    shipping: SHIPPING,
    priceBRL: r.price,
    options: r.options,
    defaultSelection: defaults,
    tags: r.tags,
    status: 'active',
  } satisfies Product;
});
