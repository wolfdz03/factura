import { BlogContent } from "@/components/layout/marketing/blogs/blog-content";
import BlogHeader from "@/components/layout/marketing/blogs/blog-header";
import BlogHero from "@/components/layout/marketing/blogs/blog-hero";
import { getTableOfContents } from "fumadocs-core/server";
import { allBlogs } from "content-collections";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
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

  const toc = getTableOfContents(post.content);

  return (
    <article
      className={cn("mx-auto flex min-h-screen max-w-[1000px] flex-col border-x border-dashed", "instrument-sans")}
    >
      <BlogHeader />
      <BlogHero title={post.title} description={post.summary} />
      <BlogContent code={post.mdx} toc={toc} />
    </article>
  );
}
