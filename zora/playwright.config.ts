import { defineConfig } from '@playwright/test';

const port = 3100;
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  retries: 0,
  use: { baseURL, launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH ?? undefined } },
  // Sobe a versão de produção (a mesma usada para medir desempenho) se não houver servidor rodando.
  webServer: process.env.E2E_BASE_URL ? undefined : { command: `npm run build && npx next start -p ${port}`, url: baseURL, reuseExistingServer: true, timeout: 240_000 },
});
