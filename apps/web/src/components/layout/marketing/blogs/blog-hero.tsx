import { GenerateBreadcrumb } from "@/components/ui/generate-breadcrumb";
import React from "react";

interface BlogHeroProps {
  title: string;
  description: string;
}

const BlogHero = ({ title, description }: BlogHeroProps) => {
  return (
    <div className="h-96 border-b border-dashed p-4">
      <div className="blog-hero-gradient relative h-full overflow-hidden rounded-lg">
        <BlogGradientFilters />
        <div className="flex h-full flex-col justify-between p-8">
          <div className="jetbrains-mono">
            <GenerateBreadcrumb />
          </div>
          <div className="text-primary-foreground flex flex-col">
            <h1 className="instrument-serif text-5xl font-bold">{title}</h1>
            <p className="text-primary-foreground/70 text-sm">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;

const BlogGradientFilters = () => {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  );
};
