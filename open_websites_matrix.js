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

const BATCH_SIZE = 5;
const DEFAULT_WAIT_MS = 180000;

const shardIndex = parseInt(process.env.SHARD_INDEX || '0', 10);
const totalShards = parseInt(process.env.TOTAL_SHARDS || '1', 10);
const WAIT_TIME = parseInt(process.env.WAIT_TIME_MS || String(DEFAULT_WAIT_MS), 10);

async function openShard(shardUrls) {
  console.log(`\n[Shard ${shardIndex}/${totalShards}] Processing ALL ${shardUrls.length} URLs for this shard...`);
  
  const totalBatches = Math.ceil(shardUrls.length / BATCH_SIZE);
  
  for (let i = 0; i < shardUrls.length; i += BATCH_SIZE) {
    const batch = shardUrls.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    
    console.log(`\n[Shard ${shardIndex}] Batch ${batchNumber}/${totalBatches} - Opening ${batch.length} URLs...`);
    
    const browsers = [];
    
    for (let j = 0; j < batch.length; j++) {
      const url = batch[j];
      console.log(`  [${j + 1}/${batch.length}] Opening: ${url}`);
      
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
    
    console.log(`[Shard ${shardIndex}] Waiting ${WAIT_TIME/1000}s...`);
    await new Promise(resolve => setTimeout(resolve, WAIT_TIME));
    
    console.log(`[Shard ${shardIndex}] Closing browsers...`);
    for (const browser of browsers) {
      try { await browser.close(); } catch (e) {}
    }
  }
  
  console.log(`[Shard ${shardIndex}] All ${shardUrls.length} URLs processed!`);
}

async function main() {
  console.log(`Starting puppeteer opener - Shard ${shardIndex}/${totalShards}`);
  console.log(`Total URLs: ${urls.length}, Wait: ${WAIT_TIME/1000}s per batch`);
  
  const shardUrls = urls.filter((_, idx) => (idx % totalShards) === shardIndex);
  console.log(`URLs for this shard: ${shardUrls.length}`);
  
  await openShard(shardUrls);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
