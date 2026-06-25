# Content & Editing Guide

A practical guide to how this website is built and **where to go to change things** —
text, photos, projects, and blog posts. No deep web-dev knowledge required; most
edits are "open this file, change this text, save."

---

## 1. The 30-second mental model

This is an [**Astro**](https://docs.astro.build) site. A few ideas explain almost everything:

- **Pages** = files in `src/pages/`. A file's location becomes its URL.
  `src/pages/resume.astro` → `/resume`. `src/pages/life.astro` → `/life`.
- **Components** = reusable chunks of a page (the nav bar, the hero, a project card),
  living in `src/components/`. Pages stitch components together.
- **Layouts** = the shared page shell (nav + footer + `<head>`), in `src/layouts/`.
- **Content collections** = folders of Markdown files that become pages automatically.
  This is how **projects** and **blog posts** work — you write a `.md`/`.mdx` file,
  the site builds the page for you.
- **Styling** = [Tailwind](https://tailwindcss.com) utility classes in the markup,
  plus a small set of custom colors/classes defined in `src/styles/global.css`.

Two places to put images, and the difference matters:

| Folder | When to use | How it's used |
| --- | --- | --- |
| `src/assets/…` | Most images (photos, project shots, blog heroes) | Astro **optimizes** them (resizes, converts to WebP, lazy-loads). Referenced by `import` or `import.meta.glob`. |
| `public/…` | Files you want served **as-is** (PDF resume, the headshot, favicon, raw videos) | Served at the literal path, e.g. `public/docs/resume.pdf` → `/docs/resume.pdf`. No optimization. |

---

## 2. Project structure

```text
JoesPortfolio/
├── astro.config.mjs          # Astro config: integrations, fonts (rarely edited)
├── CONTENT_GUIDE.md          # ← this file
├── public/                   # Served as-is (no optimization)
│   ├── docs/                 #   the downloadable resume PDF
│   ├── images/               #   headshot, etc.
│   └── projects/             #   project videos + raw images used in case studies
└── src/
    ├── consts.ts             # Site title, description, social links  ← EDIT FOR GLOBAL INFO
    ├── content.config.ts     # Defines the "shape" of projects + blog posts
    ├── styles/global.css     # Colors, fonts, reusable .card/.tag/.section-label, prose
    ├── assets/               # Optimized images (project shots, blog heroes…)
    │   └── personal/2024/    #   ← LIFE PAGE PHOTOS live here
    ├── components/
    │   ├── Nav.astro         # Top navigation bar  ← EDIT TO ADD/REMOVE NAV LINKS
    │   ├── SiteFooter.astro  # Footer
    │   └── sections/         # Homepage sections (Hero, About, Focus, Projects, Contact)
    ├── content/
    │   ├── projects/         # One .mdx file per project case study
    │   ├── journal/          #   ← LIFE PAGE BLOG POSTS go here
    │   └── blog/             #   (legacy Astro-template blog at /blog)
    ├── layouts/
    │   └── Layout.astro      # Main page shell (nav + footer) used by most pages
    └── pages/                # Each file = a route/URL
        ├── index.astro       #   /         (homepage)
        ├── resume.astro      #   /resume
        ├── life.astro        #   /life     ← LIFE PAGE
        ├── life/[...slug].astro     # builds a page for each journal post
        └── projects/[...slug].astro # builds a page for each project
```

---

## 3. Running the site locally

From the project root:

```bash
npm install        # first time only
npm run dev        # start the local server → http://localhost:4321
```

The site **hot-reloads**: save a file and the browser updates automatically. To stop,
press `Ctrl+C` in the terminal, or use `astro dev stop` if you started it in background mode.

To check everything still builds before deploying:

```bash
npm run build      # production build into dist/ (catches errors)
```

> **Tip:** Only run **one** dev server at a time. If pages look stale, you may have
> several old servers running on different ports (4321, 4322, …). Stop them all and
> start one fresh.

---

## 4. The Life page

The Life page (`/life`) has two parts: a **photo gallery** and a **writing/blog** section.
The page file is `src/pages/life.astro` and it's heavily commented.

### 4a. Add more photos

1. Drop your image files into **`src/assets/personal/2024/`** (or make a new year
   folder — see note below). Supported: `.jpeg .jpg .png .webp .avif`.
2. That's it. Every image in that folder is picked up automatically, optimized, and
   shown in the gallery. No code change needed to simply add photos.

The page grabs them with this line (no need to list files by hand):

```ts
const photoModules = import.meta.glob(
  '../assets/personal/2024/*.{jpeg,jpg,png,webp,avif}',
  { eager: true },
);
```

**Adding a new year folder** (e.g. 2025): create `src/assets/personal/2025/`, then in
`src/pages/life.astro` add a second `import.meta.glob('../assets/personal/2025/...')`
and merge it into the `photos` list. (Ask for help here if unsure — it's a 3-line change.)

### 4b. Give a photo a date or description (optional)

By default each photo shows just the year **`2024`**, and only when you hover or tap it.
To customize, edit the `PHOTO_META` map near the top of `src/pages/life.astro`. Keys are
the **exact file names**:

```ts
const PHOTO_META = {
  'DSC01046.jpeg': { date: 'June 2024', description: 'Sunrise over the bay.' },
  'IMG_3579.jpeg': { date: 'Aug 2024',  description: 'Backpacking trip.' },
};
```

- `date` → shown in the small badge that appears on hover/focus. Any text works
  (`"2024"`, `"June 2024"`, `"06/2024"`).
- `description` → used as the photo's alt text **and** shown as a caption on hover/focus.
- Anything you leave out falls back to the defaults, so the live site never shows
  empty placeholder text.

### 4c. Add a blog post

Blog posts are Markdown/MDX files in **`src/content/journal/`**. Until you add one, the
"Writing" section is **completely hidden** (no empty placeholder).

1. Create a file like `src/content/journal/weekend-in-the-mountains.md`
   (the file name becomes the URL: `/life/weekend-in-the-mountains`).
2. Start it with this "frontmatter" block, then write the post below it in Markdown:

```markdown
---
title: A weekend in the mountains
description: Notes and photos from a trip off the grid.
pubDate: 2024-06-15
# updatedDate: 2024-07-01        # optional
# heroImage: ./weekend-hero.jpg  # optional cover image, see note
---

## How it started

Write your post here. Normal Markdown works: **bold**, _italics_, lists,
[links](https://example.com), images, headings, etc.

- A bullet
- Another bullet
```

**Required fields:** `title`, `description`, `pubDate` (date format `YYYY-MM-DD`).
**Optional:** `updatedDate`, `heroImage`.

**Hero image:** put the image file in the **same folder** as the post
(`src/content/journal/`) and reference it with a relative path like
`heroImage: ./weekend-hero.jpg`. Astro optimizes it automatically.

Once the file is saved, the post appears as a card in the Writing section, and its own
page is generated at `/life/<filename>`. Posts are sorted newest-first by `pubDate`.

---

## 5. Other common edits

### Global info — name, tagline, social links, resume

Edit **`src/consts.ts`**. This drives the page titles, meta description, footer, and the
GitHub/LinkedIn/email/resume links across the whole site.

```ts
export const SITE_TITLE = 'Joe Quinn';
export const SITE_DESCRIPTION = '…';
export const SITE_TAGLINE = 'Operations Engineer · Technical Systems Builder';
export const SOCIALS = {
  github: 'https://github.com/jpquinn1',
  linkedin: 'https://www.linkedin.com/in/joepquinn',
  email: 'mailto:joepaquinn@gmail.com',
  resume: '/resume',
  resumePdf: '/docs/Joe Quinn Resume 6.26 Master.pdf',
};
```

To replace the **downloadable resume PDF**, drop the new file in `public/docs/` and
update `resumePdf` to match its name.

### Homepage sections

The homepage (`src/pages/index.astro`) is assembled from section components in
`src/components/sections/`:

| Want to change… | Edit this file |
| --- | --- |
| The big intro / hero buttons | `Hero.astro` |
| The "About Me" paragraph | `About.astro` |
| The "Technical Focus" cards | `TechnicalFocus.astro` (edit the `areas` array) |
| Which projects show + their order | the project files themselves (see below) |
| The "Contact / Resume" call-to-action | `Contact.astro` |

### Add or reorder a project

Projects are `.mdx` files in **`src/content/projects/`** (see
`radar-golf-trace-calibration.mdx` as a template). Frontmatter fields:

```markdown
---
title: My Project Title
description: One-line blurb shown on the project card.
screenshot: ./my-project-cover.png   # lives next to this file, in src/content/projects/
tags: [Python, OpenCV, Radar Data]
order: 2            # lower number = appears earlier on the homepage
featured: true      # set false to hide it from the homepage grid
repo: https://github.com/…   # optional
demo: https://…              # optional
pubDate: 2026-01-15          # optional
---

## Overview
Write the case study here in Markdown…
```

Larger media (videos, extra images) used inside a case study go in
`public/projects/<project-name>/` and are referenced by absolute path, e.g.
`/projects/radar-golf-trace-calibration/final-trace.mp4`.

### Navigation links

Edit the `links` array in **`src/components/Nav.astro`**. `/#about` style links jump to
a section on the homepage; `/life` style links go to a separate page.

```ts
const links = [
  { href: '/#about', label: 'About' },
  { href: '/#focus', label: 'Focus' },
  { href: '/#projects', label: 'Projects' },
  { href: '/life', label: 'Life' },
  { href: '/#contact', label: 'Contact' },
];
```

### Colors, fonts, and reusable styles

Defined in **`src/styles/global.css`**:

- Color tokens like `--color-bg`, `--color-fg`, `--color-accent` (used in markup as
  `bg-bg`, `text-fg`, `text-accent`, etc.).
- Reusable classes: `.section-label` (the small uppercase teal labels), `.card`
  (bordered surface used for project/blog cards), `.tag` (the mono pills), and `.prose`
  (styling for Markdown post/case-study bodies).

Fonts (Inter + JetBrains Mono) are configured in `astro.config.mjs`.

---

## 6. Deploying

The site is set up for **Vercel** (note the `@vercel/analytics` and `@vercel/speed-insights`
in the layout). Typical flow: push to your Git repo and Vercel builds + deploys
automatically. To preview a production build locally first:

```bash
npm run build && npm run preview
```

---

## 7. Quick reference — "I want to…"

| Goal | Go to |
| --- | --- |
| Add photos to the Life page | `src/assets/personal/2024/` (just drop files in) |
| Caption / date a photo | `PHOTO_META` in `src/pages/life.astro` |
| Write a Life blog post | new `.md` file in `src/content/journal/` |
| Change my name / bio links | `src/consts.ts` |
| Edit the homepage intro | `src/components/sections/Hero.astro` |
| Edit the About text | `src/components/sections/About.astro` |
| Add a project | new `.mdx` file in `src/content/projects/` |
| Add a nav menu item | `links` array in `src/components/Nav.astro` |
| Swap the resume PDF | `public/docs/` + `resumePdf` in `src/consts.ts` |
| Change colors/fonts | `src/styles/global.css` |
```
