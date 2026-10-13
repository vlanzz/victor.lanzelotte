import { expect, test } from '@playwright/test';

test('fluxo completo: buscar → filtrar → produto → variar → favoritar → carrinho → cupom → checkout → confirmação', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ilustrações');

  // buscar
  await page.getByRole('combobox').first().fill('caneca');
  await page.getByRole('combobox').first().press('Enter');
  await expect(page).toHaveURL(/search\?q=caneca/);
  await expect(page.getByRole('status').first()).toContainText('produto');

  // filtrar por cor
  await page.getByRole('button', { name: 'Azul-marinho' }).first().click();
  await expect(page).toHaveURL(/color=navy/);

  // abrir produto
  await page.locator('article h3 a').first().click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // variar (tamanho 450 ml muda o preço) e favoritar
  const price = page.getByLabel('Preço');
  const before = await price.innerText();
  await page.getByRole('radio', { name: '450 ml' }).click();
  await expect(price).not.toHaveText(before);
  await page.getByRole('button', { name: /Adicionar .* aos favoritos/ }).first().click();
  await expect(page.getByRole('button', { name: /Remover .* dos favoritos/ }).first()).toBeVisible();

  // carrinho + cupom
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click();
  await page.goto('/pt/cart');
  await expect(page.getByRole('heading', { name: 'Seu carrinho' })).toBeVisible();
  await page.getByLabel('Cupom de desconto').fill('xxxx');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await expect(page.locator('#coupon-msg')).toContainText('Não encontramos esse cupom');
  await page.getByLabel('Cupom de desconto').fill('bemvindo10');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await expect(page.getByText('Cupom BEMVINDO10 aplicado')).toBeVisible();
  await expect(page.getByText('Desconto', { exact: true })).toBeVisible();

  // checkout
  await page.getByRole('link', { name: 'Finalizar compra' }).click();
  await page.getByLabel('E-mail').fill('cliente@exemplo.com');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByLabel('Nome completo').fill('Maria Teste');
  await page.getByLabel('Telefone').fill('11999998888');
  await page.getByLabel('CEP / código postal').fill('01310-100');
  await page.getByLabel('Endereço e número').fill('Av. Paulista, 1000');
  await page.getByLabel('Cidade').fill('São Paulo');
  await page.getByLabel('Estado').fill('SP');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('radio', { name: /Expresso/ }).check();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // cartão recusado e depois aprovado
  await page.getByLabel('Número do cartão').fill('4000 0000 0000 0002');
  await page.getByLabel('Nome impresso no cartão').fill('MARIA TESTE');
  await page.getByLabel('Validade (MM/AA)').fill('12/39');
  await page.getByLabel('CVV').fill('123');
  await page.getByRole('button', { name: /^Pagar/ }).click();
  await expect(page.getByText(/recusado/)).toBeVisible();
  await page.getByRole('radio', { name: 'Pix' }).click();
  await page.getByRole('button', { name: /^Pagar/ }).click();

  await expect(page.getByRole('heading', { name: 'Pedido confirmado!' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/ZR-\d+/).first()).toBeVisible();
  await expect(page.getByText('Pix copia e cola')).toBeVisible();
});

test('idioma e moeda: troca e persiste', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.getByRole('button', { name: 'Idioma e moeda' })).toContainText('PT · BRL');
  await page.getByRole('button', { name: 'Idioma e moeda' }).click();
  await page.getByRole('button', { name: 'Dólar (US$)' }).click();
  await expect(page.getByRole('button', { name: 'Idioma e moeda' })).toContainText('PT · USD');
  await page.getByRole('button', { name: 'Idioma e moeda' }).click();
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en/);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Language and currency' })).toContainText('EN · USD');
});
