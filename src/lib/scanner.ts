'use server';

import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export interface ScanResult {
    bytes: number;
    green: boolean;
}

export async function estimatePageSize(url: string): Promise<ScanResult> {
    // Normalize URL
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }

    // Double check green hosting in parallel
    const greenPromise = checkGreenHosting(url);

    try {
        // Attempt 1: Puppeteer Scan (Manual Stealth)
        const bytes = await scanWithPuppeteer(url);
        const green = await greenPromise;
        return { bytes, green };
    } catch (puppeteerError) {
        console.error('Puppeteer scan failed, attempting fallback:', puppeteerError);

        // Attempt 2: Simple Fetch Fallback
        try {
            const bytes = await scanWithFetch(url);
            const green = await greenPromise;
            return { bytes, green };
        } catch (fetchError) {
            console.error('Fallback scan failed:', fetchError);
            throw new Error('Could not scan website. The site might be blocking access.');
        }
    }
}

async function scanWithPuppeteer(url: string): Promise<number> {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--window-size=1920,1080',
                '--disable-blink-features=AutomationControlled', // Manual stealth
                '--disable-dev-shm-usage',
            ]
        });

        const page = await browser.newPage();

        // Manual Stealth Overrides
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });

        // Pass "webdriver" check
        await page.evaluateOnNewDocument(() => {
            // @ts-ignore
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
        });

        const client = await page.target().createCDPSession();
        await client.send('Network.enable');

        let totalEncodedBodySize = 0;
        client.on('Network.loadingFinished', (params) => {
            if (params.encodedDataLength) {
                totalEncodedBodySize += params.encodedDataLength;
            }
        });

        // Use domcontentloaded for speed/robustness
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 25000
        });

        // Wait 3 seconds for dynamic assets
        await new Promise(r => setTimeout(r, 3000));

        return totalEncodedBodySize;
    } finally {
        if (browser) await browser.close();
    }
}

async function scanWithFetch(url: string): Promise<number> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CarbonTracker/1.0)' }
        });
        clearTimeout(timeout);

        if (!response.ok) throw new Error('Fetch failed');

        const text = await response.text();
        let total = configByteLength(text);

        const $ = cheerio.load(text);

        const assets: string[] = [];
        $('img[src]').each((_, el) => { const s = $(el).attr('src'); if (s) assets.push(resolve(url, s)); });
        $('script[src]').each((_, el) => { const s = $(el).attr('src'); if (s) assets.push(resolve(url, s)); });
        $('link[rel="stylesheet"]').each((_, el) => { const s = $(el).attr('href'); if (s) assets.push(resolve(url, s)); });

        const uniqueAssets = [...new Set(assets)].slice(0, 15);

        const sizes = await Promise.allSettled(uniqueAssets.map(async u => {
            const r = await fetch(u, { method: 'HEAD', signal: AbortSignal.timeout(3000) });
            const len = r.headers.get('content-length');
            return len ? parseInt(len) : 0;
        }));

        for (const s of sizes) {
            if (s.status === 'fulfilled') total += s.value;
        }

        return total || 500 * 1024;
    } catch (e) {
        throw e;
    }
}

async function checkGreenHosting(url: string): Promise<boolean> {
    try {
        const hostname = new URL(url).hostname;
        const res = await fetch(`https://api.thegreenwebfoundation.org/api/v3/greencheck/${hostname}`);
        const data = await res.json();
        return !!data.green;
    } catch {
        return false;
    }
}

function resolve(base: string, relative: string): string {
    try { return new URL(relative, base).href; } catch { return relative; }
}

function configByteLength(str: string) {
    return Buffer.byteLength(str, 'utf8');
}
