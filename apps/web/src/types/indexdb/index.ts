import { InvoiceCompanyDetails } from "@/types/indexdb/invoice-company-details";
import { IDB_INVOICE_COMPANY_DETAILS } from "@/constants/indexed-db";
import { DBSchema } from "idb";

export interface IndexedDBSchema extends DBSchema {
  [IDB_INVOICE_COMPANY_DETAILS]: {
    key: number;
    value: InvoiceCompanyDetails;
  };
}
