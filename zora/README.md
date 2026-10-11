# Zora — protótipo navegável de e-commerce

Zora vende produtos do dia a dia (canecas, pôsteres, cadernos, tapetes, camisetas…) com **ilustrações autorais aplicadas**, sob demanda (print-on-demand). Este projeto é um **protótipo de front-end**: dados fictícios, pagamento simulado, sem servidor, banco de dados ou chaves de API. Serve para validar visual, experiência e fluxos.

- Português (BR) e inglês, reais (BRL) e dólar (USD), com seletor no cabeçalho.
- 34 tipos de produto, 10 coleções temáticas, 40 artes placeholder e ~170 itens de catálogo (arte × produto).
- **Mockup dinâmico** em SVG: a arte aparece no produto e muda na hora com cor, tamanho e moldura.
- Fluxo completo: buscar → filtrar → produto → variar → favoritar → carrinho → cupom → checkout → confirmação → pedido na conta.
- Conta do cliente simulada e **painel administrativo** funcional (tudo que você muda no painel aparece na loja).

---

## 1. Como rodar (passo a passo, sem precisar programar)

1. **Instale o Node.js** (versão LTS, 20 ou mais nova): <https://nodejs.org>. Isso instala também o `npm`.
2. **Abra o terminal** (Mac: app *Terminal*; Windows: *PowerShell*) e entre na pasta do projeto:
   ```bash
   cd caminho/para/zora
   ```
3. **Instale as dependências** (só na primeira vez, leva alguns minutos):
   ```bash
   npm install
   ```
4. **Inicie o projeto:**
   ```bash
   npm run dev
   ```
5. **Abra no navegador:** <http://localhost:3000> (vai para `/pt`; para inglês use `/en`).
6. Para parar, volte ao terminal e aperte `Ctrl + C`.

> Dica: o modo `npm run dev` é feito para desenvolver e é mais lento. Para ver o site na velocidade real (e rodar o Lighthouse): `npm run build` e depois `npm start`.

### Acessos e dados de teste

| O quê | Como |
|---|---|
| Cliente demo | Tela de login → **Entrar como cliente demo** (`ana@zora.demo` / `demo1234`). Tem 3 pedidos e 1 endereço. |
| Admin demo | Tela de login → **Entrar como admin demo** (`admin@zora.demo` / `admin1234`) ou abra `/pt/admin`. |
| Cupons | `BEMVINDO10` (10%), `ZORA20` (R$ 20, pedido mínimo R$ 100, só BRL), `WELCOME5` (US$ 5, mínimo US$ 30, só USD), `FRETEGRATIS`. Para ver mensagens de erro: `NATAL25` (expirado), `ULTIMAS` (esgotado), `PAUSADO` (inativo). |
| Cartão | `4242 4242 4242 4242`, validade futura (ex.: `12/30`) e qualquer CVV. Termina em `0002` = recusado. Pix também está disponível (simulado). |
| Laboratório de mockups | `/pt/lab`: todos os produtos lado a lado, com as variações editáveis (útil para revisar o design). |
| Restaurar dados | No painel admin, menu lateral → **Restaurar dados de demonstração**. |

Tudo que você faz (carrinho, favoritos, pedidos, edições do admin) fica salvo **só no seu navegador** (`localStorage`). Para recomeçar do zero, use o botão acima ou limpe os dados do site no navegador.

---

## 2. Como mudar as coisas

### Idiomas e textos
Os textos da interface ficam em `src/messages/pt/*.json` e `src/messages/en/*.json` (um arquivo por área: `core`, `shop`, `product`, `cart`, `account`, `admin`, `pages`…). Para mudar um texto, edite o mesmo item nos dois idiomas. Há um teste que avisa se uma chave existir em um idioma e faltar no outro.
Textos dos produtos, artes e coleções são bilíngues dentro dos próprios arquivos de dados (`{ pt: "...", en: "..." }`).

### Moeda e taxa de câmbio
- Taxa fixa e fictícia: `src/config/currency.ts` (`BRL_PER_USD`, hoje 5,50).
- Cada produto tem preço em BRL e, opcionalmente, em USD (o campo USD vazio = convertido pela taxa).
- Frete simulado: `src/config/shipping.ts` (valores, prazos e valor mínimo do frete grátis).

