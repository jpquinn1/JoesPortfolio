import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);
const read = (path) => readFile(new URL(path, dist), 'utf8');
const origin = 'https://joequinn.dev';
const cases = (await readdir(new URL('projects/', dist), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory()).map((entry) => `projects/${entry.name}`);
assert.ok(cases.length > 0, 'The portfolio must publish its case studies');
for (const path of ['', 'about', 'life', 'projects', 'resume', ...cases]) {
  const html = await read(path ? `${path}/index.html` : 'index.html');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical, `Missing canonical on /${path}`);
  assert.equal(canonical.replace(/\/$/, ''), `${origin}/${path}`.replace(/\/$/, ''));
}
const home = await read('index.html');
assert.match(home, /href="https:\/\/quinnsoftwarestudio\.com\/"/);
assert.match(await read('projects/index.html'), /href="https:\/\/quinnsoftwarestudio\.com\/#contact"/);
assert.match(await read('robots.txt'), /Sitemap: https:\/\/joequinn\.dev\/sitemap-index\.xml/);
const sitemap = await read('sitemap-0.xml');
assert.ok(sitemap.includes(origin) && !sitemap.includes('quinnsoftwarestudio.com') && !sitemap.includes('/studio/'));
await access(new URL('sitemap-index.xml', dist));
await access(new URL('rss.xml', dist));
console.log(`Verified the portfolio homepage, navigation, ${cases.length} case studies, RSS and sitemap.`);
