# Studio domain and deployment

The portfolio and Quinn Software Studio share the existing Vercel project,
[`joequinn/joes-portfolio`](https://vercel.com/joequinn/joes-portfolio), connected to
[`jpquinn1/JoesPortfolio`](https://github.com/jpquinn1/JoesPortfolio).
No second hosting project, paid hosting add-on, or deployment token is needed.

## Public addresses

- `https://joequinn.dev/` remains the personal portfolio.
- `https://quinnsoftwarestudio.com/` serves the existing Studio build at `/studio`.
- Studio case studies use `/work/<slug>` and privacy uses `/privacy` on the Studio domain.
- `www.quinnsoftwarestudio.com` redirects to the apex domain.
- Old `/studio`, `/studio/privacy`, and `/studio/work/<slug>` links on the portfolio domain permanently redirect to their new addresses. Verify query-string and browser-fragment handling during the live cutover; local routing tests cover paths and host isolation.

`vercel.json` scopes these routes by hostname and runs them **before** the
filesystem phase. This ordering is required: the ordinary `rewrites` setting is
a fallback after static-file lookup, which would let the portfolio's existing
`index.html` and robots file shadow the Studio routes. Explicit static-file
destinations also avoid redirecting an internal rewrite back to itself.
The configuration deliberately leaves shared
assets (`/_astro`, `/images`, `/projects`, `/studio/*.svg`, and other media) and
`/api/studio-inquiry` at their existing paths. The API runs as a Vercel Node
function independently of Astro's static output.

`src/lib/studio-urls.ts` generates the correct public links. Local Astro development
and Vercel preview builds keep links in the preview so review does not jump into
production. Production Studio canonical, Open Graph, and structured data URLs use
the new domain. The Studio has a separate sitemap and robots response; the
portfolio sitemap excludes moved Studio pages.

## Domain cutover

Complete these account-side steps before publishing the permanent old-domain redirects:

1. In the existing Vercel project's **Settings → Domains**, add
   `quinnsoftwarestudio.com` and `www.quinnsoftwarestudio.com` to Production.
2. Copy the exact A/CNAME values Vercel shows for that project into Namecheap's
   **Advanced DNS**. Replace the parking records only: the `@` URL Redirect
   Record and `www` parking CNAME.
3. Preserve the Google Workspace MX record, Google verification TXT record,
   SPF TXT record, and `google._domainkey` DKIM record. Keep Namecheap's existing
   nameservers; a nameserver migration is unnecessary.
4. Verify both domains in Vercel, publish the tested commit, and confirm TLS and
   the public root, privacy, case-study, sitemap, and API routes.

The Vercel dashboard is authoritative for the project's DNS targets; do not copy
an IP address or CNAME from an unrelated project or an old tutorial.

## CI/CD

`.github/workflows/site-checks.yml` runs on pull requests and pushes to `main`:

1. Install the lockfile with Node 22 and `npm ci`.
2. Run the inquiry-handler and hostname-routing tests.
3. Build both sites.
4. Check generated canonicals, sitemap separation, public links, and assets.

The existing Vercel Git integration supplies preview deployments and deploys
`main` to production. `vercel.json` runs the same tests and output checks as part
of the Vercel build, so a failing check prevents that deployment from publishing.
Production builds also require `STUDIO_CONTACT_DELIVERY=enabled`, a nonempty
`RESEND_API_KEY`, and `STUDIO_CONTACT_FROM`. Missing configuration blocks
publication and reports only the missing variable names. Local and preview builds
can validate the site without email secrets.
There is no second GitHub Actions deploy job and no duplicate deploy credential.

Run the complete local verification with:

```sh
node --test tests/*.test.js
npm run build
node scripts/check-studio-build.mjs
```

Start the development server with `npm run dev -- --background`. Manage it with
`npm run astro -- dev status`, `npm run astro -- dev logs`, and
`npm run astro -- dev stop`. Astro's development server does not execute root
Vercel functions; inquiry delivery must also be tested on Vercel.

## Notification configuration

See [studio-contact.md](studio-contact.md) for the server-side email settings and
delivery test. Set secrets in Vercel, never in Git or a `PUBLIC_` variable. A build
passing without email credentials verifies the site but does not prove inbox
delivery. The public inquiry test must confirm both the form's confirmation and
arrival in Joe's intended inbox.

## Recovery

Use Vercel's deployment rollback to restore a previous known-good release. Once
the domain cutover is live, prefer a release that already has the hostname routes;
reverting to an older portfolio-only build would show the personal home page on
the Studio domain. Mail DNS should remain unchanged during website rollback.

References: [Vercel hostname rewrites](https://vercel.com/docs/routing/rewrites),
[custom domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain),
[GitHub deployment integration](https://vercel.com/docs/git/vercel-for-github).