### Cupons
- Valores iniciais: `src/data/coupons.ts`.
- Pelo painel: **Admin → Cupons** (criar, editar, pausar, excluir). Tipos: percentual, valor fixo e frete grátis, com valor mínimo, moeda, validade e limite de usos.
- As regras de validação (e as mensagens de erro) estão em `src/domain/coupons.ts`.

### Cores, fontes e identidade
Todos os tokens de design (cores, fontes, raios, sombras) ficam em **um só lugar**: `src/styles/globals.css`, bloco `@theme`. Os pares de cores têm o contraste AA verificado por `npm run contrast`.

### Trocar as artes placeholder pelas reais
As artes de hoje são SVGs gerados por código (`npm run art`). Para usar as suas:
1. Coloque o arquivo (SVG, PNG ou WebP) em `public/art/<coleção>/`, por exemplo `public/art/pets/minha-arte.svg`.
2. Em `src/data/arts.ts`, ajuste o campo `file` da arte correspondente (ex.: `/art/pets/minha-arte.svg`), ou cadastre a arte nova em **Admin → Artes** (também dá para enviar o arquivo por lá).
3. Pronto: a arte já aparece em todos os mockups. Não rode `npm run art` depois, pois ele recria os placeholders.

Dicas: use arte com **proporção parecida com a orientação** cadastrada (retrato, paisagem ou quadrado) e deixe uma margem de segurança de ~5% nas bordas. Em PNG/JPG a arte é cortada para preencher a área de impressão (`cover`). As artes de tipografia deste protótipo têm o texto dentro da imagem (em português).

### Adicionar produtos, artes, coleções e combinações
- **Pelo painel (mais fácil):** Admin → Produtos / Artes / Catálogo. O painel guarda no navegador.
- **No código (permanente):**
  - Produtos e variações: `src/data/products.ts` (cada tipo de produto tem nome, preço, mockup, tamanho/cor/material).
  - Coleções (nichos): `src/data/niches.ts`. Categorias: `src/data/categories.ts`.
  - Artes: `src/data/arts.ts`. A combinação arte × produto é gerada em `src/data/catalog-items.ts`.
- Novo **tipo** de produto com mockup próprio: veja a seção "Mockups" abaixo.

---

## 3. Mockups (como a arte aparece no produto)

Cada produto é desenhado como um **SVG em camadas**: base do produto + arte recortada na área de impressão + sombras e brilhos. Por ser vetorial, trocar cor, tamanho ou moldura atualiza o desenho na hora, sem servidor, sem imagens pesadas e sem custo.

- Canecas, garrafas e comedouros: a arte é fatiada em faixas que simulam o "enrolar" no cilindro.
- Camisetas, bonés, ecobags, necessaires: silhuetas com a estampa na área certa e dobras de tecido.
- Quadros, pôsteres, canvas, cadernos, capinhas, tapetes etc.: o tamanho escolhido muda a proporção e a escala.
- Galeria da página de produto: vista principal, em cena, detalhe (zoom) e arte original.

Arquivos: regras e cálculos em `src/domain/mockup.ts` (testadas); desenhos em `src/components/domain/mockup/*.tsx`; o registro que liga cada tipo de produto a um desenho está em `Mockup.tsx`.
Limite honesto: os mockups são estilizados, não fotorrealistas. Quando houver mockups do fornecedor POD, basta usar a imagem como camada base.

---

## 4. Mapa do projeto

```
zora/
├─ src/
│  ├─ app/[locale]/        rotas (cada pasta = uma página): loja, checkout, conta, admin
│  ├─ components/
│  │  ├─ ui/               botões, campos, modal, tabela, toasts… (biblioteca de UI)
│  │  ├─ layout/           cabeçalho, rodapé, busca, seletor de idioma/moeda
│  │  ├─ domain/           peças da loja: product, catalog, cart, checkout, order, mockup, account, admin
│  │  └─ providers/        catálogo e hidratação dos dados salvos
│  ├─ domain/              regras de negócio puras e testadas: carrinho, cupons, preço, moeda, busca, mockup, pedidos
│  ├─ services/            "portas" (interfaces) + implementações mock → ponto de troca por serviços reais
│  ├─ data/                dados fictícios tipados (produtos, artes, nichos, cupons, clientes, pedidos, avaliações)
│  ├─ messages/            traduções PT e EN
│  ├─ store/               estado do navegador (carrinho, favoritos, moeda, sessão, avisos)
│  ├─ config/              moeda/câmbio, frete, site
│  └─ styles/globals.css   tokens de design
├─ public/art/             artes (placeholders hoje)  ·  public/brand/ logo e favicon
├─ scripts/                gerador de artes placeholder e verificador de contraste
├─ tests/unit/             testes das regras de negócio  ·  tests/e2e/ fluxos completos no navegador
└─ .env.example            variáveis previstas para integrações futuras (sem valores)
```

