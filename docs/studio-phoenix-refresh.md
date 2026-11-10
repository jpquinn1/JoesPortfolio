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
| [Nielsen Norman Group: how users read on the web](https://www.nngroup.com/articles/how-users-read-on-the-web/) | People scan; meaningful headings and concise copy help them find relevant information. | Shorter hero, service, project, and pilot descriptions; larger explanatory text and specific outcome headings. |
| [Nielsen Norman Group: progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/) | Show essential information first and keep secondary detail available on demand. | The engagement and work examples precede expandable tooling, connections, and deeper workflow details. |
| [Nielsen Norman Group: animation for a purpose](https://www.nngroup.com/articles/animation-purpose-ux/) | Motion should communicate feedback or change, with restrained timing and scope. | Scroll position controls the sun; brief section entrances and hover feedback support navigation. Ambient sensor pulses stay in the decorative landscape. |
| [W3C: animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | Nonessential animation triggered by interaction should be disableable. | Reduced-motion preferences stop scroll-linked sun movement and entrance animations. A separate scene control freezes the sun, sensor pulses, and sample counter. |

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
- `DesertScene.astro` provides one fixed decorative backdrop across the pale stone sections. Saguaros have stronger sage outlines and soft fills; mountains use faint sand fills. A separate narrow composition keeps the scene visible on phones. The SVG is hidden from assistive technology and cannot intercept clicks.
- The warm sun follows page scroll progress, setting into the mountain haze toward the bottom and rising when scrolling upward. Updates use a passive scroll listener and one requested animation frame; no continuous JavaScript animation loop or extra dependency is added.
- Small sensor nodes pulse and a packet travels along a landscape route. A visibly labeled demo strip shows a simulated sun angle and sample packet count; these are neither live weather nor business-performance metrics. Pause scene freezes the sun, sensor effects, service pulse, and counter. Hidden tabs stop updates, and reduced-motion preferences leave the scene static.
- Larger service descriptions and concise pilot steps make the main offer easier to scan. The connections diagram and deeper tooling information live in native expandable sections, preserving access without requiring visitors to read them in sequence.
- Cards and pilot steps enter once with a short, low-distance transition. Content stays visible if JavaScript is unavailable; reduced-motion and scene-pause settings disable the entrances.
- Three examples rotate every 9.6 seconds: request → job record → team update, quote → due date → follow-up, and reading → alert → team check. Each has three animated steps and its own fictional sample metrics, labeled visibly.
- Selecting an example pauses the animation and rotation. A play/pause control resumes or freezes both. Keyboard focus in the example selectors also pauses rotation; reduced-motion preferences leave manual selection available.
- Updates are not live-region announcements. The first example's semantic steps and sample metrics remain readable without JavaScript. Motion pauses offscreen and in hidden tabs.
- No hero raster image or additional animation library is shipped.
- The full interactive workflow demo remains available under the integrations section; all five professional projects remain available.

The inquiry route, email configuration, domain routing, and deployment gates are
unchanged. UI checks cover desktop, tablet, and narrow phone widths; up/down sun
movement and pause/resume; FAQ and connections disclosures; project carousel
buttons and keyboard navigation; the mobile menu; and empty-form validation.
Existing automated tests, the production build, and Studio output checks remain
the deployment gates. These design patterns are not a claim of measured conversion
improvement; that would require real visitor data.
