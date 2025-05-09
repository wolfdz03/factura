import BlogHeader from "@/components/layout/marketing/blogs/blog-header";
import { Pre, CodeBlock } from "fumadocs-ui/components/codeblock";
import { MDXContent } from "@content-collections/mdx/react";
import defaultComponents from "fumadocs-ui/mdx";
import { allBlogs } from "content-collections";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateStaticParams() {
  return allBlogs.map((writing) => ({ slug: writing._meta.path }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  const post = allBlogs.find((post) => post._meta.path === slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = allBlogs.find((post) => post._meta.path === slug);
  if (!post) return notFound();
  return (
    <article className="mx-auto flex min-h-screen max-w-[1000px] flex-col border-x border-dashed">
      <BlogHeader />
      <div className="mx-auto flex max-w-[600px] flex-col p-0">
        <div className="prose prose-invert prose-lg container my-5">
          <h1 className="text-xl font-bold">{post.title}</h1>
          <p className="mb-10 text-base text-gray-400">{post.summary}</p>
          <MDXContent
            code={post.mdx}
            components={{
              ...defaultComponents,
              pre: ({ ...props }) => (
                <CodeBlock {...props} keepBackground className="font-mono">
                  <Pre>{props.children}</Pre>
                </CodeBlock>
              ),
            }}
          />
        </div>
      </div>
    </article>
  );
}
