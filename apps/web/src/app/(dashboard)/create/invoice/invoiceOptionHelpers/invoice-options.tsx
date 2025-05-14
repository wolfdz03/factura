import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EyeScannerIcon, FileDownloadIcon, ImageSparkleIcon, InboxArrowDownIcon } from "@/assets/icons";
import { InvoiceDownloadManagerInstance } from "@/global/instances/invoice/invoice-download-manager";
import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { PostHogAnalytics } from "@/components/ui/posthog-analytics";
import InvoiceErrorsModal from "./invoice-errors-modal";
import InvoiceTabSwitch from "./invoice-tab-switch";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";

const InvoiceOptions = ({ form }: { form: UseFormReturn<ZodCreateInvoiceSchema> }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (isDropdownOpen) {
      InvoiceDownloadManagerInstance.initialize(form.getValues());
    }
  }, [isDropdownOpen, form]);

  return (
    <div className="flex h-12 shrink-0 flex-row items-center justify-between gap-2 border-b px-2">
      <InvoiceErrorsModal />
      <div className="flex flex-row items-center gap-2">
        <InvoiceTabSwitch />

        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="default">
              <InboxArrowDownIcon />
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <PostHogAnalytics analytics={{ name: "view-invoice-action", group: "create-invoice-page" }}>
              <DropdownMenuItem onClick={() => InvoiceDownloadManagerInstance.previewPdf()}>
                <EyeScannerIcon />
                <span>View PDF</span>
              </DropdownMenuItem>
            </PostHogAnalytics>
            <PostHogAnalytics analytics={{ name: "download-invoice-action", group: "create-invoice-page" }}>
              <DropdownMenuItem onClick={() => InvoiceDownloadManagerInstance.downloadPdf()}>
                <FileDownloadIcon />
                <span>Download PDF</span>
              </DropdownMenuItem>
            </PostHogAnalytics>
            <PostHogAnalytics analytics={{ name: "download-invoice-png-action", group: "create-invoice-page" }}>
              <DropdownMenuItem onClick={() => InvoiceDownloadManagerInstance.downloadPng()}>
                <ImageSparkleIcon />
                <span>Download PNG</span>
              </DropdownMenuItem>
            </PostHogAnalytics>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default InvoiceOptions;
