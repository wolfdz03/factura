import InvoicePage from "./invoice";
import React from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suzali - Créer une facture",
  description: "Créez des factures professionnelles avec Suzali",
};

const Page = () => {
  return <InvoicePage />;
};

export default Page;
