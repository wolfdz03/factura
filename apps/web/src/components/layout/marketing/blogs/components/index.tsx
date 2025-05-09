import { UnorderedList, OrderedList } from "./points";
import defaultComponents from "fumadocs-ui/mdx";
import { Heading, Paragraph } from "./headings";
import { MDXLink } from "./link";
import MDXImage from "./image";
import { Code } from "./code";

export const blogComponents = {
  ...defaultComponents, // This is required to support the default components
  img: MDXImage,
  a: MDXLink,
  pre: Code,
  h1: Heading,
  h2: Heading,
  h3: Heading,
  h4: Heading,
  h5: Heading,
  p: Paragraph,
  ul: UnorderedList,
  ol: OrderedList,
};
