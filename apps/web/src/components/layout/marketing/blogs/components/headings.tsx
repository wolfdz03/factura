const Heading = ({ ...props }) => {
  return <h2 {...props} className="instrument-serif text-3xl font-semibold" />;
};

const Paragraph = ({ ...props }) => {
  return <p {...props} className="text-primary-foreground/70 text-base text-[15px] font-light" />;
};

export { Heading, Paragraph };
