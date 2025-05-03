"use client";

import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./pdf-document";

// const dummyData: ZodCreateInvoiceSchema = {
//   companyDetails: {
//     name: "MyLegion Corporation",
//     logo: "/images/acme-logo.png",
//     signature: "/images/john-signature.png",
//     address: {
//       label: "address",
//       value: "123 Business Ave, Suite 200, San Francisco, CA 94107",
//     },
//     metadata: [],
//   },
//   clientDetails: {
//     name: "ScamTechStart Solutions Inc.",
//     address: {
//       label: "address",
//       value: "456 Innovation Drive, Boston, MA 02110",
//     },
//     metadata: [],
//   },
//   invoiceDetails: {
//     theme: {
//       baseColor: "#635CFF",
//     },
//     currency: "USD",
//     prefix: "INV-",
//     serialNumber: "2023-0042",
//     shipTo: {
//       label: "ship to",
//       value: "456 Innovation Drive, Boston, MA 02110",
//     },
//     date: new Date("2023-10-15"),
//     dueDate: new Date("2023-11-15"),
//     paymentTerms: "Net 30",
//     billingDetails: [],
//   },
//   items: [
//     {
//       name: "Web Development Services",
//       description: "Frontend development for e-commerce platform",
//       quantity: 40,
//       unitPrice: 85,
//     },
//     {
//       name: "UI/UX Design",
//       description: "User interface design and prototyping",
//       quantity: 20,
//       unitPrice: 95,
//     },
//     {
//       name: "Cloud Hosting Setup",
//       description: "AWS configuration and deployment",
//       quantity: 1,
//       unitPrice: 350,
//     },
//   ],
//   metadata: {
//     notes: {
//       label: "notes",
//       value: "Thank you for your business! Please make payment by the due date.",
//     },
//     terms: {
//       label: "terms",
//       value: "Payment is due within 30 days. Late payments subject to a 1.5% monthly fee.",
//     },
//     paymentInformation: [
//       {
//         label: "Bank Name",
//         value: "Bank of America",
//       },
//       {
//         label: "Account Number",
//         value: "1234567890",
//       },
//     ],
//   },
// };

const InvoicePreview = ({ data, id }: { data: ZodCreateInvoiceSchema; id?: string }) => {
  const [Client, setClient] = useState(true);

  useEffect(() => {
    setClient(false);
  }, []);

  if (Client) {
    return <div>Loading...</div>;
  }

  return (
    <div id={id} className="h-full w-full">
      <PDFViewer className="h-full w-full" showToolbar={false}>
        <InvoicePDF data={data} />
      </PDFViewer>
    </div>
  );
};

export default InvoicePreview;
