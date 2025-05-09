/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";

// Wrapper component to handle MDX image rendering
const ImageWrapper = ({ children }: { children: React.ReactNode }) => {
  return children;
};

const MDXImage = ({ ...props }) => {
  return (
    <ImageWrapper>
      <div className="-mx-12 my-12 border-y border-dashed p-4">
        <img {...props} className="rounded-lg object-cover object-center" />
      </div>
    </ImageWrapper>
  );
};

export default MDXImage;
