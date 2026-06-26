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
    │   └── personal/         #   ← LIFE PAGE PHOTOS/VIDEOS — one folder per trip/year
    │       ├── 2024/         #     each subfolder becomes a gallery section
    │       └── seattle-2025/ #     (photos + videos live together here)
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

The gallery is **folder-driven**: every subfolder inside `src/assets/personal/`
becomes its own section on the page (a trip or a year). Each photo is **clickable**
to open a full-screen, zoomed-in view (the "lightbox") with left/right arrows and
keyboard navigation (`←` `→` to move, `Esc` to close). Sections are **collapsible**
with a sticky header so you can quickly jump between groupings.

### 4a. Add more photos

1. Drop your image files into a folder under **`src/assets/personal/`**. Use the
   existing `2024/` folder, or make a new one (see "Add a trip" below).
   Supported: `.jpeg .jpg .png .webp .avif`.
2. That's it. Every image in any subfolder is picked up automatically, optimized, and
   shown under that folder's section. No code change needed to simply add photos.

The page grabs them with this line (no need to list files by hand):

```ts
const photoModules = import.meta.glob(
  '../assets/personal/**/*.{jpeg,jpg,png,webp,avif}',
  { eager: true },
);
```

### 4b. Add a trip (a new photo group)

1. Create a folder, e.g. **`src/assets/personal/patagonia-2025/`**, and drop the
   photos (and/or videos) in. It immediately appears as its own collapsible section,
   titled with the folder name.
2. **(Optional but recommended)** give it a nice title, a subtitle, and control where
   it appears by adding one entry to the `GROUP_META` map near the top of
   `src/pages/life.astro`. Keys are the **exact folder name**:

```ts
const GROUP_META = {
  '2024': { title: '2024', order: 100 },
  'patagonia-2025': {
    title: 'Patagonia',
    subtitle: 'Argentina · March 2025',  // optional small line in the header
    order: 1,                            // lower number = section appears first
  },
};
```

- `title` → the heading shown above the gallery (defaults to the folder name).
- `subtitle` → smaller line under the title; great for "Location · Month Year".
- `order` → lower numbers appear first. Unlisted folders default to `50`.

### 4c. Add a video to a trip

Videos live in the **same trip folders** as photos and show up inline with a play
badge; clicking opens them full-screen with playback controls.

1. Drop the file into a trip folder, e.g. `src/assets/personal/seattle-2025/`.
   Supported: `.mp4 .webm .mov .m4v`.
2. **Use `.mp4` (H.264 video + AAC audio) whenever possible** — it's the format that
   plays reliably across all browsers. iPhone `.mov` files often *won't* play in
   Firefox, so convert them first.

**Converting a `.mov` (or anything) to web-friendly `.mp4`:** this uses
[`ffmpeg`](https://ffmpeg.org) (install once with `brew install ffmpeg`).

```bash
# If the video is already H.264 + AAC (most iPhone clips), this is a fast,
# lossless container swap — no quality loss, no re-encoding:
ffmpeg -i input.mov -c copy -movflags +faststart output.mp4

# If that errors about codecs, re-encode instead (slower, slight quality change):
ffmpeg -i input.mov -c:v libx264 -crf 20 -c:a aac -movflags +faststart output.mp4
```

Then delete the original `.mov` and keep only the `.mp4` in the folder. The
`+faststart` flag lets the video start playing before it's fully downloaded.

> **Tip:** unlike photos, videos are **not** auto-optimized/compressed by the site —
> they're served as-is. Keep clips short and reasonably sized.

### 4d. Give a photo or video a date or description (optional)

By default a photo or video shows no caption. To add a date and/or description (shown
on hover/focus, and as the caption in the zoomed-in lightbox), edit the `PHOTO_META`
map near the top of `src/pages/life.astro`. Keys are the **exact file names** (works
for both images and videos):

```ts
const PHOTO_META = {
  'DSC01046.jpeg':       { date: 'June 2024', description: 'Sunrise over the bay.' },
  'IMG_3579.jpeg':       { date: 'Aug 2024',  description: 'Backpacking trip.' },
  'z-fishtosspikes.mp4': { date: 'June 2025', description: 'Fish toss at Pike Place.' },
};
```

- `date` → shown in the small badge that appears on hover/focus. Any text works
  (`"2024"`, `"June 2024"`, `"06/2024"`).
- `description` → used as the alt text **and** shown as a caption on hover/focus and
  in the lightbox.
- Anything you leave out is simply omitted, so the live site never shows empty
  placeholder text.

> **Ordering within a section:** photos and videos are sorted by file name. To force an
> order, prefix file names with numbers (`01-…`, `02-…`) or a letter (e.g. `z-…` pushes
> an item to the end).

### 4e. Add a blog post

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
| Add photos to the Life page | drop files in a folder under `src/assets/personal/` |
| Add a new trip section | new folder in `src/assets/personal/` + optional `GROUP_META` entry |
| Add a video to the Life page | drop an `.mp4` in a trip folder (convert `.mov` → `.mp4` first) |
| Caption / date a photo or video | `PHOTO_META` in `src/pages/life.astro` |
| Write a Life blog post | new `.md` file in `src/content/journal/` |
| Change my name / bio links | `src/consts.ts` |
| Edit the homepage intro | `src/components/sections/Hero.astro` |
| Edit the About text | `src/components/sections/About.astro` |
| Add a project | new `.mdx` file in `src/content/projects/` |
| Add a nav menu item | `links` array in `src/components/Nav.astro` |
| Swap the resume PDF | `public/docs/` + `resumePdf` in `src/consts.ts` |
| Change colors/fonts | `src/styles/global.css` |
```
