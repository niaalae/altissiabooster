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

const packIndex = parseInt(process.env.PACK_INDEX || '0', 10);
const packSize = parseInt(process.env.PACK_SIZE || '10', 10);
const WAIT_TIME = parseInt(process.env.WAIT_TIME_MS || String(DEFAULT_WAIT_MS), 10);

async function openPack(packUrls) {
  console.log(`\n[Pack ${packIndex}] Processing ${packUrls.length} URLs...`);
  
  const totalBatches = Math.ceil(packUrls.length / BATCH_SIZE);
  
  for (let i = 0; i < packUrls.length; i += BATCH_SIZE) {
    const batch = packUrls.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    
    console.log(`\n[Pack ${packIndex}] Batch ${batchNumber}/${totalBatches} - Opening ${batch.length} URLs...`);
    
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
    
    console.log(`[Pack ${packIndex}] Waiting ${WAIT_TIME/1000}s...`);
    await new Promise(resolve => setTimeout(resolve, WAIT_TIME));
    
    console.log(`[Pack ${packIndex}] Closing browsers...`);
    for (const browser of browsers) {
      try { await browser.close(); } catch (e) {}
    }
  }
  
  console.log(`[Pack ${packIndex}] All ${packUrls.length} URLs processed!`);
}

async function main() {
  console.log(`Starting puppeteer opener - Pack ${packIndex}`);
  console.log(`Pack size: ${packSize}, Wait: ${WAIT_TIME/1000}s per batch`);
  
  const startIdx = packIndex * packSize;
  const endIdx = Math.min(startIdx + packSize, urls.length);
  const packUrls = urls.slice(startIdx, endIdx);
  
  console.log(`URLs for this pack: ${packUrls.length} (indices ${startIdx}-${endIdx-1})`);
  
  if (packUrls.length === 0) {
    console.log('No URLs for this pack, exiting.');
    process.exit(0);
  }
  
  await openPack(packUrls);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});