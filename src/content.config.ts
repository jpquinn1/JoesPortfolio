import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const projects = defineCollection({
	// Load Markdown and MDX case studies from `src/content/projects/`.
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			// Short blurb shown on the project card.
			description: z.string(),
			// Large screenshot/preview for the card and case study header.
			screenshot: image(),
			// Tech tags rendered as mono pills.
			tags: z.array(z.string()).default([]),
			// Controls ordering on the homepage (lower = first).
			order: z.number().default(0),
			// Show this project in the Featured Projects grid.
			featured: z.boolean().default(true),
			// Optional external links.
			repo: z.string().url().optional(),
			demo: z.string().url().optional(),
			pubDate: z.coerce.date().optional(),
		}),
});

// Personal "Life" writing. Drop Markdown/MDX files into `src/content/journal/`
// to publish a post on the /life page. Until a file exists here, the writing
// section on /life stays hidden (no placeholder shown).
//
// Example `src/content/journal/first-trip.md`:
//   ---
//   title: A weekend in the mountains
//   description: Notes and photos from a trip off the grid.
//   pubDate: 2024-06-15
//   heroImage: ./first-trip-hero.jpg   # optional, lives next to the file
//   ---
//   Your post body goes here...
const journal = defineCollection({
	loader: glob({ base: './src/content/journal', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

export const collections = { blog, projects, journal };
