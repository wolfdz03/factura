import { InvoiceCompanyDetails } from "@/types/indexdb/invoice-company-details";
import { IDB_INVOICE_COMPANY_DETAILS } from "@/constants/indexed-db";
import { initIndexedDB } from "@/global/indexdb";

// Force beacuse put() method will override the existing data
export const forceInsertInvoiceCompanyDetails = async (companyDetails: InvoiceCompanyDetails) => {
  const db = await initIndexedDB();
  await db.put(IDB_INVOICE_COMPANY_DETAILS, companyDetails);
};

// Add because add() method will not override the existing data
export const insertInvoiceCompanyDetails = async (companyDetails: InvoiceCompanyDetails) => {
  const db = await initIndexedDB();
  await db.add(IDB_INVOICE_COMPANY_DETAILS, companyDetails);
};

export const getAllInvoiceCompanyDetails = async () => {
  const db = await initIndexedDB();
  return await db.getAll(IDB_INVOICE_COMPANY_DETAILS);
};
