"use client";

import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import React, { useEffect, useState, useRef } from "react";
import { BlobProvider } from "@react-pdf/renderer";
import { Document, Page, pdfjs } from "react-pdf";
import { UseFormReturn } from "react-hook-form";
import InvoicePDF from "./pdf-document";

// Custom PDF viewer component that handles displaying a PDF document
const PDFViewer = ({ url }: { url: string | null }) => {
  const [error, setError] = useState<Error | null>(null);

  // Show empty state
  if (!url) {
    return <div className="flex h-full items-center justify-center">No document to display</div>;
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Document
        file={url}
        loading={<div className="p-4 text-center">Loading document...</div>}
        // onLoadSuccess={() => {
        //   console.log("PDF document loaded successfully");
        // }}
        onLoadError={(error) => {
          console.error("[ERROR]: Error loading PDF:", error);
          setError(error);
        }}
        className="max-h-full"
      >
        {!error && <Page pageNumber={1} width={600} renderTextLayer={false} renderAnnotationLayer={false} />}
      </Document>
      {error && <div className="mt-4 text-center text-red-500">Error loading PDF: {error.message}</div>}
    </div>
  );
};

const InvoicePreview = ({ form }: { form: UseFormReturn<ZodCreateInvoiceSchema> }) => {
  const [isClient, setIsClient] = useState(true);
  const [data, setData] = useState(form.getValues());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [pdfError, setPdfError] = useState<Error | null>(null);

  // Initialize PDF.js worker
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();
      }
    } catch (error) {
      console.error("[ERROR]: Error setting up PDF worker:", error);
      setPdfError(error instanceof Error ? error : new Error("Failed to setup PDF worker"));
    }
  }, []);

  useEffect(() => {
    setIsClient(false);
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      // Clear any existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set a new timer to update data after 1000ms of no changes
      debounceTimerRef.current = setTimeout(() => {
        setData(value as ZodCreateInvoiceSchema);
      }, 1000);
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

  if (pdfError) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-red-500">
        <p className="mb-2 font-semibold">PDF Viewer Error:</p>
        <p>{pdfError.message}</p>
      </div>
    );
  }

  return (
    <div className="scroll-bar-hidden h-full w-full overflow-y-auto bg-gray-100">
      <BlobProvider document={<InvoicePDF data={data} />}>
        {({ url, loading, error }) => {
          if (loading) return <div className="flex h-full items-center justify-center">Generating PDF...</div>;
          if (error) {
            return (
              <div className="flex h-full items-center justify-center text-red-500">
                Error generating PDF: {error.message}
              </div>
            );
          }

          return <PDFViewer url={url} />;
        }}
      </BlobProvider>
    </div>
  );
};

export default InvoicePreview;
