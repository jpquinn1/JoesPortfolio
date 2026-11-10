import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

// Match the shipped low-level Vercel route regular expressions in their real
// order. A filesystem phase ends routing here; host routes must run before it.
function route(url) {
  const { hostname, pathname, search, hash } = new URL(url);
  for (const rule of config.routes) {
    if (rule.handle === 'filesystem') break;
    if (rule.has && !rule.has.every((condition) => condition.type === 'host' && condition.value === hostname)) continue;
    const match = new RegExp(rule.src);
    if (!match.test(pathname)) continue;
    const target = rule.headers?.Location ?? rule.dest;
    return {
      kind: rule.status ? 'redirect' : 'rewrite',
      destination: pathname.replace(match, target) + search + hash,
      ...(rule.status ? { status: rule.status } : {}),
    };
  }
  return { kind: 'file', destination: pathname + search + hash };
}

test('Studio domain serves the Studio while portfolio and previews keep their own home', () => {
  assert.equal(route('https://quinnsoftwarestudio.com/').destination, '/studio/index.html');
  assert.equal(route('https://joequinn.dev/').kind, 'file');
  assert.equal(route('https://joes-portfolio-preview.vercel.app/').kind, 'file');
  assert.equal(route('https://joes-portfolio-preview.vercel.app/studio').kind, 'file');
});

test('Old public Studio pages permanently redirect with path, query, and anchor intact', () => {
  for (const hostname of ['joequinn.dev', 'www.joequinn.dev', 'quinnsoftwarestudio.com']) {
    for (const [path, destination] of [['/studio', '/'], ['/studio/', '/'], ['/studio/privacy', '/privacy'], ['/studio/privacy/', '/privacy'], ['/studio/work/connected-equipment', '/work/connected-equipment'], ['/studio/work/connected-equipment/', '/work/connected-equipment']]) {
      const result = route(`https://${hostname}${path}?ref=card#contact`);
      assert.equal(result.kind, 'redirect');
      assert.equal(result.destination, `https://quinnsoftwarestudio.com${destination}?ref=card#contact`);
      assert.equal(result.status, 308);
    }
  }
});

test('Clean Studio routes use the existing static output', () => {
  assert.equal(route('https://quinnsoftwarestudio.com/privacy').destination, '/studio/privacy/index.html');
  assert.equal(route('https://quinnsoftwarestudio.com/work/connected-equipment').destination, '/studio/work/connected-equipment/index.html');
  assert.equal(route('https://quinnsoftwarestudio.com/sitemap.xml').destination, '/studio/sitemap.xml');
  assert.equal(route('https://quinnsoftwarestudio.com/sitemap-index.xml').destination, '/studio/sitemap.xml');
  assert.equal(route('https://quinnsoftwarestudio.com/robots.txt').destination, '/studio/robots.txt');
});

test('Shared assets and inquiry endpoint are never rewritten into Studio pages', () => {
  for (const hostname of ['joequinn.dev', 'quinnsoftwarestudio.com', 'joes-portfolio-preview.vercel.app']) {
    for (const path of ['/api/studio-inquiry', '/_astro/client.js', '/studio/mark.svg', '/studio/social-preview.png', '/images/joe-headshot.jpg', '/projects/range-studio/range-animation.mp4']) {
      assert.equal(route(`https://${hostname}${path}`).kind, 'file', `${hostname}${path}`);
    }
  }
});

test('www Studio domain redirects to the canonical domain', () => {
  assert.deepEqual(route('https://www.quinnsoftwarestudio.com/work/connected-equipment'), {
    kind: 'redirect', destination: 'https://quinnsoftwarestudio.com/work/connected-equipment', status: 308,
  });
});
