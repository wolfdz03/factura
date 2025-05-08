"use client";

import {
  createInvoiceSchema,
  createInvoiceSchemaDefaultValues,
  type ZodCreateInvoiceSchema,
} from "@/zod-schemas/invoice/create-invoice";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import InvoiceOptions from "./invoiceOptionHelpers/invoice-options";
import { ImperativePanelHandle } from "react-resizable-panels";
import { invoiceTabAtom } from "@/global/atoms/invoice-atom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useEffect, useRef } from "react";
import InvoicePreview from "./invoice-preview";
import { useForm } from "react-hook-form";
import InvoiceForm from "./invoice-form";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";

const Page = () => {
  const invoiceFormPanelRef = useRef<ImperativePanelHandle>(null);
  const invoicePreviewPanelRef = useRef<ImperativePanelHandle>(null);
  const [invoiceTab, setInvoiceTab] = useAtom(invoiceTabAtom);
  const isMobile = useIsMobile();

  // Form
  const form = useForm<ZodCreateInvoiceSchema>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: createInvoiceSchemaDefaultValues,
  });

  // Collapse or expand the panels based on the invoiceTab value
  useEffect(() => {
    const invoicePanel = invoiceFormPanelRef.current;
    const invoicePreviewPanel = invoicePreviewPanelRef.current;

    if (!invoicePanel || !invoicePreviewPanel) return;

    if (isMobile && invoiceTab === "both") {
      setInvoiceTab("form");
    }

    switch (invoiceTab) {
      case "form":
        return invoicePreviewPanelRef.current?.collapse();
      case "preview":
        return invoiceFormPanelRef.current?.collapse();
      case "both":
        if (invoicePanel.isCollapsed()) {
          return invoicePanel.expand();
        }
        if (invoicePreviewPanel.isCollapsed()) {
          return invoicePreviewPanel.expand();
        }
    }
  }, [invoiceTab, isMobile, setInvoiceTab]);

  return (
    <div className="flex h-full flex-col">
      <InvoiceOptions form={form} />
      <ResizablePanelGroup direction="horizontal" className="divide-x">
        <ResizablePanel collapsible={true} defaultSize={50} ref={invoiceFormPanelRef}>
          <InvoiceForm form={form} />
        </ResizablePanel>
        <ResizablePanel
          className={cn(invoiceTab === "both" ? "hidden md:flex" : "flex")}
          collapsible={true}
          defaultSize={50}
          ref={invoicePreviewPanelRef}
        >
          <InvoicePreview form={form} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Page;
