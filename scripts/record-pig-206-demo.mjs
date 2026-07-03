#!/usr/bin/env node
/**
 * Cloud Agent demo video for PIG-206: light mode, dark mode, Scheduled filter.
 * Run with dev server: CLOUD_AGENT_VERIFY_SCHEDULED=1 npm run dev
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.VERIFY_BASE_URL ?? 'http://localhost:3000';
const OUT = path.resolve('artifacts');

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
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();

  try {
    await waitForCampaigns(page);
    await hideDevOverlay(page);
    await page.waitForTimeout(2000);

    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await page.waitForTimeout(1500);
    await hideDevOverlay(page);
    await page.waitForTimeout(2000);

    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await page.waitForTimeout(800);

    const filter = page.locator('[aria-label="Filter by status"]');
    await filter.click();
    await page.waitForTimeout(500);
    await page.locator('[role="listbox"]').getByText('Scheduled', { exact: true }).click();
    await page.waitForTimeout(1500);
    await hideDevOverlay(page);
    await page.waitForTimeout(2000);
  } finally {
    await context.close();
    await browser.close();
  }

  console.log('Demo video saved under', OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
