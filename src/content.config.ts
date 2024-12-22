import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const notes = defineCollection({
  loader: glob({
    base: "./notes",
    pattern: "**/*.{md,mdx}",
    generateId: ({ entry }) => "/" + entry.replace(/.mdx?$/, "").replace(/\/?index$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date().default(() => new Date()),
    revDate: z.coerce.date().optional(),
  }),
});

export const collections = { notes };
