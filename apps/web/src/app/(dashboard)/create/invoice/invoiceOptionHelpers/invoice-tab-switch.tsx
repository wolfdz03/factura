"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EyeScannerIcon, FileFeatherIcon, FileTreeIcon } from "@/assets/icons";
import { type InvoiceTab, invoiceTabAtom } from "@/global/atoms/invoice-atom";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useEffect } from "react";
import { useAtom } from "jotai";

const InvoiceTabSwitch = () => {
  const [tab, setTab] = useAtom(invoiceTabAtom);
  const isMobile = useIsMobile();

  const handleTabChange = (tab: InvoiceTab) => {
    setTab(tab);
  };

  // if is mobile and both then we need to force set form
  // because we cant show both on mobile
  useEffect(() => {
    if (isMobile && tab === "both") {
      setTab("form");
    }
  }, [isMobile, tab, setTab]);

  return (
    <Select onValueChange={handleTabChange} value={tab} defaultValue={tab}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Sélectionner un onglet" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          <SelectItem value="form">
            <FileFeatherIcon />
            <span>Formulaire</span>
          </SelectItem>
          <SelectItem value="preview">
            <EyeScannerIcon />
            <span>Aperçu</span>
          </SelectItem>
          <SelectItem className="hidden md:flex" value="both">
            <FileTreeIcon />
            <span>Les deux</span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default InvoiceTabSwitch;
