const { chromium, firefox } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const channel = process.env.TEST_BROWSER || 'msedge';
const base = 'https://arctavis.github.io';
const chapters = [
  {url: '/', count: 15, name: 'chapter1'},
  {url: '/digital-fossils.html', count: 15, name: 'chapter2'},
  {url: '/american-symbols.html', count: 12, name: 'chapter3'},
];
const failures = [];
const screenshotDir = path.join(__dirname, 'windows-browser-screenshots');
fs.mkdirSync(screenshotDir, { recursive: true });

async function check(page, chapter) {
  const issues = [];
  const errors = [];
  const badHttp = [];
  const netFail = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => {
    if (r.url().startsWith(base) && r.status() >= 400) badHttp.push(r.status()+' '+r.url());
  });
  page.on('requestfailed', r => {
    if (r.url().startsWith(base)) netFail.push(r.url()+' '+r.failure()?.errorText);
  });
  const start = Date.now();
  let status = 0;
  try {
    const response = await page.goto(base + chapter.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    status = response?.status() ?? 0;
    if (status !== 200) issues.push('Document HTTP '+status);
    await page.waitForSelector('#gallery .card', { timeout: 20000 });
    const rendered = await page.locator('#gallery .card').count();
    if (rendered !== chapter.count) issues.push('Cards '+rendered+' expected '+chapter.count);

    // Eagerly decode EVERY local image, including lazy ones below fold.
    // This also catches Windows SVG-specific loading/rasterization errors.
    const artwork = await page.evaluate(async () => {
      const imgs = [...document.querySelectorAll('img[src*="assets/art/"]')];
      for (const img of imgs) img.loading = 'eager';
      return await Promise.all(imgs.map(async img => {
        let decode = 'ok';
        try {
          await Promise.race([
            img.decode(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('decode timeout')), 25000)),
          ]);
        } catch(e) { decode = String(e.message); }
        const rect = img.getBoundingClientRect();
        return {src: img.getAttribute('src'), width: img.naturalWidth,
          height: img.naturalHeight, decode, cssWidth: Math.round(rect.width),
          complete: img.complete};
      }));
    });
    for (const img of artwork) {
      if (img.width === 0 || img.height === 0 || img.decode !== 'ok')
        issues.push('Bad SVG '+img.src+' '+img.width+'x'+img.height+' decode='+img.decode);
    }
    console.log('ARTWORK '+channel+' '+chapter.name+' '+JSON.stringify(artwork));
    const pixels = await page.evaluate(() => {
      const result = [];
      const images = [...document.querySelectorAll('img[src*="assets/art/"]')];
      for (const img of images) {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 48; canvas.height = 48;
          const context = canvas.getContext('2d', {willReadFrequently:true});
          context.drawImage(img, 0, 0, 48, 48);
          const data = context.getImageData(0, 0, 48, 48).data;
          let visible = 0; let differences = 0; let first = '';
          for (let i=0;i<data.length;i+=4) {
            if(data[i+3] >= 30) visible++;
            const color = data[i]+','+data[i+1]+','+data[i+2]+','+data[i+3];
            if (!first) first=color;
            if (color !== first) differences++;
          }
          result.push({src:img.getAttribute('src'),visible,variation:differences});
        } catch(e) { result.push({src:img.getAttribute('src'),error:e.message}); }
      }
      return result;
    });
    console.log('PIXELS '+channel+' '+chapter.name+' '+JSON.stringify(pixels));
    for (const p of pixels) if(p.visible===0 || p.variation===0 || p.error)
      issues.push('SVG visually empty/uniform or rasterization error '+JSON.stringify(p));


    const first = page.locator('#gallery .art-open').first();
    await first.click({ timeout: 12000 });
    await page.waitForSelector('#viewer[open]', { timeout: 10000 });
    const modalImage = await page.locator('#viewer-img').evaluate(async img => {
      try { await img.decode(); } catch {}
      return {src:img.getAttribute('src'), width:img.naturalWidth, height:img.naturalHeight};
    });
    if (modalImage.width === 0) issues.push('Modal image does not render '+JSON.stringify(modalImage));
    await page.locator('#close-viewer').click({timeout:10000});
    await page.locator('#viewer').waitFor({state:'hidden', timeout:10000});

    const search = page.locator('#search');
    if (await search.count()) {
      await search.fill('zzzz-impossible-art');
      const hiddenCount = await page.locator('#gallery .card[hidden]').count();
      if (hiddenCount !== chapter.count) issues.push('Search filter mismatch '+hiddenCount);
      await search.fill('');
    } else issues.push('Missing search control');

    const dims = await page.evaluate(() => ({
      viewport: [innerWidth,innerHeight], scrollWidth:document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth, cssLoaded: getComputedStyle(document.body).backgroundColor,
      cardsColumns:getComputedStyle(document.querySelector('#gallery')).gridTemplateColumns,
    }));
    if (dims.scrollWidth > dims.viewport[0] + 10) issues.push('Horizontal overflow '+JSON.stringify(dims));
    if (dims.cssLoaded === 'rgba(0, 0, 0, 0)') issues.push('CSS failed to load');
    await page.screenshot({path:path.join(screenshotDir,channel+'-'+chapter.name+'.png'), timeout:30000});
    console.log('RESULT '+JSON.stringify({browser:channel,chapter:chapter.name,status,ms:Date.now()-start,
      artworks:artwork.length,dims,modalImage,errors,badHttp,netFail,issues}));
  } catch(e) {
    issues.push('Exception: '+(e.stack || e.message));
    console.log('EXCEPTION '+channel+' '+chapter.name+' '+(e.stack || e.message));
    try { await page.screenshot({path:path.join(screenshotDir,channel+'-'+chapter.name+'-error.png'),timeout:5000}); } catch {}
  }
  issues.push(...errors.map(x=>'JavaScript: '+x));
  issues.push(...badHttp.map(x=>'HTTP: '+x));
  issues.push(...netFail.map(x=>'Network: '+x));
  if(issues.length) failures.push(chapter.name+': '+issues.join('; '));
}

(async function main() {
  const browser = channel === 'firefox' ? await firefox.launch({headless:true}) : await chromium.launch({channel,headless:true,args:['--disable-dev-shm-usage']});
  try {
    for (const chapter of chapters) {
      const context = await browser.newContext({
        viewport:{width:1365,height:900}, deviceScaleFactor:1,
        userAgent: process.env.TEST_UA || undefined,
        reducedMotion:'reduce',
      });
      const page = await context.newPage();
      await check(page,chapter);
      await context.close();
    }
  } finally {
    await browser.close();
  }
  if(failures.length) {
    console.error('WINDOWS BROWSER TEST FAILED: '+JSON.stringify(failures));
    process.exitCode = 1;
  } else console.log('WINDOWS BROWSER TEST PASSED: '+channel+' all three chapters, all assets, modal, filter, layout.');
})().catch(e => {console.error(e.stack||e);process.exitCode=1;});
