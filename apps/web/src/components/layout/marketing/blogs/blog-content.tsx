'use client';

import { useRef, useEffect, useState } from 'react';
import { MDXContent } from "@content-collections/mdx/react";
import { blogComponents } from "./components";
import { TableOfContents } from "./components/toc";

export function BlogContent({ code }: { code: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [renderedHTML, setRenderedHTML] = useState<string>('');

  useEffect(() => {
    if (contentRef.current) {
      setRenderedHTML(contentRef.current.innerHTML);
    }
  }, []);

  return (
    <div className="grid grid-cols-7">
      {/* Content */}
      <div className="col-span-5 space-y-4 border-r border-dashed p-12" ref={contentRef}>
        <MDXContent code={code} components={blogComponents} />
      </div>
      {/* Sidebar List of contents */}
      <div className="col-span-2 p-6">
        <TableOfContents html={renderedHTML} />
      </div>
    </div>
  );
}