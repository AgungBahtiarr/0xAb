import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const profile = defineCollection({
  // Loader reads markdown files in src/content/profile
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/profile" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    subRole: z.string(),
    tagline: z.string(),
    availability: z.string(),
    location: z.string(),
    email: z.string(),
    github: z.string(),
    linkedin: z.string(),
    stats: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),
  })
});

const projects = defineCollection({
  // Loader reads markdown files in src/content/projects
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    githubUrl: z.string().optional(),
    demoUrl: z.string().optional(),
    tags: z.array(z.string()),
    order: z.number().default(0),
  })
});
const blog = defineCollection({
  // Loader reads markdown files in src/content/blog
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  })
});

export const collections = { profile, projects, blog };
