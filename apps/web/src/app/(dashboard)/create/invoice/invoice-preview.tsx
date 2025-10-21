"use client";

import {
  createInvoiceSchema,
  createInvoiceSchemaDefaultValues,
  ZodCreateInvoiceSchema,
} from "@/zod-schemas/invoice/create-invoice";
import { createBlobUrl, revokeBlobUrl } from "@/lib/invoice/create-blob-url";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { invoiceErrorAtom } from "@/global/atoms/invoice-atom";
import { useMounted, useResizeObserver } from "@mantine/hooks";
import { createPdfBlob } from "@/lib/invoice/create-pdf-blob";
import PDFLoading from "@/components/layout/pdf/pdf-loading";
import React, { useEffect, useRef, useState } from "react";
import PDFError from "@/components/layout/pdf/pdf-error";
import { cloneDeep, debounce, isEqual } from "lodash";
import { ERROR_MESSAGES } from "@/constants/issues";
import { UseFormReturn } from "react-hook-form";
import { Document, Page } from "react-pdf";
import * as Sentry from "@sentry/nextjs";
import { useSetAtom } from "jotai";

const PDF_VIEWER_PADDING = 18;

// Custom PDF viewer component that handles displaying a PDF document
const PDFViewer = ({ url, width }: { url: string | null; width: number }) => {
  const [error, setError] = useState<Error | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3)); // Max zoom 3x
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5)); // Min zoom 0.5x
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  const calculatePageWidth = () => {
    const baseWidth = width > 600 ? 600 - PDF_VIEWER_PADDING : width - PDF_VIEWER_PADDING;
    return baseWidth * zoomLevel;
  };

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '=':
          case '+':
            event.preventDefault();
            handleZoomIn();
            break;
          case '-':
            event.preventDefault();
            handleZoomOut();
            break;
          case '0':
            event.preventDefault();
            handleZoomReset();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomLevel]);

  if (width === 0) {
    // setting width to 600px Because the container is not mounted yet
    width = 600;
  }

  // Show empty state if the url is not loaded
  if (!url) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Zoom Controls */}
      <div className="flex items-center justify-between border-b bg-background px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
            title="Zoom arrière (Ctrl + -)"
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <span className="min-w-[60px] text-center text-sm font-medium">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            title="Zoom avant (Ctrl + +)"
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
          <button
            onClick={handleZoomReset}
            title="Réinitialiser le zoom (Ctrl + 0)"
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            Réinitialiser
          </button>
        </div>
        <div className="text-xs text-muted-foreground">
          Zoom : {Math.round(zoomLevel * 100)}%
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex h-full w-full items-center justify-center overflow-hidden">
        <Document
          file={url}
          loading={null}
          onLoadError={(error) => {
            console.error("[ERROR]: Error loading PDF:", error);
            // Send the error to Sentry
            Sentry.captureException(error, {
              level: "debug",
            });
            setError(error);

            // retry converting the pdf to blob
          }}
          className="scroll-bar-hidden dark:bg-background flex h-full max-h-full w-full items-center justify-center overflow-y-scroll py-[18px] sm:items-start"
        >
          {!error && (
            <Page
              pageNumber={1}
              width={calculatePageWidth()}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          )}
        </Document>
      </div>
    </div>
  );
};

const InvoicePreview = ({ form }: { form: UseFormReturn<ZodCreateInvoiceSchema> }) => {
  const isClient = useMounted();
  const [resizeRef, container] = useResizeObserver();
  const setInvoiceError = useSetAtom(invoiceErrorAtom);
  const [data, setData] = useState(form.getValues());
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const lastProcessedValueRef = useRef<ZodCreateInvoiceSchema>(createInvoiceSchemaDefaultValues);

  // Watch for form changes, debounce input, validate, and then update data/errors
  useEffect(() => {
    const processFormValue = (value: ZodCreateInvoiceSchema) => {
      if (isEqual(value, lastProcessedValueRef.current)) return; // skip unnecessary updates
      lastProcessedValueRef.current = cloneDeep(value);

      // First verify the data if it matches the schema
      const isDataValid = createInvoiceSchema.safeParse(value);
      // If the data is valid, set the data to invoice and clear the errors
      if (isDataValid.success) {
        setData(value);
        setInvoiceError([]);
      } else {
        setInvoiceError(isDataValid.error.issues);
      }
    };

    // Create a debounced version of the processing function
    const debouncedProcessFormValue = debounce(processFormValue, 1000);

    const subscription = form.watch((value) => {
      // Ensure the watched value is cast correctly, matching the original logic
      debouncedProcessFormValue(value as ZodCreateInvoiceSchema);
    });

    return () => {
      // Cleanup subscription and cancel any pending debounced calls
      subscription.unsubscribe();
      debouncedProcessFormValue.cancel();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // Effect to generate PDF when data changes
  useEffect(() => {
    setPdfError(null);

    (async () => {
      try {
        const blob = await createPdfBlob({ invoiceData: data, template: form.watch("invoiceDetails.theme.template") });
        const newUrl = createBlobUrl({ blob });

        setGeneratedPdfUrl(newUrl);
      } catch (err) {
        setPdfError(parseCatchError(err, ERROR_MESSAGES.FAILED_TO_GENERATE_PDF));
        // Send the error to Sentry
        Sentry.captureException(err, {
          level: "debug",
        });
        if (generatedPdfUrl) {
          revokeBlobUrl({ url: generatedPdfUrl });
        }
      }
    })();

    // Cleanup on component unmount or when data changes again (before new generation)
    return () => {
      if (generatedPdfUrl) {
        revokeBlobUrl({ url: generatedPdfUrl });
      }
    };

    // Dont Include generatedPdfUrl in the dependency array as it will cause infinite re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // If there is an error loading the PDF, show an error message
  if (pdfError) {
    return (
      <div className="h-full w-full">
        <PDFError message={pdfError} />
      </div>
    );
  }

  return (
    <div ref={resizeRef} className="scroll-bar-hidden bg-sidebar h-full w-full overflow-y-auto">
      {!isClient || !generatedPdfUrl ? (
        <div className="h-full w-full">
          <PDFLoading />
        </div>
      ) : (
        <PDFViewer url={generatedPdfUrl} width={container.width} />
      )}
    </div>
  );
};

export default InvoicePreview;
