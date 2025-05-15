"use client";

import React, { useEffect } from "react";
import { pdfjs } from "react-pdf";

interface PdfWorkerProviderProps {
  children: React.ReactNode;
}

const PdfWorkerProvider = ({ children }: PdfWorkerProviderProps) => {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();
      }
    } catch (error) {
      console.error("[ERROR]: PDF Worker Provider ~ Error setting up PDF worker:", error);
    }
  }, []);

  return <>{children}</>;
};

export { PdfWorkerProvider };