Regra de ouro: **componentes nunca leem `data/` diretamente**; eles usam `services/`. Assim, trocar os dados fictícios por um banco real não exige mexer nas telas.

---

## 5. Qualidade e testes

```bash
npm run check      # tipos (TypeScript estrito) + lint + testes unitários
npm run test       # só os testes unitários (carrinho, cupons, totais, moeda, mockup, busca…)
npm run test:e2e   # fluxos completos no navegador (sobe a versão de produção sozinho)
npm run contrast   # confere o contraste AA das cores da marca
```

- Acessibilidade: HTML semântico, foco visível, navegação por teclado, rótulos e erros ligados aos campos (`aria-describedby`), menus e modais acessíveis, respeito a `prefers-reduced-motion`.
- Dados salvos no navegador são validados; se estiverem corrompidos, o site volta ao padrão em vez de quebrar.
- Desempenho (Lighthouse mobile, versão de produção): veja o resumo de entrega.

---

## 6. O que é simulado

Pagamento (cartão e Pix), frete, impostos, e-mails, login, recuperação de senha, newsletter, contato, fornecedor POD e o painel admin (grava só no navegador). Nada é cobrado, enviado ou produzido.

## 7. Próximos passos (como cada integração se encaixa)

Todas as integrações entram **trocando uma linha em `src/services/index.ts`**: cada serviço tem uma interface em `src/services/ports/index.ts` e hoje uma implementação mock em `src/services/mock/`.

| Integração | Interface | O que fazer |
|---|---|---|
| **Banco de dados** (ex.: Postgres + Prisma ou Drizzle) | `CatalogRepo`, `OrderRepo` | Criar tabelas a partir dos tipos de `src/domain/types.ts` e implementar as interfaces. Mover as páginas de loja para buscar dados no servidor (Server Components) e usar o banco como fonte do `seedSnapshot`. Variável: `DATABASE_URL`. |
| **Autenticação** (ex.: Auth.js) | `AuthService` | Implementar login/cadastro/sessão reais (cookies httpOnly) e guardar senhas com hash. Proteger `/account` e `/admin` no servidor. Variável: `AUTH_SECRET`. |
| **Stripe** (cartão internacional e Pix) | `PaymentGateway` | Criar o PaymentIntent no servidor (rota de API), usar o Stripe Elements no passo de pagamento (hoje `PaymentStep` em `CheckoutFlow.tsx`) e confirmar o pedido por webhook. Variáveis: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`. |
| **Fornecedor POD** (Printful, Printify ou Gelato) | `PodProvider`, `ShippingQuoter` | Enviar o pedido pago ao fornecedor (`submitOrder`), receber atualizações de status por webhook (`getStatus`) e usar a cotação real de frete e impostos de importação no lugar de `config/shipping.ts`. Variáveis: `POD_PROVIDER`, `POD_API_KEY`. |
| **E-mails** | (novo) | Enviar as mensagens hoje exibidas como "prévia" na confirmação (`order.email*` em `messages/*/cart.json`). |
| **Mockups reais** | `MockupSpec` | Usar as imagens do fornecedor como camada base nos desenhos. |

## Limitações conhecidas

- O catálogo, os pedidos e as edições do admin ficam no `localStorage`: não sincronizam entre navegadores.
- Páginas novas criadas só pelo painel (produtos/itens) existem apenas naquele navegador.
- Mockups são estilizados (SVG), não fotos; alguns (bandana, meias, boné) são representações simples.
- Artes de tipografia têm o texto em português dentro da imagem.
- O Lighthouse deve ser medido na versão de produção (`npm run build && npm start`), não no `npm run dev`.
