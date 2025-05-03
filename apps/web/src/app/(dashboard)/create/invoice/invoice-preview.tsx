"use client";

import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./pdf-document";

// Add global style to ensure PDF iframe has white background
const pdfViewerStyle = `
  iframe {
    background-color: white !important;
    border: none !important;
  }
`;

const dummyData: ZodCreateInvoiceSchema = {
  companyDetails: {
    name: "Acme Corporation",
    logo: "/images/acme-logo.png",
    signature: "/images/john-signature.png",
    address: {
      label: "address",
      value: "123 Business Ave, Suite 200, San Francisco, CA 94107",
    },
  },
  clientDetails: {
    name: "ScamTechStart Solutions Inc.",
    address: {
      label: "address",
      value: "456 Innovation Drive, Boston, MA 02110",
    },
  },
  invoiceDetails: {
    currency: "USD",
    prefix: "INV-",
    serialNumber: "2023-0042",
    shipTo: {
      label: "ship to",
      value: "456 Innovation Drive, Boston, MA 02110",
    },
    date: new Date("2023-10-15"),
    dueDate: new Date("2023-11-15"),
    paymentTerms: "Net 30",
    discount: {
      label: "discount",
      value: 50,
      type: "fixed",
    },
    tax: {
      label: "tax",
      value: 8.25,
      type: "percentage",
    },
    shipping: {
      label: "shipping",
      value: 25,
      type: "fixed",
    },
    amountPaid: {
      label: "amount paid",
      value: 0,
    },
  },
  items: [
    {
      name: "Web Development Services",
      description: "Frontend development for e-commerce platform",
      quantity: 40,
      unitPrice: 85,
    },
    {
      name: "UI/UX Design",
      description: "User interface design and prototyping",
      quantity: 20,
      unitPrice: 95,
    },
    {
      name: "Cloud Hosting Setup",
      description: "AWS configuration and deployment",
      quantity: 1,
      unitPrice: 350,
    },
  ],
  metadata: {
    notes: {
      label: "notes",
      value: "Thank you for your business! Please make payment by the due date.",
    },
    terms: {
      label: "terms",
      value: "Payment is due within 30 days. Late payments subject to a 1.5% monthly fee.",
    },
  },
};

const InvoicePreview = () => {
  const [Client, setClient] = useState(true);

  useEffect(() => {
    setClient(false);
  }, []);

  if (Client) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        backgroundColor: "white",
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: pdfViewerStyle }} />
      <PDFViewer
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          border: "none",
        }}
        showToolbar={false}
      >
        <InvoicePDF data={dummyData} />
      </PDFViewer>
    </div>
  );
};

export default InvoicePreview;
