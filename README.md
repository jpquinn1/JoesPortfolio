# Joe Quinn’s portfolio

[joequinn.dev](https://joequinn.dev/) is Joe’s personal portfolio. Project case studies, the résumé, and the Life pages build in this repository. [Quinn Software Studio](https://github.com/jpquinn1/QuinnSoftwareStudio) owns the business website and inquiry function.

Use Node 22.12 or newer in the Node 22 line. Run `npm ci` and `npm run dev -- --background` to start the site. Run `npm run check` to build the portfolio and verify its generated pages, links and sitemap.

The [joequinn-dev Vercel project](https://vercel.com/joequinn/joequinn-dev) builds previews for pull requests and deploys `main` to production. GitHub Actions and Vercel both run `npm run check`. Old `/studio` links redirect to the corresponding business pages, and the former inquiry endpoint forwards requests to the studio. Portfolio builds require no studio email credentials. To roll back a release, promote a known-good portfolio deployment in this project.
