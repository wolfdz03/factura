import { defineCollection, defineConfig } from "@content-collections/core";
import { rehypeCode } from "fumadocs-core/mdx-plugins";
import { compileMDX } from "@content-collections/mdx";
// for more information on configuration, visit:
// https://www.content-collections.dev/docs/configuration

const writings = defineCollection({
  name: "blogs",
  directory: "src/content/blogs",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    summary: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      rehypePlugins: [
        [
          rehypeCode,
          {
            themes: {
              light: "min-light",
              dark: "min-dark",
            },
          },
        ],
      ],
    });
    return {
      ...document,
      mdx,
    };
  },
});

export default defineConfig({
  collections: [writings],
});
