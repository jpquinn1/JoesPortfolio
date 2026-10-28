import test from 'node:test';
import assert from 'node:assert/strict';
import { createInquiryHandler } from '../api/studio-inquiry.js';

const valid = { name: 'Alex Morgan', company: 'Example Workshop', email: 'alex@example.com', problem: 'We need to connect our job board and equipment checks.', website: '' };
const env = { STUDIO_CONTACT_DELIVERY: 'enabled', RESEND_API_KEY: 'test-only-key', STUDIO_CONTACT_FROM: 'Studio <studio@example.com>' };
function request(body = valid, { headers = {}, method = 'POST', raw } = {}) {
  return new Request('https://joequinn.dev/api/studio-inquiry', {
    method,
    headers: { origin: 'https://joequinn.dev', 'content-type': 'application/json', ...headers },
    ...(method !== 'GET' ? { body: raw ?? JSON.stringify(body) } : {}),
  });
}

test('a valid inquiry sends only to the configured owner, preserves literal content, and sets reply-to', async () => {
  let sent;
  const handler = createInquiryHandler({ env, fetchImpl: async (url, options) => {
    sent = { url, options, body: JSON.parse(options.body) };
    return Response.json({ id: 'mail-123' });
  } });
  const response = await handler(request({ ...valid, problem: '<script>Example</script> & a job workflow that needs help.', to: 'attacker@example.com' }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(sent.url, 'https://api.resend.com/emails');
  assert.deepEqual(sent.body.to, ['joepaquinn@gmail.com']);
  assert.equal(sent.body.reply_to, valid.email);
  assert.ok(sent.body.text.includes('<script>Example</script>'));
  assert.equal(sent.body.html, undefined);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('invalid inputs, honeypots, and email-header injection never call the provider', async () => {
  const invalidBodies = [
    null, [], { ...valid, website: 'spam.example' }, { ...valid, email: 'alex@example.com\r\nBcc:other@example.com' },
    { ...valid, name: 'Alex\nInjected' }, { ...valid, company: 'Bad\rCompany' }, { ...valid, name: '  ' },
    { ...valid, problem: 'too short' }, { ...valid, problem: 'x'.repeat(4001) }, { ...valid, name: ['Alex'] },
  ];
  for (const body of invalidBodies) {
    const handler = createInquiryHandler({ env, fetchImpl: async () => { assert.fail('Invalid input reached delivery'); } });
    assert.equal((await handler(request(body))).status, 400);
  }
});

test('disallowed origins, missing origins, wrong content types, and methods are rejected', async () => {
  const handler = createInquiryHandler({ env, fetchImpl: async () => { assert.fail('Disallowed request reached delivery'); } });
  assert.equal((await handler(request(valid, { headers: { origin: 'https://unrelated.example' } }))).status, 403);
  assert.equal((await handler(request(valid, { headers: { origin: '' } }))).status, 403);
  assert.equal((await handler(request(valid, { headers: { 'content-type': 'text/plain' } }))).status, 415);
  const response = await handler(request(valid, { method: 'GET' }));
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'POST');
});

test('malformed JSON and oversized bodies are rejected before delivery', async () => {
  const handler = createInquiryHandler({ env, fetchImpl: async () => { assert.fail('Malformed request reached delivery'); } });
  assert.equal((await handler(request(valid, { raw: '{"name":' }))).status, 400);
  assert.equal((await handler(request(valid, { raw: 'x'.repeat(16_385) }))).status, 413);
  assert.equal((await handler(request(valid, { headers: { 'content-length': '20000' } }))).status, 413);
});

test('missing configuration, rejection, missing receipt, and network failure cannot produce success', async () => {
  const unconfigured = createInquiryHandler({ env: {}, fetchImpl: async () => { assert.fail('Missing config reached provider'); } });
  assert.equal((await unconfigured(request())).status, 503);
  for (const fetchImpl of [
    async () => Response.json({ message: 'provider error' }, { status: 422 }),
    async () => Response.json({}),
    async () => { throw new Error('timeout'); },
  ]) {
    const response = await createInquiryHandler({ env, fetchImpl })(request());
    assert.equal(response.status, 502);
    assert.equal((await response.json()).ok, false);
  }
});

test('credentials alone cannot enable delivery while email-draft mode is selected', async () => {
  for (const setting of [undefined, '', 'disabled']) {
    const handler = createInquiryHandler({
      env: { ...env, STUDIO_CONTACT_DELIVERY: setting },
      fetchImpl: async () => { assert.fail('Disabled delivery reached provider'); },
    });
    const response = await handler(request());
    assert.equal(response.status, 503);
    assert.equal((await response.json()).ok, false);
  }
});

test('retries of an identical inquiry use the same provider idempotency key', async () => {
  const keys = [];
  const handler = createInquiryHandler({ env, now: () => 100_000, fetchImpl: async (_, options) => {
    keys.push(options.headers['Idempotency-Key']);
    return Response.json({ id: 'mail-123' });
  } });
  await handler(request());
  await handler(request());
  await handler(request({ ...valid, problem: 'A different problem with our maintenance handover process.' }));
  assert.equal(keys[0], keys[1]);
  assert.notEqual(keys[0], keys[2]);
});

test('the local abuse guard blocks bursts and expires the window', async () => {
  let time = 100_000;
  let deliveries = 0;
  const handler = createInquiryHandler({ env, now: () => time, fetchImpl: async () => {
    deliveries++;
    return Response.json({ id: 'mail-123' });
  } });
  for (let index = 0; index < 5; index++) assert.equal((await handler(request())).status, 200);
  const blocked = await handler(request());
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get('retry-after'), '900');
  assert.equal(deliveries, 5);
  time += 900_001;
  assert.equal((await handler(request())).status, 200);
});
