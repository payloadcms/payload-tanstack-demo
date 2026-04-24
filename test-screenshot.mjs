import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const errors = [];
page.on('pageerror', (err) => errors.push(err.message));

console.log('Navigating to localhost:3000...');
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 20000 });

const errorBanner = await page.$('text=Something went wrong');
if (errorBanner) {
  const text = await page.evaluate(() => document.body.innerText.slice(0, 300));
  console.log('❌ Error:', text);
} else {
  console.log('✅ Page loaded OK');
}

await page.screenshot({ path: 'screenshot-home.png', fullPage: false });
console.log('Screenshot saved: screenshot-home.png');

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

const heroImg = await page.$('.min-h-\\[80vh\\] img, [data-theme="dark"] img');
if (heroImg) {
  const box = await heroImg.boundingBox();
  console.log(`Hero image bounds: ${JSON.stringify(box)}`);
} else {
  console.log('No hero image found');
}

const heroContainer = await page.$('[data-theme="dark"]');
if (heroContainer) {
  const box = await heroContainer.boundingBox();
  console.log(`Hero container bounds: ${JSON.stringify(box)}`);
}

const header = await page.$('header');
if (header) {
  console.log('✅ Header present');
}

const footer = await page.$('footer');
if (footer) {
  console.log('✅ Footer present');
}

await browser.close();
