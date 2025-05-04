"use client";

import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import React, { useEffect, useState, useCallback } from "react";
import { BlobProvider } from "@react-pdf/renderer";
import { Document, Page, pdfjs } from "react-pdf";
import { UseFormReturn } from "react-hook-form";
import InvoicePDF from "./pdf-document";
import { debounce } from "lodash";

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
  const [pdfError, setPdfError] = useState<Error | null>(null);

  // Create a debounced function to update data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetData = useCallback(
    debounce((value: ZodCreateInvoiceSchema) => {
      setData(value);
    }, 1000),
    [],
  );

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

  // Checking if the client is loaded
  useEffect(() => {
    setIsClient(false);
  }, []);

  // Watch for form changes and apply debounce
  useEffect(() => {
    const subscription = form.watch((value) => {
      debouncedSetData(value as ZodCreateInvoiceSchema);
    });

    return () => {
      // Cleanup subscription and cancel any pending debounced calls
      subscription.unsubscribe();
      debouncedSetData.cancel();
    };
  }, [form, debouncedSetData]);

  // If the client is not loaded, show a loading state
  if (isClient) {
    return <div>Loading...</div>;
  }

  // If there is an error loading the PDF, show an error message
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
          // If the PDF is still generating, show a loading state
          if (loading) return <div className="flex h-full items-center justify-center">Generating PDF...</div>;

          // If there is an error generating the PDF, show an error message
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
