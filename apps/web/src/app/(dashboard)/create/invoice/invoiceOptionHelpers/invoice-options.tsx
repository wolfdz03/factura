import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EyeScannerIcon, FileDownloadIcon, ImageSparkleIcon, InboxArrowDownIcon } from "@/assets/icons";
import { InvoiceDownloadManagerInstance } from "@/global/instances/invoice/invoice-download-manager";
import { EditInvoicePageSchema } from "@/zod-schemas/invoice/edit-invoice-page";
import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { saveInvoiceToDatabase } from "@/lib/invoice/save-invoice";
import { InvoiceTypeType } from "@invoicely/db/schema/invoice";
import { editInvoice } from "@/lib/invoice/edit-invoice";
import InvoiceErrorsModal from "./invoice-errors-modal";
import { useQueryClient } from "@tanstack/react-query";
import InvoiceTabSwitch from "./invoice-tab-switch";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import ImportInvoice from "./import-invoice";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useTRPC } from "@/trpc/client";
import { AuthUser } from "@/types/auth";

type InvoiceOptionsProps = "view-pdf" | "download-pdf" | "download-png" | "save-invoice-to-database";
type Params = {
  type?: string;
  id?: string;
};

const InvoiceOptions = ({ form }: { form: UseFormReturn<ZodCreateInvoiceSchema> }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const params = useParams() satisfies Params;
  const formValues = form.getValues();
  const user = useUser();

  const handleDropDownAction = async (action: InvoiceOptionsProps) => {
    await InvoiceDownloadManagerInstance.initialize(formValues);

    const { data } = EditInvoicePageSchema.safeParse({
      type: params.type,
      id: params.id,
    });

    // Analytics tracking removed

    switch (action) {
      case "save-invoice-to-database":
        SaveInvoiceToDatabase({ formValues, user, type: data?.type, id: data?.id });
        break;
      case "view-pdf":
        InvoiceDownloadManagerInstance.previewPdf();
        break;
      case "download-pdf":
        InvoiceDownloadManagerInstance.downloadPdf();
        SaveInvoiceToDatabase({ formValues, user, type: data?.type, id: data?.id });
        break;
      case "download-png":
        InvoiceDownloadManagerInstance.downloadPng();
        SaveInvoiceToDatabase({ formValues, user, type: data?.type, id: data?.id });
        break;
      default:
        break;
    }

    // Invalidate Queries
    queryClient.invalidateQueries({
      queryKey: ["idb-invoices", ...(user ? [trpc.invoice.list.queryKey()] : [])],
    });
  };

  return (
    <div className="flex h-12 shrink-0 flex-row items-center justify-between gap-2 border-b px-2">
      <div className="flex flex-row items-center gap-2">
        <InvoiceErrorsModal />
        <ImportInvoice form={form} />
      </div>
      <div className="flex flex-row items-center gap-2">
        <InvoiceTabSwitch />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default">
              <InboxArrowDownIcon />
              Télécharger
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleDropDownAction("save-invoice-to-database")}>
              <InboxArrowDownIcon />
              <span>Enregistrer la facture</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDropDownAction("view-pdf")}>
              <EyeScannerIcon />
              <span>Voir le PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDropDownAction("download-pdf")}>
              <FileDownloadIcon />
              <span>Télécharger le PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDropDownAction("download-png")}>
              <ImageSparkleIcon />
              <span>Télécharger le PNG</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default InvoiceOptions;

const SaveInvoiceToDatabase = ({
  formValues,
  user,
  type,
  id,
}: {
  formValues: ZodCreateInvoiceSchema;
  user: AuthUser | undefined;
  type?: InvoiceTypeType;
  id?: string;
}) => {
  if (id && type) {
    // Edit the old invoice
    editInvoice(formValues, user, type, id);
  } else {
    saveInvoiceToDatabase(formValues, user, type);
  }
};
