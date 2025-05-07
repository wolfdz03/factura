"use client";

import { type InvoiceTab, invoiceTabAtom } from "@/global/atoms/invoice-atom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useEffect } from "react";
import { useAtom } from "jotai";

const InvoiceTabSwitch = () => {
  const [tab, setTab] = useAtom(invoiceTabAtom);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setTab("form");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return (
    <Tabs
      onValueChange={(value) => {
        setTab(value as InvoiceTab);
      }}
      defaultValue={tab}
      className="w-fit"
    >
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
        <TabsTrigger value="form">Edit</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger className="hidden md:block" value="both">
          Both
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default InvoiceTabSwitch;
