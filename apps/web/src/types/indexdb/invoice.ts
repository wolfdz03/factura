import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";

export enum INVOICE_STATUS {
  PENDING = "pending",
  SUCCESS = "success",
  ERROR = "error",
  EXPIRED = "expired",
  REFUNDED = "refunded",
}

export interface IDBInvoice {
  id: string;
  createdAt: Date;
  status: INVOICE_STATUS;
  paidAt: Date | null;
  data: ZodCreateInvoiceSchema;
}
