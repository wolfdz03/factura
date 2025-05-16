import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { DefaultPDF } from "@/components/pdf";
import { pdf } from "@react-pdf/renderer";

interface CreatePdfBlobProps {
  invoiceData: ZodCreateInvoiceSchema;
}

export const createPdfBlob = async ({ invoiceData }: CreatePdfBlobProps) => {
  const pdfDocument = <DefaultPDF data={invoiceData} />;
  const blob = await pdf(pdfDocument).toBlob();

  return blob;
};
