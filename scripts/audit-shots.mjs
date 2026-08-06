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

/** Find a node by its text and return the bounding box of an ancestor N levels up. */
async function boxOfAncestor(text, levels) {
  return page.evaluate(({ text, levels }) => {
    const hit = Array.from(document.querySelectorAll('div,span'))
      .find((el) => el.textContent?.trim() === text && el.children.length === 0);
    if (!hit) return null;
    let n = hit;
    for (let i = 0; i < levels && n.parentElement; i++) n = n.parentElement;
    const r = n.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  }, { text, levels });
}

// ---- Daily screen ----
await shoot('01-daily-top');
await scrollTo(700);
await shoot('02-daily-chain');
await scrollTo(1500);
await shoot('03-daily-chain-lower');
await scrollTo(4000);
await shoot('04-daily-reflection');
await scrollTo(0);

// ---- The off-screen ShareDayCard capture host: pull it on-screen and shoot it ----
const dayBox = await page.evaluate(() => {
  // The host is absolutely positioned at left:-10000 with the card inside.
  const hosts = Array.from(document.querySelectorAll('div')).filter((el) => {
    const s = getComputedStyle(el);
    return s.position === 'absolute' && parseFloat(s.left) < -5000;
  });
  if (!hosts.length) return null;
  const h = hosts[0];
  h.style.left = '15px';
  h.style.top = '40px';
  h.style.zIndex = '99999';
  const card = h.firstElementChild || h;
  const r = card.getBoundingClientRect();
  return { x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 8), width: r.width + 16, height: r.height + 16 };
});
if (dayBox) { await shoot('05-SHARE-DAY-CARD', dayBox); }
else console.log('!! day capture host not found');
await page.reload({ waitUntil: 'networkidle2' });
await sleep(6500);

// ---- Weekly screen ----
console.log('weekly:', await tapTab('Weekly'));
await shoot('06-weekly-top');
await scrollTo(430);
await shoot('07-weekly-perf-and-sharecard');
const weekBox = await boxOfAncestor('My Week', 1);
if (weekBox && weekBox.height > 100) await shoot('08-SHARE-WEEK-CARD', {
  x: Math.max(0, weekBox.x - 6), y: Math.max(0, weekBox.y - 6),
  width: Math.min(390, weekBox.width + 12), height: weekBox.height + 12,
});
else console.log('!! week card box', JSON.stringify(weekBox));
await scrollTo(1000);
await shoot('09-weekly-breakdown');
await scrollTo(1700);
await shoot('10-weekly-mood-grid');
await scrollTo(2600);
await shoot('11-weekly-dominos-list');

// ---- Settings ----
console.log('settings:', await tapTab('Settings'));
await shoot('12-settings-top');
await scrollTo(1200);
await shoot('13-settings-about');

await browser.close();
console.log('done ->', OUT);
