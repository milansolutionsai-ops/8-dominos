/**
 * App Store screenshot capture.
 *
 * Renders the exported web build at Apple's 6.9" iPhone spec (1290x2796) by
 * using a 430x932 viewport at deviceScaleFactor 3, so output is natively crisp
 * rather than upscaled.
 *
 * Prereqs: a static server on PORT serving `expo export --platform web` output,
 * with seed.html present to pre-populate localStorage.
 *
 * Usage: node scripts/shoot-store-screenshots.mjs
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = process.env.PORT || 8099;
const BASE = `http://localhost:${PORT}`;
const OUT = process.env.OUT || 'C:/Users/Milan/Desktop/Clients/Hassan/appstore-screenshots';

const VIEWPORT = { width: 430, height: 932, deviceScaleFactor: 3, isMobile: true, hasTouch: true };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  defaultViewport: VIEWPORT,
  args: ['--hide-scrollbars', '--force-device-scale-factor=3', '--window-size=430,932'],
});

const page = await browser.newPage();
await page.setViewport(VIEWPORT);

// Seed localStorage, then land on the app.
await page.goto(`${BASE}/seed.html`, { waitUntil: 'networkidle2' });
await sleep(1500);
await page.goto(BASE, { waitUntil: 'networkidle2' });

// The quote splash holds ~2.6s then fades out.
await sleep(6000);

async function shoot(name) {
  await sleep(1200);
  await page.screenshot({ path: `${OUT}/${name}.png`, type: 'png' });
  console.log('shot', name);
}

/**
 * React Native Web scrolls an inner overflow div, not the window — so
 * window.scrollTo is a no-op here. Find the tallest scrollable node instead.
 */
async function scrollTo(y) {
  await page.evaluate((top) => {
    const scrollers = Array.from(document.querySelectorAll('div')).filter(
      (el) => el.scrollHeight > el.clientHeight + 40
    );
    scrollers.sort((a, b) => b.scrollHeight - a.scrollHeight);
    if (scrollers[0]) scrollers[0].scrollTop = top;
  }, y);
  await sleep(900);
}

/** Tap a bottom-tab by its visible label. */
async function tapTab(label) {
  const tapped = await page.evaluate((text) => {
    const els = Array.from(document.querySelectorAll('div,span'));
    const hit = els.find((el) => el.textContent?.trim() === text && el.children.length === 0);
    if (!hit) return false;
    let node = hit;
    for (let i = 0; i < 6 && node; i++) {
      if (node.getAttribute?.('tabindex') !== null || node.onclick) break;
      node = node.parentElement;
    }
    (node || hit).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return true;
  }, label);
  await sleep(2000);
  return tapped;
}

await shoot('01-daily-board');

await scrollTo(760);
await shoot('02-daily-chain-lower');

await scrollTo(4000);
await shoot('03-daily-reflection');
await scrollTo(0);

console.log('weekly tab:', await tapTab('Weekly'));
await scrollTo(560);
await shoot('04-weekly-share-card');

await scrollTo(1150);
await shoot('05-weekly-breakdown');

console.log('settings tab:', await tapTab('Settings'));
await scrollTo(4000);
await shoot('06-settings-philosophy');

await browser.close();
console.log('done ->', OUT);
