import { expect, test, type Page } from '@playwright/test';

async function loginAdmin(page: Page) {
  await page.goto('/pt/login');
  await page.getByRole('button', { name: 'Entrar como admin demo' }).click();
  await expect(page).toHaveURL(/\/pt\/admin$/);
  await expect(page.getByRole('heading', { name: 'Visão geral' })).toBeVisible();
}

test('admin protegido: cliente comum não vê o painel', async ({ page }) => {
  await page.goto('/pt/admin');
  await expect(page.getByRole('heading', { name: 'Área restrita' })).toBeVisible();
});

test('admin: cupom, produto, arte, catálogo, pedido e avaliação refletem na loja', async ({ page }) => {
  await loginAdmin(page);

  // cupom novo
  await page.getByRole('link', { name: 'Cupons' }).click();
  await page.getByRole('button', { name: 'Novo cupom' }).click();
  await page.getByLabel('Código', { exact: true }).fill('teste15');
  await page.getByLabel('Valor (% ou valor fixo)').fill('15');
  await page.getByLabel('Descrição (PT)').fill('15% de teste');
  await page.getByLabel('Descrição (EN)').fill('15% test');
  await page.getByRole('button', { name: 'Salvar' }).click();
  await expect(page.getByRole('cell', { name: 'TESTE15', exact: true })).toBeVisible();

  // produto: renomear
  await page.getByRole('link', { name: 'Produtos' }).click();
  await page.getByRole('button', { name: 'Editar Caneca de cerâmica' }).click();
  await page.getByLabel('Nome (PT)').fill('Caneca Zora Premium');
  await page.getByRole('button', { name: 'Salvar' }).last().click();
  await expect(page.getByRole('cell', { name: 'Caneca Zora Premium', exact: true })).toBeVisible();

  // arte nova + combinar com produto
  await page.getByRole('link', { name: 'Artes' }).click();
  await page.getByRole('button', { name: 'Nova arte' }).click();
  await page.getByLabel('Título (PT)').fill('Arte de Teste');
  await page.getByLabel('Título (EN)').fill('Test Art');
  await page.getByLabel('Pets', { exact: true }).check();
  await page.getByLabel('Arquivo da arte').fill('/art/pets/gato-lua.svg');
  await page.getByRole('button', { name: 'Salvar' }).click();
  await expect(page.getByText('Arte de Teste')).toBeVisible();
  await page.getByRole('link', { name: 'Catálogo' }).click();
  await page.getByLabel('Arte', { exact: true }).selectOption({ label: 'Arte de Teste' });
  await page.getByRole('checkbox', { name: 'Caneca Zora Premium', exact: true }).check();
  await page.getByRole('button', { name: 'Criar combinações' }).click();
  await expect(page.getByText('1 item criado.')).toBeVisible();

  // pedido: mudar status
  await page.getByRole('link', { name: 'Pedidos' }).click();
  await page.getByRole('link', { name: /ZR-/ }).first().click();
  await page.getByLabel('Mudar status').selectOption('shipped');
  await page.getByRole('button', { name: 'Salvar' }).click();
  await expect(page.getByText('Status atualizado para “Enviado”.')).toBeVisible();

  // avaliação: aprovar uma pendente
  await page.getByRole('link', { name: 'Avaliações' }).click();
  const before = await page.getByRole('button', { name: /^Pendente/ }).innerText();
  await page.getByRole('button', { name: 'Aprovar' }).first().click();
  await expect(page.getByRole('button', { name: /^Pendente/ })).not.toHaveText(before);

  // loja reflete: busca pelo novo nome e item da arte nova
  await page.goto('/pt/search?q=Premium');
  await expect(page.getByText('Caneca Zora Premium · Arte de Teste').first()).toBeVisible();

  // cupom novo vale no carrinho
  await page.locator('article h3 a').first().click();
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click();
  await page.goto('/pt/cart');
  await page.getByLabel('Cupom de desconto').fill('teste15');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await expect(page.getByText('Cupom TESTE15 aplicado')).toBeVisible();
});
