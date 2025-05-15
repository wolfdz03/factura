import { IDB_SCHEMA_INVOICES } from "@/constants/indexed-db";
import { IDBInvoice } from "@/types/indexdb/invoice";
import { initIndexedDB } from "@/global/indexdb";

// Force beacuse put() method will override the existing data
export const forceInsertInvoice = async (invoice: IDBInvoice) => {
  const db = await initIndexedDB();
  await db.put(IDB_SCHEMA_INVOICES, invoice);
};
