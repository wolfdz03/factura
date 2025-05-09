import React from 'react';

const Heading = ({ ...props }) => {
  return <h2 {...props} className="instrument-serif text-3xl font-semibold" />;
};

const Paragraph = ({ children, ...props }: { children: React.ReactNode } & React.HTMLAttributes<HTMLParagraphElement>) => {
  // Check if children is the ImageWrapper component
  if (children && typeof children === 'object' && React.isValidElement(children)) {
    return children;
  }
  return <p {...props} className="text-secondary-foreground text-base text-[15px] font-light">{children}</p>;
};

export { Heading, Paragraph };
