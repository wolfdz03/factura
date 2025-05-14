import { IDB_NAME, IDB_VERSION, IDB_INVOICE_COMPANY_DETAILS } from "@/constants/indexed-db";
import { IndexedDBSchema } from "@/types/indexdb";
import { openDB } from "idb";

export const initIndexedDB = async () => {
  return await openDB<IndexedDBSchema>(IDB_NAME, IDB_VERSION, {
    upgrade(db) {
      // Initialize - invoice company details store
      if (!db.objectStoreNames.contains(IDB_INVOICE_COMPANY_DETAILS)) {
        db.createObjectStore(IDB_INVOICE_COMPANY_DETAILS, { keyPath: "name" });
      }
    },
  });
};
