"use client";

import {
  createInvoiceSchema,
  createInvoiceSchemaDefaultValues,
  type ZodCreateInvoiceSchema,
} from "@/zod-schemas/invoice/create-invoice";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import InvoiceOptions from "./invoiceOptionHelpers/invoice-options";
import { invoiceTabAtom } from "@/global/atoms/invoice-atom";
import { zodResolver } from "@hookform/resolvers/zod";
import InvoicePreview from "./invoice-preview";
import { useForm } from "react-hook-form";
import InvoiceForm from "./invoice-form";
import { useAtomValue } from "jotai";
import React from "react";

const Page = () => {
  const invoiceTab = useAtomValue(invoiceTabAtom);
  const form = useForm<ZodCreateInvoiceSchema>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: createInvoiceSchemaDefaultValues,
  });

  return (
    <div className="flex h-full flex-col">
      <InvoiceOptions form={form} />
      <ResizablePanelGroup direction="horizontal" className="divide-x">
        {(invoiceTab === "form" || invoiceTab === "both") && (
          <ResizablePanel>
            <InvoiceForm form={form} />
          </ResizablePanel>
        )}
        {(invoiceTab === "preview" || invoiceTab === "both") && (
          <ResizablePanel>
            <InvoicePreview form={form} />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default Page;
