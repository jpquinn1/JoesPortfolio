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

export const collections = { blog, projects };
