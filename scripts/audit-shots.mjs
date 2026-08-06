/**
 * Design-pass audit capture. Not for the store — this shoots the screens AND
 * isolates the two share cards (including the off-screen day-card capture host)
 * so they can be judged as the standalone images they become once shared.
 *
 * Usage: node scripts/audit-shots.mjs   (needs dist-shots served on :8099)
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync, copyFileSync } from 'node:fs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = `http://localhost:${process.env.PORT || 8099}`;
const OUT = process.env.OUT || 'C:/Users/Milan/AppData/Local/Temp/claude/audit-shots';
const VIEWPORT = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync(OUT, { recursive: true });

// Lives in scripts/ so `expo export --clear` can't delete it.
copyFileSync(new URL('./seed.html', import.meta.url), 'dist-shots/seed.html');

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  defaultViewport: VIEWPORT,
  args: ['--hide-scrollbars', '--window-size=390,844'],
});
const page = await browser.newPage();
await page.setViewport(VIEWPORT);

await page.goto(`${BASE}/seed.html`, { waitUntil: 'networkidle2' });
await sleep(1200);
await page.goto(BASE, { waitUntil: 'networkidle2' });
await sleep(6500); // quote splash holds ~2.6s then fades

async function shoot(name, clip) {
  await sleep(900);
  await page.screenshot({ path: `${OUT}/${name}.png`, type: 'png', ...(clip ? { clip } : {}) });
  console.log('shot', name);
}

async function scrollTo(y) {
  await page.evaluate((top) => {
    const s = Array.from(document.querySelectorAll('div'))
      .filter((el) => el.scrollHeight > el.clientHeight + 40)
      .sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
    if (s) s.scrollTop = top;
  }, y);
  await sleep(800);
}

/**
 * RN Web's TouchableOpacity listens on pointer events, not a synthetic click,
 * so drive the real mouse at the label's centre instead of dispatching an event.
 */
async function tapTab(label) {
  const box = await page.evaluate((text) => {
    const hit = Array.from(document.querySelectorAll('div,span'))
      .find((el) => el.textContent?.trim() === text && el.children.length === 0);
    if (!hit) return null;
    const r = hit.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, label);
  if (!box) return false;
  await page.mouse.click(box.x, box.y);
  await sleep(2000);
  return true;
}

/** Click any element whose exact trimmed text matches, via a real mouse press. */
async function tapText(text) {
  const box = await page.evaluate((t) => {
    const hit = Array.from(document.querySelectorAll('div,span'))
      .find((el) => el.textContent?.trim() === t && el.children.length === 0);
    if (!hit) return null;
    const r = hit.getBoundingClientRect();
    if (r.width === 0) return null;
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, text);
  if (!box) return false;
  await page.mouse.click(box.x, box.y);
  await sleep(1400);
  return true;
}

/**
 * Pull the share preview's off-screen capture host on-screen and shoot it at
 * true export size. This is the actual artifact users post, so it is worth
 * seeing unscaled rather than judging the shrunken preview.
 */
async function shootCaptureHost(name) {
  const box = await page.evaluate(() => {
    const host = Array.from(document.querySelectorAll('div')).find((el) => {
      const s = getComputedStyle(el);
      return s.position === 'absolute' && parseFloat(s.left) < -5000;
    });
    if (!host) return null;
    host.style.left = '0px';
    host.style.top = '0px';
    host.style.zIndex = '99999';
    const card = host.firstElementChild || host;
    const r = card.getBoundingClientRect();
    return { x: 0, y: 0, width: Math.ceil(r.width), height: Math.ceil(r.height) };
  });
  if (!box) { console.log('!! capture host not found for', name); return false; }
  await page.setViewport({ ...VIEWPORT, width: Math.max(box.width, 390), height: box.height });
  await sleep(700);
  await page.screenshot({ path: `${OUT}/${name}.png`, type: 'png', clip: box });
  await page.setViewport(VIEWPORT);
  console.log('shot', name);
  return true;
}

// ---- Daily screen ----
await shoot('01-daily-top');
await scrollTo(700);
await shoot('02-daily-chain');
await scrollTo(1500);
await shoot('03-daily-chain-lower');
await scrollTo(4000);
await shoot('04-daily-reflection');

// ---- Day share: open the preview, shoot the sheet, then the true-size card ----
console.log('day share:', await tapText('Share this day'));
await shoot('05-share-day-PREVIEW');
await shootCaptureHost('06-SHARE-DAY-CARD');
await page.reload({ waitUntil: 'networkidle2' });
await sleep(6500);

// ---- Weekly screen ----
console.log('weekly:', await tapTab('Weekly'));
await shoot('07-weekly-top');
await scrollTo(500);
await shoot('08-weekly-breakdown');
await scrollTo(1200);
await shoot('09-weekly-pillars');
await scrollTo(0);

// ---- Week share ----
console.log('week share:', await tapText('Share my week'));
await shoot('10-share-week-PREVIEW');
await shootCaptureHost('11-SHARE-WEEK-CARD');
await page.reload({ waitUntil: 'networkidle2' });
await sleep(6500);
await tapTab('Weekly');

// ---- Settings ----
console.log('settings:', await tapTab('Settings'));
await shoot('12-settings-top');
await scrollTo(1200);
await shoot('13-settings-about');

await browser.close();
console.log('done ->', OUT);
