import { SOCIALS } from '../consts';

/**
 * Studio copy lives here so it can be reviewed without editing page components.
 * Sources and publication review items: docs/studio-content-review.md.
 * Employer experience is background, never a Studio client or endorsement claim.
 */
export const brand = {
  name: 'Quinn Software Studio',
  headline: 'Software that makes operations run better.',
  description:
    'Custom applications, practical automation, and connected systems built around the way your business actually works.',
  location: 'Phoenix, Arizona',
  locationLine:
    'Independent software engineering based in Phoenix, Arizona. Working with businesses locally and beyond.',
  basePath: '/studio',
};

export const contact = {
  email: SOCIALS.email.replace('mailto:', ''),
  emailHref: SOCIALS.email,
};

export const founder = {
  name: 'Joe Quinn',
  role: 'Founder & software engineer',
  intro: 'Software experience. Real-world perspective.',
  paragraphs: [
    'I’m Joe, a computer science and engineering graduate who builds software and understands the operations around it. My experience spans applications, cloud services, live production systems, networking, and equipment in the field.',
    'As an Operations Engineer at TrackMan, and previously working with PGA TOUR ShotLink, I’ve seen what happens when software meets real hardware, changing conditions, and people who need things to work.',
    'Quinn Software Studio brings that perspective to businesses that need a hands-on engineering partner. You work directly with me, from understanding the problem through building and improving the solution.',
  ],
  education: 'Computer Science & Engineering · The Ohio State University',
  experience: ['TrackMan · Operations Engineer', 'PGA TOUR ShotLink · Field systems & operations'],
  image: '/images/joe-headshot.jpg',
  portfolioHref: '/',
};

export const services = [
  {
    number: '01',
    id: 'custom-software',
    title: 'Custom Software',
    problem: 'Your process has outgrown the spreadsheet.',
    description:
      'Give your team a clear place to manage work, see what needs attention, and keep information connected. Build the tool around your operation, with the views and permissions each person needs.',
    outcome: 'One place to work. Fewer things falling through the cracks.',
    examples: ['Internal applications', 'Operations dashboards', 'Customer portals', 'Job & inventory tracking'],
  },
  {
    number: '02',
    id: 'workflow-automation',
    title: 'Workflow Automation & AI',
    problem: 'The same information gets typed in again. And again.',
    description:
      'Connect intake, documents, approvals, and follow-ups into a repeatable workflow. Use AI where it helps interpret messy information, with human review where the decision matters.',
    outcome: 'Less repetitive admin. A clear path for exceptions.',
    examples: ['Document & email intake', 'Approval workflows', 'Assisted drafting', 'Follow-up automation'],
  },
  {
    number: '03',
    id: 'systems-integration',
    title: 'Systems Integration',
    problem: 'Your tools work. They just don’t work together.',
    description:
      'Move information between the systems you already use. Connect APIs, cloud services, and business software with validation, error handling, and visibility into what succeeded.',
    outcome: 'Connected information without rebuilding everything.',
    examples: ['API integrations', 'Data synchronization', 'Cloud services', 'Reporting pipelines'],
  },
  {
    number: '04',
    id: 'connected-systems',
    title: 'Connected Systems & IoT',
    problem: 'You find out equipment has a problem after work stops.',
    description:
      'Bring equipment status, sensor readings, and operational events into a useful view. Make it easier to spot stale data, investigate faults, and plan the next action.',
    outcome: 'A clearer picture of what is happening in the field.',
    examples: ['Equipment monitoring', 'Device telemetry', 'Remote diagnostics', 'Operator interfaces'],
  },
];

export const process = [
  {
    number: '01',
    title: 'Understand the problem',
    description:
      'Walk through how work happens today: the people, tools, handoffs, and frustrating bits. Start with a specific problem worth solving.',
  },
  {
    number: '02',
    title: 'Define & prototype',
    description:
      'Agree on a practical scope and clear priorities. Put an early version in front of the people who will use it before committing to the full build.',
  },
  {
    number: '03',
    title: 'Build, test & deploy',
    description:
      'Build in reviewable stages, test the important workflows, and plan the rollout. Keep communication direct and changes to scope explicit.',
  },
  {
    number: '04',
    title: 'Support & improve',
    description:
      'Document the system, make failures visible, and agree on ongoing support. Improve what matters as the business and its needs change.',
  },
];

export type DemoVariant = 'operations' | 'equipment' | 'site' | 'vision';

export interface StudioCaseStudy {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  summary: string;
  variant: DemoVariant;
  category: string;
  status: string;
  tags: string[];
  problem: string;
  approach: string[];
  demoDescription: string;
  demonstratedCapability: string;
  applications: string[];
  technicalNotes: string[];
  experienceNote: string;
  relatedPortfolio: { label: string; href: string }[];
}

