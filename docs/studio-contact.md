# Studio contact delivery

The existing public contact address is `joepaquinn@gmail.com`, sourced from `src/consts.ts`.

## Current behavior

The user approved an email-draft form for the initial launch. It validates the visitor's details, prepares a complete message, and offers **Open email app** and **Copy message**. The interface explicitly says that the draft has not been sent. This is a working direct-contact path, but it is not server-delivered form submission. JavaScript-disabled visitors receive the direct email address.

For future direct delivery, `STUDIO_CONTACT_DELIVERY=enabled`, `RESEND_API_KEY`, and `STUDIO_CONTACT_FROM` must be available during the Astro build before the form enables submission to `/api/studio-inquiry`. The Vercel Node function sends a plain-text inquiry through Resend to the owner. A success state requires a successful provider response containing a message ID; this confirms provider acceptance, not arrival in the owner's inbox. Delivery failures preserve the visitor's text and reveal the same email-draft fallback. Credentials alone do not change the approved launch behavior.

No delivery credentials, sender-domain verification, or inbox delivery were available to verify during implementation. Do not mark server delivery as operational until the configuration and an owner-authorized inbox test are complete.

## Enable server delivery

Set these variables in the existing Vercel project's production environment, then rebuild and redeploy:

- `RESEND_API_KEY`: server-only Resend sending API key.
- `STUDIO_CONTACT_FROM`: a sender authorized for the verified Resend domain, for example `Quinn Software Studio <inquiries@your-verified-domain>`.
- `STUDIO_CONTACT_DELIVERY`: set to `enabled` only when intentionally switching from the approved email-draft launch flow to direct delivery.
- `STUDIO_CONTACT_TO` (optional): owner inbox; defaults to the existing Gmail address.
- `STUDIO_CONTACT_ORIGINS` (optional): comma-separated additional exact origins for a future Studio domain. The current request origin and existing portfolio domains are accepted by default.

Do not prefix secrets with `PUBLIC_`, commit credentials, or use the visitor's address as the sender. The visitor's address belongs in `reply_to`.

The function uses the Vercel Node `fetch` export in root `api/`, independent of Astro's static output. No Astro server adapter or email SDK is required. Verify `/api/studio-inquiry` exists after deploying; a GET should return HTTP 405 with `Allow: POST`. Astro's local development server does not run root Vercel functions. Use Vercel's local runtime for integrated server delivery testing, or the isolated tests below.

## Abuse protection and privacy

The function requires same-origin JSON submissions, validates field types and lengths, bounds the streamed request body to 16 KiB, rejects the hidden honeypot, uses provider idempotency keys, and applies a bounded process-local burst limit. The local limiter is best-effort and resets when a server instance restarts; it is not a distributed rate limiter. Configure a Vercel Firewall rate-limit rule for POST `/api/studio-inquiry` before widely advertising the site. A CAPTCHA is not currently used.

Contact text is sent as plain text. The recipient is server-configured. Request bodies, contact details, provider responses, and credentials are never logged by this function. Resend and the receiving email service process the inquiry; do not promise zero third-party handling. The email-draft mode sends no inquiry content to the website server.

## Verification

Run `node --test tests/studio-inquiry.test.js`. These tests use injected provider responses and send no emails. They cover recipient control, header-injection rejection, invalid input, request size, origin and method restrictions, provider failures, idempotent retries, and the local abuse window.

After credentials are configured, perform one expressly authorized test inquiry and confirm arrival, reply-to behavior, and error fallback. Do not repeatedly submit tests to the actual inbox during automated QA.

Reference: [Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js), [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email).
