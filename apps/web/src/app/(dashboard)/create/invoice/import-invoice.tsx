import { createInvoiceSchemaDefaultValues, ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import * as React from "react";

import { columnConfig, invoiceSelectorColumns } from "@/components/table-columns/invoices";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getAllInvoices } from "@/lib/indexdb-queries/invoice";
import { DataTable } from "@/components/ui/data-table";
import { InboxArrowDownIcon } from "@/assets/icons";
import { Invoice } from "@/types/common/invoice";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/client-auth";
import { useTRPC } from "@/trpc/client";
import { Undo2 } from "lucide-react";

const ImportInvoice = ({ form }: { form: UseFormReturn<ZodCreateInvoiceSchema> }) => {
  const [open, setOpen] = React.useState(false);
  const [importedInvoice, setImportedInvoice] = React.useState<Invoice | null>(null);

  const trpc = useTRPC();
  const { data: session } = useSession();

  // Fetching Invoices from the Postgres (Server)
  const trpcData = useQuery({
    ...trpc.invoice.list.queryOptions(),
    enabled: !!session?.user, // Only fetch if user is logged in
  });

  // Fetching Invoices from the LocalDB
  const idbData = useQuery({
    queryKey: ["idb-invoices"],
    queryFn: getAllInvoices,
  });

  const isLoading = trpcData.isLoading || idbData.isLoading;

  // Combine and ensure data is an array
  const data = [...(trpcData.data ?? []), ...(idbData.data ?? [])];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {!importedInvoice ? (
          <Button variant="outline">
            <InboxArrowDownIcon /> Import from saved invoices
          </Button>
        ) : (
          <Button>
            <InboxArrowDownIcon />
            {`Imported ${importedInvoice.invoiceFields.invoiceDetails.prefix}${importedInvoice.invoiceFields.invoiceDetails.serialNumber}`}
          </Button>
        )}
      </PopoverTrigger>
      {importedInvoice && (
        <Button
          variant={"outline"}
          onClick={() => {
            form.reset(createInvoiceSchemaDefaultValues);
            setImportedInvoice(null);
          }}
        >
          <Undo2 />
          Reset
        </Button>
      )}
      <PopoverContent className="w-200" align="start">
        <DataTable
          isLoading={isLoading}
          data={data}
          columns={invoiceSelectorColumns}
          columnConfig={columnConfig}
          defaultSorting={[{ id: "createdAt", desc: true }]}
          onRowClick={(invoice: Invoice) => {
            if (invoice.type === "local") {
              // we need to convert image url and sig url to local base64
              const invoiceFields = invoice.invoiceFields;
              const imageBase64 = invoiceFields.companyDetails.logoBase64;
              const sigBase64 = invoiceFields.companyDetails.signatureBase64;

              if (!invoiceFields.companyDetails.logo?.startsWith("https://")) {
                invoiceFields.companyDetails.logo = imageBase64;
              }
              if (!invoiceFields.companyDetails.signature?.startsWith("https://")) {
                invoiceFields.companyDetails.signature = sigBase64;
              }
            }
            form.reset(invoice.invoiceFields);
            setImportedInvoice(invoice);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ImportInvoice;
