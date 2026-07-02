#!/usr/bin/env node
/**
 * Cloud Agent self-verify screenshots for PIG-206 (scheduled-status flag ON).
 * Run with dev server: CLOUD_AGENT_VERIFY_SCHEDULED=1 npm run dev
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.VERIFY_BASE_URL ?? 'http://localhost:3000';
const OUT = path.resolve('artifacts/screenshots');

async function waitForCampaigns(page) {
  await page.goto(`${BASE}/campaigns`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Campaigns' }).waitFor({ timeout: 30_000 });
  await page.waitForTimeout(1500);
}

async function hideDevOverlay(page) {
  await page.evaluate(() => {
    document.querySelectorAll('nextjs-portal').forEach((el) => {
      el.style.display = 'none';
    });
  });
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await waitForCampaigns(page);
    await hideDevOverlay(page);
    await page.screenshot({ path: path.join(OUT, 'campaigns-light-scheduled.png'), fullPage: false });

    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await page.waitForTimeout(500);
    await hideDevOverlay(page);
    await page.screenshot({ path: path.join(OUT, 'campaigns-dark-scheduled.png'), fullPage: false });

    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await page.waitForTimeout(300);

    const filter = page.locator('[aria-label="Filter by status"]');
    await filter.click();
    await page.locator('[role="listbox"]').getByText('Scheduled', { exact: true }).click();
    await page.waitForTimeout(800);
    await hideDevOverlay(page);
    await page.screenshot({ path: path.join(OUT, 'campaigns-scheduled-filter.png'), fullPage: false });

    console.log('Screenshots saved to', OUT);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
