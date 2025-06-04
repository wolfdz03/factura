"use client";

import { pdfjs } from "react-pdf";
import React from "react";

interface PdfWorkerProviderProps {
  children: React.ReactNode;
}

const PdfWorkerProvider = ({ children }: PdfWorkerProviderProps) => {
  if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  }

  return <>{children}</>;
};

export { PdfWorkerProvider };
