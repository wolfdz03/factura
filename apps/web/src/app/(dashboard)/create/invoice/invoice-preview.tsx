"use client";

import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import React, { useEffect, useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import InvoicePDF from "./pdf-document";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
});

const InvoicePreview = ({ form }: { form: UseFormReturn<ZodCreateInvoiceSchema> }) => {
  const [isClient, setIsClient] = useState(true);
  const [data, setData] = useState(form.getValues());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(false);
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      // Clear any existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set a new timer to update data after 2000ms of no changes
      debounceTimerRef.current = setTimeout(() => {
        setData(value as ZodCreateInvoiceSchema);
      }, 2000);
    });

    return () => {
      // Cleanup subscription and any pending timer
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [form]);

  if (isClient) {
    return <div>Loading...</div>;
  }

  return (
    <PDFViewer className="h-full w-full">
      <InvoicePDF data={data} />
    </PDFViewer>
  );
};

export default InvoicePreview;
