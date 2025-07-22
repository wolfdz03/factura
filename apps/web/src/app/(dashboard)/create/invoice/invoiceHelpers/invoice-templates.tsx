import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { DefaultPDF, VercelPDF } from "@/components/pdf";

export type PdfTemplateName = "Default" | "Vercel";

interface PdfTemplate {
  name: PdfTemplateName;
  description: string;
  component: React.ComponentType<{ data: ZodCreateInvoiceSchema }>;
}

// Available Template Array
export const availablePdfTemplates: PdfTemplate[] = [
  {
    name: "Default",
    description: "Default Design",
    component: DefaultPDF,
  },
  {
    name: "Vercel",
    description: "Vercel Design",
    component: VercelPDF,
  },
];
