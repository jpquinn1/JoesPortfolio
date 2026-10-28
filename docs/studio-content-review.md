# Quinn Software Studio: content sources and review inventory

This is repository documentation for reviewing the Studio extension. Public copy uses draft positioning while avoiding invented clients, results, endorsements, or publication rights.

## Content architecture

- `/studio`: services, independent demonstration interfaces, workflow explorer, engineering capabilities, working process, founder, and contact.
- `/studio/work/operations-automation`: event intake, enrichment, deduplication, operator work queues, and professional observability experience.
- `/studio/work/connected-equipment`: equipment telemetry, device lifecycle, desired/reported state, and remote-diagnostics concepts.
- `/studio/work/site-visualization`: independent schematic site concept, with no claimed delivered commercial simulator.
- `/studio/work/sensor-visualization`: synthetic sensor/camera projection illustration, accurately labeled as prototype background.
- Existing `/`, `/resume`, personal pages, and `/projects/*` remain the career-oriented portfolio.

Editable business copy is in `src/data/studio.ts`. Case-study structure is in `src/pages/studio/work/[slug].astro`. The Studio layout and components are separate from the personal portfolio to support a later domain move.

## Sources consulted

- Owner-provided website brief and planning context: source for name, audience, Phoenix positioning, design, services, and site requirements. Planning ideas are not evidence of shipped work or commercial outcomes.
- `src/components/sections/About.astro`: TrackMan Operations Engineer; previous PGA TOUR ShotLink experience; Ohio State Computer Science & Engineering background.
- `src/consts.ts`: existing public email `joepaquinn@gmail.com` and existing portfolio links.
- `src/content/projects/grafana-zendesk-alert-automation.mdx`: event-driven alert intake, deduplication, context enrichment, dashboard, testing, and prototype diagnostic agent distinction.
- `src/content/projects/iot-edge-fleet-tooling.mdx`: device provisioning, MQTT, AWS IoT Core, device shadows, telemetry, relay workflows, and OTA tooling. Broader platform remains in development.
- `src/content/projects/broadcast-pipeline-monitor.mdx`: implemented correlation and observability tooling; cloud production hardening remains future work. Underlying broadcast systems were not built by Joe.
- `src/content/projects/radar-golf-trace-calibration.mdx`: camera calibration and projection background. Studio copy conservatively labels the work as an evolving prototype and does not promise validated accuracy or a complete automated workflow.

Source references here are limited to repository material and high-level owner context. Private conversation identifiers and research details are not part of the public documentation. Employment background does not imply employer endorsement or publication rights.

## Media inventory

- Existing founder photo: `public/images/joe-headshot.jpg`, already used in the personal portfolio. Reused as a founder portrait.
- New independent demo interfaces: created in Studio components from fictional operational records, equipment states, site geometry, and sensor trajectories. All are labeled as conceptual or synthetic; none is presented as an actual customer deployment.
- Existing employer-adjacent portfolio screenshots and videos: remain in the personal portfolio. Not imported into the Studio's hero or showcase media. Their existing presence is not taken as evidence of publication permission for new marketing use.
- Short professional demo recordings: not supplied. Record the independent browser demos or obtain publication permission before adding genuine project footage. Use short clips, explicit captions/transcripts, and no initial video download (`preload="none"`) when adding videos.
- Site imagery and terrain: schematic, independently drawn. No licensed basemap, survey accuracy, real property boundaries, radio coverage, or real customer location is claimed.
- Sensor illustration: synthetic geometry. Not evidence of calibration accuracy or a completed measurement product.

## Content to review before active promotion

- Confirm the working business name, service priorities, geographic language, and whether the founder title should remain “Founder & software engineer.” No entity registration or trademark status is asserted.
- Confirm employer/current-role wording is still current and appropriate for public business copy. Employment is background, never a Studio client relationship or endorsement.
- Confirm the public email is the desired business inbox; a dedicated domain inbox can replace it through the shared content configuration.
- Confirm desired availability, engagement minimums, support arrangements, and any pricing language before adding them. No unsupported SLA, turnaround time, warranty, project price, or availability promise is published.
- Review each case study's contribution and maturity description. Add measurable results only when documented and approved.
- Validate professional media publication rights before reusing employer-related screenshots, source code, site diagrams, recordings, logos, or customer data.
- Review the older personal calibration write-up separately for current project maturity and evidence supporting accuracy claims. This extension leaves existing portfolio content intact while supplying a qualified Studio description.
- Add genuine customer stories and testimonials only when real projects and permission exist.

## Editorial guardrails

Business applications describe possibilities. They are not claims of completed Studio client work. Services explain problems and intended usefulness before technologies. AI supports selected tasks with human review; it is not represented as autonomous operational decision-making. Metrics in fictional UI are synthetic sample data, never business-impact claims.
