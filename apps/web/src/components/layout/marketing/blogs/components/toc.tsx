'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(content: string): TocItem[] {

  // look for h2 and h3 tags
  const headingRegex = /<h([2-3])\s+id="([^"]+)"[^>]*>(.*?)<\/h\1>/g;
  const headings: TocItem[] = [];
  
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    // Remove any HTML tags inside the heading
    const text = match[3].replace(/<[^>]*>/g, '');
    
    headings.push({ id, text, level });
  }
  
  return headings;
}

export function TableOfContents({ html }: { html: string }) {
  const [activeId, setActiveId] = useState<string>('');
  const headings = extractHeadings(html);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    const elements = document.querySelectorAll('h2[id], h3[id]');
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-4 text-sm">
      <h4 className="mb-4 text-base font-medium">Table of Contents</h4>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(
              heading.level === 3 && "ml-4",
              "transition-colors duration-200 hover:text-black"
            )}
          >
            <Link
              href={`#${heading.id}`}
              className={cn(
                "block py-1 text-[13px]",
                activeId === heading.id
                  ? "font-medium text-primary"
                  : "text-slate-500"
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                });
                setActiveId(heading.id);
              }}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
} 