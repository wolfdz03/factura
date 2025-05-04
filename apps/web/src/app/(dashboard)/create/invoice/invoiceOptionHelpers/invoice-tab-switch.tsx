"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { invoiceTabAtom } from "@/global/atoms/invoice-atom";
import { useAtom } from "jotai";
import React from "react";

const InvoiceTabSwitch = () => {
  const [tab, setTab] = useAtom(invoiceTabAtom);
  return (
    <Tabs
      onValueChange={(value) => {
        setTab(value as "preview" | "form");
      }}
      defaultValue={tab}
      className="w-fit"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="form">Edit</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default InvoiceTabSwitch;
