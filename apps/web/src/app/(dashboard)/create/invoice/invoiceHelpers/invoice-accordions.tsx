import {
  AccordionContent,
  AccordionContentProps,
  AccordionTrigger,
  AccordionTriggerProps,
} from "@/components/ui/accordion";

const InvoiceAccordionTrigger = ({ children, ...props }: AccordionTriggerProps) => {
  return (
    <AccordionTrigger
      className="hover:bg-card data-[state=open]:bg-card data-[state=open]:text-primary data-[state=open]:[&>svg]:text-primary px-4"
      {...props}
    >
      {children}
    </AccordionTrigger>
  );
};

const InvoiceAccordionContent = ({ children, ...props }: AccordionContentProps) => {
  return (
    <AccordionContent className="space-y-2 border-t p-4" {...props}>
      {children}
    </AccordionContent>
  );
};

export { InvoiceAccordionTrigger, InvoiceAccordionContent };
