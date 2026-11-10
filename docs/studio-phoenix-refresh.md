# Phoenix Studio presentation update

Reviewed November 10, 2026. The existing Astro site and Vercel deployment are retained.

## Research applied

| Source | Relevant pattern | Application |
| --- | --- | --- |
| [Nielsen Norman Group: homepage design principles](https://www.nngroup.com/articles/homepage-design-principles/) | Explain the business quickly, use concrete examples, and make the next action clear. | Short benefit headline, explicit software/automation description, operational examples, and one primary conversation CTA. |
| [AstroWind](https://github.com/arthelokyo/astrowind) | Modular hero, service, process, FAQ, and CTA sections. | Retain the existing Astro structure; clarify the engagement and answer buying questions before deeper implementation details. |
| [Astroship hero](https://github.com/surjithctly/astroship/blob/main/src/components/hero.astro) | Two-column introduction with a visual alongside brief copy. | A responsive split hero, with a quiet operational illustration instead of a large text-only opening. |
| [W3C: minimum contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | Keep readable text distinct from its background. | Pale stone page with dark text, charcoal sections with light text, and teal accents adjusted to each surface; decorative desert strokes are intentionally low contrast. |
| [W3C: pause, stop, hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) | Give users control over ongoing animation and updates. | A visible pause control, reduced-motion support, and automatic pause while the hero is offscreen or the tab is hidden. |

Templates informed layout and section patterns only. No third-party template code,
branding, testimonials, customer logos, statistics, or performance claims were copied.
AstroWind is MIT licensed; Astroship's repository is GPL-3.0. Neither is installed as
a dependency or substituted for the existing site.

## Local positioning and claims

The [City of Phoenix Legacy Small Business Program](https://www.phoenix.gov/administration/mayor/legacy-small-business-program.html)
states that businesses with fewer than 100 employees account for more than 90% of
businesses in the city. This supports a local small-business audience; it does not
establish the size of the market willing to pay for custom software, ownership
structure, or a guaranteed return on an automation project.

The headline is “Less admin. More time for your business.” Supporting copy explains
how: connected tools, fewer repeated entries, job ownership, customer updates, and
equipment alerts. These are intended benefits and service capabilities. There are
no invented hours saved, revenue lifts, client endorsements, or delivery promises.
Specific gains should be measured during a scoped pilot before being marketed as
results. Existing professional-project roles and maturity descriptions stay intact.

## Visual and interaction details

- Pale stone page background `#f3f1eb`, including the header, hero, and footer. The workflow panel, project slides, pilot, integrations, and contact sections retain neutral charcoal `#292a2d`, with raised surfaces `#303236` and `#383a3f`.
- Original Q wordmark, Inter body, JetBrains Mono headings, and restrained teal accents.
- Hand-authored SVG saguaros, a sun outline, mountain ridges, and terrain contours live in `src/components/studio/PhoenixWorkflow.astro`.
- Three examples rotate every 9.6 seconds: request → job record → team update, quote → due date → follow-up, and reading → alert → team check. Each has three animated steps and its own fictional sample metrics, labeled visibly.
- Selecting an example pauses the animation and rotation. A play/pause control resumes or freezes both. Keyboard focus in the example selectors also pauses rotation; reduced-motion preferences leave manual selection available.
- Updates are not live-region announcements. The first example's semantic steps and sample metrics remain readable without JavaScript. Motion pauses offscreen and in hidden tabs.
- No hero raster image or additional animation library is shipped.
- The full interactive workflow demo remains available under the integrations section; all five professional projects remain available.

The inquiry route, email configuration, domain routing, and deployment gates are
unchanged. UI changes are checked at desktop, tablet, and narrow phone widths,
including FAQ disclosures, the mobile menu, motion controls, and form validation.
