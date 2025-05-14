import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import InvoicePDF from "@/app/(dashboard)/create/invoice/pdf-document";
import { pdf } from "@react-pdf/renderer";

interface CreatePdfBlobProps {
  invoiceData: ZodCreateInvoiceSchema;
}

export const createPdfBlob = async ({ invoiceData }: CreatePdfBlobProps) => {
  const pdfDocument = <InvoicePDF data={invoiceData} />;
  const blob = await pdf(pdfDocument).toBlob();

  return blob;
};
