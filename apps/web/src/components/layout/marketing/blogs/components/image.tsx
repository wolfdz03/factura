/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";

const MDXImage = ({ ...props }) => {
  return (
    <div className="-mx-12 my-12 border-y border-dashed p-4">
      <img {...props} className="rounded-lg object-cover object-center" />
    </div>
  );
};

export default MDXImage;
