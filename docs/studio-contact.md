# Studio contact delivery

The Studio’s public contact and default notification address is `joe@quinnsoftwarestudio.com`, defined in `src/data/studio.ts`. Personal portfolio contact details remain separate.

## Visitor flow

**Send inquiry** submits directly to `/api/studio-inquiry`. The form asks for a name, email, a short workflow description, and an optional company. It explains that Joe will reply to arrange a conversation; submitting does not commit the visitor to a paid engagement.

A success message appears only after the server receives a successful Resend response containing a message ID. This confirms provider acceptance, not delivery to the inbox. On failure or timeout, the entered text stays in the form and an email fallback offers **Open email app** and **Copy message**. Visitors without JavaScript get the business email address. No form details are saved to browser storage or analytics.

## Production configuration

Set these variables in the existing `joes-portfolio` Vercel project’s **Production** environment:

- `RESEND_API_KEY`: server-only sending key for the verified Studio sender domain.
- `STUDIO_CONTACT_FROM`: `Quinn Software Studio <inquiries@notify.quinnsoftwarestudio.com>`.
- `STUDIO_CONTACT_DELIVERY`: `enabled`.
- `STUDIO_CONTACT_TO`: `joe@quinnsoftwarestudio.com` (also the runtime default).
- `STUDIO_CONTACT_ORIGINS`: optional comma-separated additional exact origins. Both Studio domains, both portfolio domains, and the current request origin are accepted already.

The frontend does not depend on build-time email credentials. The runtime delivery switch allows delivery to be turned off without pretending a message was sent. Production builds check that required delivery configuration is present; local and preview builds can be verified without credentials. Environment changes require a new Vercel deployment to take effect.

Keep secrets server-only; never use a `PUBLIC_` prefix or commit them. The visitor’s address is the reply-to address, never the sender or notification destination. A forged recipient field in a request cannot redirect notification mail.

The Vercel Node function lives in root `api/` independently of Astro’s static build. An Astro server adapter and email SDK are not required. GET `/api/studio-inquiry` should return HTTP 405 with `Allow: POST`. The Astro dev server does not run root Vercel functions.

## Sender setup and verification

1. Verify the sending domain in Resend and add the exact DNS records it provides. Preserve Google Workspace MX, SPF, DKIM, and ownership-verification records. Resend’s sending records must coexist with Workspace; do not replace the inbound mailbox’s MX records.
2. Add the production environment variables above and deploy.
3. Submit one clearly labeled test inquiry to the business inbox. Check the displayed confirmation, the message’s arrival, and its reply-to address. Provider acceptance alone is not sufficient to mark inbox delivery verified.
4. Check the Resend delivery log if a message is delayed or bounces. Keep the email fallback available.

## Abuse protection

The function requires same-origin JSON, validates field types and lengths, bounds the request body to 16 KiB, rejects the hidden honeypot, uses provider idempotency keys, and applies a bounded per-instance rate limit. The limiter resets when an instance restarts and is not shared across instances. A Vercel Firewall rate-limit rule for POST `/api/studio-inquiry` can provide shared protection.

Inquiry content is sent as plain text. The function does not log form bodies, email addresses, provider responses, or credentials. Resend and the receiving mail provider process the inquiry as described by the privacy page.

## Checks

Run `node --test tests/studio-inquiry.test.js`. These tests do not send email. They cover recipient control, reply-to, invalid inputs, body limits, origins, provider failures, configuration, idempotent retries, and rate limiting.

Browser QA on November 10, 2026 exercised the real function with an injected provider response: success confirmation, retained text and email fallback on failure, and the mobile layout at 390px and 320px. The verified sender uses `notify.quinnsoftwarestudio.com`; its sending-only key is restricted to that subdomain. Actual inbox delivery must be verified separately after deployment using the procedure above.

References: [Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js), [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email).
