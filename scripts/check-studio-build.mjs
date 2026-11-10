import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';

const studioOrigin = 'https://quinnsoftwarestudio.com';
const portfolioOrigin = 'https://joequinn.dev';
const preview = process.env.VERCEL_ENV === 'preview';
if (process.env.VERCEL_ENV === 'production') {
  const missing = ['RESEND_API_KEY', 'STUDIO_CONTACT_FROM'].filter((key) => !process.env[key]?.trim());
  if (process.env.STUDIO_CONTACT_DELIVERY !== 'enabled') missing.unshift('STUDIO_CONTACT_DELIVERY');
  assert.equal(missing.length, 0, `Production inquiry delivery needs Vercel environment configuration: ${missing.join(', ')}. No credentials are printed.`);
}
const read = (path) => readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8');
const home = await read('studio/index.html');
const privacy = await read('studio/privacy/index.html');
const portfolio = await read('index.html');

assert.match(home, new RegExp(`<link rel="canonical" href="${studioOrigin}/"`));
assert.match(privacy, new RegExp(`<link rel="canonical" href="${studioOrigin}/privacy/?"`));
assert.match(portfolio, new RegExp(`<link rel="canonical" href="${portfolioOrigin}/"`));
assert.match(home, /Discuss one workflow/);
assert.match(home, /id="process"/);
assert.match(home, /id="contact"/);
if (!preview) {
  assert.match(home, /href="https:\/\/joequinn\.dev\/projects\//);
  assert.match(home, /href="https:\/\/quinnsoftwarestudio\.com\/privacy"/);
  assert.match(portfolio, /href="https:\/\/quinnsoftwarestudio\.com\/"/);
}

const sitemap = await read('studio/sitemap.xml');
assert.ok(!sitemap.includes(portfolioOrigin), 'Studio sitemap must not list portfolio URLs');
assert.match(sitemap, /<loc>https:\/\/quinnsoftwarestudio\.com\/<\/loc>/);
const studies = await readdir(new URL('../dist/studio/work/', import.meta.url));
for (const slug of studies) {
  const page = await read(`studio/work/${slug}/index.html`);
  assert.ok(page.includes(`rel="canonical" href="${studioOrigin}/work/${slug}/"`) || page.includes(`rel="canonical" href="${studioOrigin}/work/${slug}"`), `Canonical missing for ${slug}`);
  assert.ok(sitemap.includes(`${studioOrigin}/work/${slug}</loc>`), `Sitemap missing ${slug}`);
  if (!preview) assert.match(page, /href="https:\/\/joequinn\.dev\/projects\//);
}
const personalSitemap = await read('sitemap-0.xml');
assert.ok(!personalSitemap.includes('/studio'), 'Moved Studio URLs must not remain in the portfolio sitemap');
assert.match(await read('studio/robots.txt'), /Sitemap: https:\/\/quinnsoftwarestudio\.com\/sitemap.xml/);
assert.match(await read('robots.txt'), /Sitemap: https:\/\/joequinn.dev\/sitemap-index.xml/);
await access(new URL('../dist/studio/mark.svg', import.meta.url));
await access(new URL('../dist/studio/social-preview.png', import.meta.url));
console.log(`Checked Studio home, privacy, ${studies.length} case studies, portfolio, sitemaps, and shared assets.`);
