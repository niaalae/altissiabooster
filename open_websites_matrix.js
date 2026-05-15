const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

const configPath = path.join(__dirname, 'links.json');
let urls = [];

try {
  const configData = fs.readFileSync(configPath, 'utf8');
  urls = JSON.parse(configData);
  console.log(`Loaded ${urls.length} URLs from ${configPath}`);
} catch (err) {
  console.error(`Error loading config from ${configPath}:`, err.message);
  process.exit(1);
}

const PACK_INDEX = parseInt(process.env.PACK_INDEX || '0', 10);
const PACK_SIZE = parseInt(process.env.PACK_SIZE || '10', 10);
const WAIT_TIME_MS = parseInt(process.env.WAIT_TIME_MS || '180000', 10);

const start = PACK_INDEX * PACK_SIZE;
const end = Math.min(start + PACK_SIZE, urls.length);
const packUrls = urls.slice(start, end);

console.log(`Pack ${PACK_INDEX}: URLs ${start} to ${end - 1} (${packUrls.length} links)`);

async function openUrls() {
  const browsers = [];

  for (let i = 0; i < packUrls.length; i++) {
    const url = packUrls[i];
    console.log(`  [${i + 1}/${packUrls.length}] Opening: ${url}`);

    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      browsers.push(browser);
    } catch (err) {
      console.log(`  Error opening ${url}: ${err.message}`);
    }
  }

  console.log(`Waiting ${WAIT_TIME_MS / 1000}s...`);
  await new Promise(resolve => setTimeout(resolve, WAIT_TIME_MS));

  console.log(`Closing browsers...`);
  for (const browser of browsers) {
    try { await browser.close(); } catch (err) {}
  }

  console.log(`Pack ${PACK_INDEX} done.`);
}

openUrls().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
