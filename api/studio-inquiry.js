import { createHash } from 'node:crypto';

const BODY_LIMIT = 16_384;
const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 5;
const EMAIL = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;

function reply(status, message, extraHeaders = {}) {
  return Response.json({ ok: status === 200, message }, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extraHeaders },
  });
}

async function readBody(request) {
  const declaredSize = Number(request.headers.get('content-length') || 0);
  if (declaredSize > BODY_LIMIT) throw new RangeError('body too large');
  if (!request.body) throw new SyntaxError('missing body');
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > BODY_LIMIT) {
      await reader.cancel();
      throw new RangeError('body too large');
    }
    chunks.push(Buffer.from(value));
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export function validateInquiry(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  if (body.website) return null;
  for (const key of ['name', 'company', 'email', 'problem']) {
    if (typeof body[key] !== 'string') return null;
  }
  const inquiry = {
    name: body.name.trim(),
    company: body.company.trim(),
    email: body.email.trim(),
    problem: body.problem.trim(),
  };
  if (inquiry.name.length < 2 || inquiry.name.length > 100 || /[\r\n\x00]/.test(inquiry.name)) return null;
  if (inquiry.company.length > 160 || /[\r\n\x00]/.test(inquiry.company)) return null;
  if (inquiry.email.length > 254 || !EMAIL.test(inquiry.email)) return null;
  if (inquiry.problem.length < 20 || inquiry.problem.length > 4000 || inquiry.problem.includes('\x00')) return null;
  return inquiry;
}

// The injected dependencies make provider failures testable without sending mail.
export function createInquiryHandler({ env = process.env, fetchImpl = fetch, now = Date.now } = {}) {
  const attempts = new Map();

  return async function handleInquiry(request) {
    if (request.method !== 'POST') return reply(405, 'Use the contact form to send an inquiry.', { Allow: 'POST' });
    const origin = request.headers.get('origin');
    const allowedOrigins = new Set([
      new URL(request.url).origin,
      'https://joequinn.dev',
      'https://www.joequinn.dev',
      ...(env.STUDIO_CONTACT_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean),
    ]);
    if (!origin || !allowedOrigins.has(origin)) return reply(403, 'Please send your inquiry from this website.');
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
      return reply(415, 'Please use the contact form, or email Joe directly.');
    }

    // A bounded, per-instance abuse guard. Use a Vercel Firewall rate-limit rule
    // as the shared protection across instances; see docs/studio-contact.md.
    const ip = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || 'unknown';
    const identity = createHash('sha256').update(ip).digest('hex');
    const time = now();
    for (const [key, entry] of attempts) if (entry.until <= time) attempts.delete(key);
    const entry = attempts.get(identity) || { count: 0, until: time + WINDOW_MS };
    if (entry.count >= MAX_ATTEMPTS) return reply(429, 'Please wait a few minutes, or email Joe directly.', { 'Retry-After': String(Math.ceil((entry.until - time) / 1000)) });
    if (attempts.size >= 5000 && !attempts.has(identity)) return reply(429, 'Please try again later, or email Joe directly.', { 'Retry-After': '900' });
    entry.count += 1;
    attempts.set(identity, entry);

    let body;
    try { body = await readBody(request); }
    catch (error) {
      return error instanceof RangeError
        ? reply(413, 'Please shorten your inquiry and try again.')
        : reply(400, 'Please check your information and try again.');
    }
    const inquiry = validateInquiry(body);
    if (!inquiry) return reply(400, 'Please provide your name, a valid email, and a problem description of 20–4,000 characters.');
    if (env.STUDIO_CONTACT_DELIVERY !== 'enabled' || !env.RESEND_API_KEY || !env.STUDIO_CONTACT_FROM) {
      return reply(503, 'Online delivery is not available yet. Please use the email option below.');
    }

    const content = `New project inquiry — Quinn Software Studio\n\nName: ${inquiry.name}\nCompany: ${inquiry.company || 'Not provided'}\nEmail: ${inquiry.email}\n\nWhat needs to work better:\n${inquiry.problem}`;
    // Retry identical content safely even after an interrupted browser request.
    const idempotencyKey = createHash('sha256').update(JSON.stringify(inquiry) + ':' + Math.floor(time / 86_400_000)).digest('hex');
    try {
      const result = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `studio-${idempotencyKey}`,
        },
        body: JSON.stringify({
          from: env.STUDIO_CONTACT_FROM,
          to: [env.STUDIO_CONTACT_TO || 'joepaquinn@gmail.com'],
          reply_to: inquiry.email,
          subject: `Studio project inquiry from ${inquiry.name}`,
          text: content,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!result.ok) return reply(502, 'Your inquiry could not be sent. Your text is still here; please use the email option below.');
      const receipt = await result.json();
      if (typeof receipt.id !== 'string' || !receipt.id) return reply(502, 'Delivery could not be confirmed. Please use the email option below.');
      return reply(200, 'Your inquiry has been sent. Thanks for sharing what you are working on — Joe will reply by email.');
    } catch {
      // Never log contact details, request bodies, provider responses, or credentials.
      return reply(502, 'Delivery could not be confirmed. Your text is still here; please use the email option below.');
    }
  };
}

export default { fetch: createInquiryHandler() };
