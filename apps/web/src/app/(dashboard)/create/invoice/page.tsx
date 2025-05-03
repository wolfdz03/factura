"use client";

import {
  createInvoiceSchema,
  createInvoiceSchemaDefaultValues,
  type ZodCreateInvoiceSchema,
} from "@/zod-schemas/invoice/create-invoice";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import InvoiceOptions from "./invoiceHelpers/invoice-options";
import { zodResolver } from "@hookform/resolvers/zod";
import InvoicePreview from "./invoice-preview";
import { useForm } from "react-hook-form";
import InvoiceForm from "./invoice-form";
import React from "react";

const Page = () => {
  const form = useForm<ZodCreateInvoiceSchema>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: createInvoiceSchemaDefaultValues,
  });

  return (
    <div className="flex h-full flex-col">
      <InvoiceOptions />
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel minSize={50} defaultSize={50}>
          <InvoiceForm form={form} />
        </ResizablePanel>
        <ResizablePanel minSize={50} defaultSize={50}>
          <InvoicePreview id="form-pdf-preview" data={form.getValues()} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Page;
