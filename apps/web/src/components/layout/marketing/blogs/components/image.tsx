/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import React from "react";

const MDXImage = ({ src, className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const darkImageSrc = getDarkImageSrc(src);
  const finalImageSrc = isDark ? darkImageSrc : src;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // if its dark mode fallback to light mode images else fallback to dark mode images
    if (isDark && darkImageSrc) {
      (e.target as HTMLImageElement).src = darkImageSrc;
    } else {
      (e.target as HTMLImageElement).src = src as string;
    }
  };

  return (
    <div className="-mx-12 my-12 border-y border-dashed p-4">
      <img
        src={finalImageSrc}
        className={cn("rounded-lg object-cover object-center", className)}
        onError={handleImageError}
        {...props}
      />
    </div>
  );
};

export default MDXImage;

// Generate dark mode image path
const getDarkImageSrc = (originalSrc: string | Blob | undefined) => {
  // if the image is not a string, return undefined
  if (typeof originalSrc !== "string") {
    return undefined;
  }

  const extension = originalSrc.split(".").pop();
  const baseName = originalSrc.replace(`.${extension}`, "");
  return `${baseName}-dark.${extension}`;
};
