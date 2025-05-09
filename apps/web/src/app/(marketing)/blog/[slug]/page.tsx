import { blogComponents } from "@/components/layout/marketing/blogs/components";
import BlogHeader from "@/components/layout/marketing/blogs/blog-header";
import BlogHero from "@/components/layout/marketing/blogs/blog-hero";
import { MDXContent } from "@content-collections/mdx/react";
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
  return (
    <article
      className={cn("mx-auto flex min-h-screen max-w-[1000px] flex-col border-x border-dashed", "instrument-sans")}
    >
      <BlogHeader />
      <BlogHero title={post.title} description={post.summary} />
      <div className="grid grid-cols-7">
        {/* Content */}
        <div className="col-span-5 space-y-4 border-r border-dashed p-12">
          <MDXContent code={post.mdx} components={blogComponents} />
        </div>
        {/* Sidebar List of contents */}
        <div className="col-span-2 p-4"></div>
      </div>
    </article>
  );
}
