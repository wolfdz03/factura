import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";

interface GenerateInvoiceNameProps {
  invoiceData: ZodCreateInvoiceSchema;
  extension: "pdf" | "png";
}

export const generateInvoiceName = ({ invoiceData, extension }: GenerateInvoiceNameProps) => {
  return `Facture-${invoiceData.invoiceDetails.prefix}${invoiceData.invoiceDetails.serialNumber}.${extension}`;
};
