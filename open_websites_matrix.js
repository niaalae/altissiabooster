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

const DEFAULT_MAX_PAGES = 10;
const DEFAULT_WAIT_MS = 180000; // 3 minutes

const shardIndex = parseInt(process.env.SHARD_INDEX || '0', 10);
const totalShards = parseInt(process.env.TOTAL_SHARDS || '1', 10);
const MAX_PAGES = parseInt(process.env.MAX_PAGES || String(DEFAULT_MAX_PAGES), 10);
const WAIT_TIME = parseInt(process.env.WAIT_TIME_MS || String(DEFAULT_WAIT_MS), 10);

// Open pages for this shard using a single browser, keep them open for WAIT_TIME
async function openShard(urlsForShard) {
  console.log(`\n[Shard ${shardIndex}/${totalShards}] Opening ${urlsForShard.length} URLs (max ${MAX_PAGES})...`);

  const toOpen = urlsForShard.slice(0, MAX_PAGES);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const pages = [];
    for (let i = 0; i < toOpen.length; i++) {
      const url = toOpen[i];
      console.log(`  [${i + 1}/${toOpen.length}] Opening: ${url}`);
      try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        pages.push(page);
      } catch (err) {
        console.log(`  Error opening ${url}: ${err.message}`);
      }
    }

    console.log(`[Shard ${shardIndex}] Keeping pages open for ${WAIT_TIME/1000} seconds...`);
    await new Promise(resolve => setTimeout(resolve, WAIT_TIME));

  } catch (err) {
    console.error('Fatal shard error:', err);
  } finally {
    if (browser) {
      try { await browser.close(); } catch (e) {}
    }
  }

  console.log(`[Shard ${shardIndex}] Done.`);
}

async function main() {
  console.log(`Starting puppeteer opener (HEADLESS MODE)`);
  console.log(`Total URLs: ${urls.length}, SHARD: ${shardIndex}/${totalShards}, MAX_PAGES: ${MAX_PAGES}, Wait time: ${WAIT_TIME/1000}s`);

  // determine URLs assigned to this shard
  const shardUrls = urls.filter((_, idx) => (idx % totalShards) === shardIndex);
  await openShard(shardUrls);

  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
