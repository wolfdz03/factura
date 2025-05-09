"use client";

import { createInvoiceSchema, ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { invoiceErrorAtom } from "@/global/atoms/invoice-atom";
import PDFLoading from "@/components/layout/pdf/pdf-loading";
import PDFError from "@/components/layout/pdf/pdf-error";
import { BlobProvider } from "@react-pdf/renderer";
import { Document, Page, pdfjs } from "react-pdf";
import { UseFormReturn } from "react-hook-form";
import InvoicePDF from "./pdf-document";
import { useSetAtom } from "jotai";
import { debounce } from "lodash";

// Custom PDF viewer component that handles displaying a PDF document
const PDFViewer = ({ url, width }: { url: string | null; width: number }) => {
  const [error, setError] = useState<Error | null>(null);

  // Show empty state
  if (!url) {
    return null;
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Document
        file={url}
        loading={null}
        onLoadError={(error) => {
          console.error("[ERROR]: Error loading PDF:", error);
          setError(error);
        }}
        className="max-h-full"
      >
        {!error && (
          <Page
            pageNumber={1}
            width={width > 600 ? 600 - 32 : width - 32}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        )}
      </Document>
    </div>
  );
};

const InvoicePreview = ({ form }: { form: UseFormReturn<ZodCreateInvoiceSchema> }) => {
  const [isClient, setIsClient] = useState(false);
  const [data, setData] = useState(form.getValues());
  const [pdfError, setPdfError] = useState<Error | null>(null);
  const setInvoiceError = useSetAtom(invoiceErrorAtom);
  const previewRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Create a debounced function to update data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetData = useCallback(
    debounce((value: ZodCreateInvoiceSchema) => {
      // First verify the data if it matches the schema
      const isDataValid = createInvoiceSchema.safeParse(value);
      if (isDataValid.success) {
        setData(value);
        setInvoiceError([]);
      } else {
        setInvoiceError(isDataValid.error.issues);
      }
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

  // Set up ResizeObserver to update width when container resizes
  useEffect(() => {
    if (!previewRef.current) return;

    const element = previewRef.current;
    setContainerWidth(element.clientWidth);

    const resizeObserver = new ResizeObserver((entries) => {
      console.log("ressized");
      for (const entry of entries) {
        setContainerWidth(entry.target.clientWidth);
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
      resizeObserver.disconnect();
    };
  }, [isClient]);

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

  if (!isClient) {
    return <PDFLoading />;
  }

  // If there is an error loading the PDF, show an error message
  if (pdfError) {
    return <PDFError message={pdfError.message} />;
  }

  return (
    <div ref={previewRef} className="scroll-bar-hidden bg-sidebar h-full w-full overflow-y-auto">
      {/* 
      Use a key to force a re-render of the BlobProvider when the data changes Else it will not re-render and breaks the pdf generation on deleting dynamic fields
      Found this solution on Github Issues: https://github.com/diegomura/react-pdf/issues/3153 
      */}
      <BlobProvider key={Date.now()} document={<InvoicePDF data={data} />}>
        {({ url, loading, error }) => {
          // If the PDF is still generating, show a loading state
          if (loading) return <PDFLoading />;

          // If there is an error generating the PDF, show an error message
          if (error) {
            return <PDFError message={error.message} />;
          }

          return <PDFViewer url={url} width={containerWidth} />;
        }}
      </BlobProvider>
    </div>
  );
};

export default InvoicePreview;
