const Heading = ({ ...props }) => {
  return <h2 {...props} className="instrument-serif text-3xl font-semibold" />;
};

const Paragraph = ({ ...props }) => {
  return <p {...props} className="text-secondary-foreground text-base text-[15px] font-light" />;
};

export { Heading, Paragraph };
