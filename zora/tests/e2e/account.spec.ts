import { expect, test } from '@playwright/test';

test('conta: cadastro, login demo, endereço, pedidos e logout', async ({ page }) => {
  // validação do cadastro
  await page.goto('/pt/register');
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page.getByText('Preencha este campo').first()).toBeVisible();
  await page.getByLabel('Nome completo').fill('Joana Nova');
  await page.getByLabel('E-mail').fill('joana@exemplo.com');
  await page.getByLabel('Senha', { exact: true }).fill('senha1234');
  await page.getByLabel('Confirmar senha').fill('outra1234');
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page.getByText('As senhas não coincidem')).toBeVisible();
  await page.getByLabel('Confirmar senha').fill('senha1234');
  await page.getByLabel(/Li e aceito/).check();
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page).toHaveURL(/\/pt\/account$/);
  await expect(page.getByRole('heading', { name: 'Olá, Joana!' })).toBeVisible();

  // sair e entrar como cliente demo
  await page.getByRole('button', { name: 'Sair' }).click();
  await page.goto('/pt/account/orders');
  await expect(page).toHaveURL(/login\?next=/);
  await page.getByRole('button', { name: 'Entrar como cliente demo' }).click();
  await expect(page).toHaveURL(/account\/orders/);
  await expect(page.getByText(/Pedido ZR-/).first()).toBeVisible();
  await page.getByText(/Pedido ZR-/).first().click();
  await expect(page.getByText('Acompanhamento')).toBeVisible();

  // endereços
  await page.getByRole('link', { name: 'Endereços' }).click();
  await page.getByRole('button', { name: 'Adicionar endereço' }).click();
  await page.getByLabel(/Apelido/).fill('Trabalho');
  await page.getByLabel('Nome de quem recebe').fill('Ana Souza');
  await page.getByLabel('Endereço e número').fill('Rua Nova, 10');
  await page.getByLabel('Cidade').fill('Campinas');
  await page.getByLabel('Estado').fill('SP');
  await page.getByLabel('CEP / código postal').fill('13010-000');
  await page.getByRole('button', { name: 'Salvar' }).click();
  await expect(page.getByText('Trabalho')).toBeVisible();
});

test('login com senha errada mostra erro', async ({ page }) => {
  await page.goto('/pt/login');
  await page.getByLabel('E-mail').fill('ana@zora.demo');
  await page.getByLabel('Senha').fill('errada');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByText('E-mail ou senha incorretos.')).toBeVisible();
});