export const caseStudies: StudioCaseStudy[] = [
  {
    slug: 'operations-automation',
    number: '01',
    title: 'From scattered alerts to actionable work.',
    shortTitle: 'Operations & Incident Automation',
    summary:
      'Turn operational events into organized work: add context, group repeated signals, and show the next action in a clear dashboard.',
    variant: 'operations',
    category: 'Automation / Operational visibility',
    status: 'Independent concept demo',
    tags: ['Event-driven workflows', 'Dashboards', 'Human review'],
    problem:
      'A stream of notifications is not the same as a useful work queue. Repeated alerts, missing context, and disconnected tools leave people looking through logs and copying information before they can start solving the problem.',
    approach: [
      'Capture an event and validate the information at the point it enters the system.',
      'Separate event intake from slower downstream work, so a delayed integration does not hold up every new event.',
      'Group repeated signals around a stable issue, add equipment or customer context, and create an actionable record.',
      'Show status, ownership, and exceptions in an operator-facing view. Keep consequential decisions, such as closing a support issue, under human control.',
    ],
    demoDescription:
      'The independently built interface uses fictional jobs and operational states to illustrate a shared work queue. It is a browser demonstration, with no connection to an employer system or live customer account.',
    demonstratedCapability:
      'Making operational information understandable and traceable: an event has a source, a useful record, a visible state, and a place for someone to act. The demo communicates the interface pattern; the underlying experience includes alert enrichment, deduplication, and ticket-state synchronization.',
    applications: [
      'Repair-shop intake and service requests',
      'Maintenance alerts routed to a work queue',
      'Order-processing exceptions and follow-ups',
      'Internal support and incident coordination',
    ],
    technicalNotes: [
      'Relevant experience includes Python, AWS Lambda, API Gateway, SQS, DynamoDB, FastAPI, and React/TypeScript.',
      'Production designs need retry handling, idempotency, access controls, and monitoring of failed work—not only a successful-path integration.',
      'AI-assisted diagnosis and document interpretation are possible extensions. Earlier diagnostic-agent work was a prototype, not a claimed production deployment.',
    ],
    experienceNote:
      'Informed by professional operations and observability work documented in Joe’s technical portfolio. This is not a Quinn Software Studio client engagement, and no employer endorsement is implied.',
    relatedPortfolio: [
      { label: 'Alert automation engineering', href: '/projects/grafana-zendesk-alert-automation' },
      { label: 'Real-time pipeline monitoring', href: '/projects/broadcast-pipeline-monitor' },
    ],
  },
  {
    slug: 'connected-equipment',
    number: '02',
    title: 'Know what is happening beyond the screen.',
    shortTitle: 'Connected Equipment & IoT',
    summary:
      'Bring device health, telemetry, and connectivity into one view so operators can recognize a problem and investigate it with context.',
    variant: 'equipment',
    category: 'Connected systems / Remote diagnostics',
    status: 'Independent concept demo',
    tags: ['Device telemetry', 'Fleet health', 'Remote diagnostics'],
    problem:
      'Equipment can be spread across a building, a site, or many locations. When its software, power, or network changes, an operator needs to know whether the readings are current, which device is affected, and what to check next.',
    approach: [
      'Give each device an identity and a repeatable provisioning and configuration process.',
      'Collect meaningful telemetry with timestamps and connectivity status, so an old reading cannot masquerade as a healthy device.',
      'Keep requested configuration separate from the state the device actually reports. Treat command acknowledgement as part of the workflow.',
      'Provide an operator view that supports diagnosis, controlled changes, and investigation of offline or unhealthy equipment.',
    ],
    demoDescription:
      'A fictional equipment dashboard illustrates device health and telemetry. All names, statuses, and readings are synthetic. This page neither controls physical equipment nor connects to an operational fleet.',
    demonstratedCapability:
      'Connecting physical systems to usable software, while making uncertainty visible. The underlying engineering experience spans device provisioning, cloud configuration, telemetry, relay workflows, and staged update tooling; the public demo illustrates an operator interface.',
    applications: [
      'Distributed equipment and environmental monitoring',
      'Warehouse and workshop operational visibility',
      'Service-company remote diagnostics',
      'Field-device configuration and maintenance planning',
    ],
    technicalNotes: [
      'Relevant experience includes Raspberry Pi, Python, Linux/systemd, MQTT, AWS IoT Core, device shadows, and TypeScript tooling.',
      'Field work includes GPIO relay control, temperature and humidity readings, power data, and cloud-managed device configuration.',
      'A real installation needs site-specific safety constraints, authorization, network design, and defined offline behavior before any remote-control features are enabled.',
    ],
    experienceNote:
      'Informed by professional field-device and IoT engineering experience. The Studio interface is independently reconstructed and is not an employer dashboard or evidence of a Studio client installation.',
    relatedPortfolio: [
      { label: 'Edge fleet tooling & AWS IoT', href: '/projects/iot-edge-fleet-tooling' },
    ],
  },
  {
    slug: 'site-visualization',
    number: '03',
    title: 'See the site. Understand the system.',
    shortTitle: '3D Site & Range Visualization',
    summary:
      'Make spatial information easier to discuss with a clear view of a site, its equipment, and the relationships between them.',
    variant: 'site',
    category: 'Spatial interfaces / Planning tools',
    status: 'Independent concept demo',
    tags: ['Spatial visualization', 'Site layouts', 'Planning interfaces'],
    problem:
      'A spreadsheet of positions or a folder of diagrams can be difficult to relate to the real site. People planning equipment placement or explaining a layout need a shared picture of the space and its constraints.',
    approach: [
      'Put site geometry, relevant equipment, and reference points into one consistent coordinate system.',
      'Use a visual hierarchy to distinguish physical layout, equipment positions, and explanatory overlays.',
      'Pair the spatial view with plain-language context so a nontechnical operator can understand what the view represents.',
      'Keep measured geometry, assumptions, and illustrative content distinct; validate any real-world planning decisions against appropriate site data.',
    ],
    demoDescription:
      'An independently drawn site concept shows how terrain-like geometry and equipment placement can be presented together. The layout is fictional and is not a survey, live simulator, coverage calculation, or customer site.',
    demonstratedCapability:
      'Translating spatial and equipment information into an interface people can reason about. This concept draws on 3D visualization and range-planning interests; it does not claim a delivered commercial planning platform or validated site engineering.',
    applications: [
      'Equipment-placement discussions',
      'Interactive facility and site explanations',
      'Spatial dashboards for field operations',
      'Prototype interfaces for planning and simulation',
    ],
    technicalNotes: [
      'Relevant areas include TypeScript, React, Three.js, coordinate transforms, and geospatial-data visualization.',
      'Terrain, maps, and site measurements would require appropriate source data and licensing for a real customer deployment.',
      'This public concept is schematic. It does not reproduce Range Studio, SimTool, proprietary site models, or employer-owned screenshots.',
    ],
    experienceNote:
      'A conceptual demonstration informed by Joe’s spatial-interface and field-systems background. Specific commercial outcomes, publication rights for professional tools, and production maturity are not asserted.',
    relatedPortfolio: [
      { label: '3D calibration workspace background', href: '/projects/radar-golf-trace-calibration' },
    ],
  },
  {
    slug: 'sensor-visualization',
    number: '04',
    title: 'Make sensor data visible in context.',
    shortTitle: 'Computer Vision & Sensor Visualization',
    summary:
      'Explore how camera geometry and sensor coordinates come together to explain movement, alignment, and the physical world.',
    variant: 'vision',
    category: 'Computer vision / Technical prototyping',
    status: 'Prototype background · concept demo',
    tags: ['Camera calibration', '3D projection', 'Sensor visualization'],
    problem:
      'A sensor can measure a position in three dimensions while a camera records pixels. Connecting those views requires an explicit relationship between the sensor, the camera lens, and the physical scene.',
    approach: [
      'Calibrate the lens to understand focal length, image center, and distortion for a specific camera configuration.',
      'Establish the camera’s position and orientation relative to the sensor using measured reference geometry.',
      'Transform sensor points into the camera coordinate frame, project them into the image, and account for display scaling and timing.',
      'Inspect the projection with reference points and a 3D workspace, making alignment errors visible before interpreting the result.',
    ],
    demoDescription:
      'A synthetic trajectory and schematic camera view illustrate the projection idea. This independent graphic does not contain real radar recordings or employer footage, and it is not a measurement-accuracy demonstration.',
    demonstratedCapability:
      'Working across camera calibration, coordinate systems, and interactive visualization. The underlying radar-to-video project remains an evolving prototype: reliable camera-to-sensor alignment and integration of calibration into the main overlay are ongoing engineering concerns.',
    applications: [
      'Technical visualization and training tools',
      'Sensor-data review interfaces',
      'Camera and equipment alignment workflows',
      'Feasibility prototypes for spatial applications',
    ],
    technicalNotes: [
      'Relevant experience includes Python, OpenCV, ChArUco calibration, 3D-to-2D projection, and interactive camera workspaces.',
      'Lens calibration alone does not locate the camera relative to the sensor. Both position and orientation are needed.',
      'A production application would require measured error tolerances, repeatable validation, synchronization, and testing across the supported camera configurations.',
    ],
    experienceNote:
      'Based on an evolving engineering prototype described in the technical portfolio and subsequent calibration work. This is not a Studio client deliverable, a finished production product, or a claim of validated accuracy.',
    relatedPortfolio: [
      { label: 'Radar-to-video calibration project', href: '/projects/radar-golf-trace-calibration' },
    ],
  },
];
