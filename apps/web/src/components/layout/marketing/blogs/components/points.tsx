const UnorderedList = ({ ...props }) => {
  return (
    <ul
      {...props}
      className="[&>li>strong]:text-primary-foreground [&>li]:text-primary-foreground/70 list-disc space-y-1 pl-4 text-[15px] [&>li>strong]:font-semibold"
    />
  );
};

const OrderedList = ({ ...props }) => {
  return (
    <ol
      {...props}
      className="[&>li>p>strong]:text-primary-foreground [&>li]:text-primary-foreground/70 list-decimal space-y-2 pl-4 text-[15px] [&>li>p>strong]:font-semibold"
    />
  );
};

export { UnorderedList, OrderedList };
