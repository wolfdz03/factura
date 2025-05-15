import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";

export interface IDBInvoice {
  id: string;
  createdAt: Date;
  data: ZodCreateInvoiceSchema;
}
