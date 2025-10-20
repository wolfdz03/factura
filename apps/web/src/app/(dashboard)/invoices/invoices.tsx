"use client";

import { Alert, AlertButtonGroup, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { columnConfig, columns } from "@/components/table-columns/invoices";
import { getAllInvoices } from "@/lib/indexdb-queries/invoice";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useSimpleAuth } from "@/lib/client-simple-auth";
import { useTRPC } from "@/trpc/client";
import React from "react";

const InvoicesPage = () => {
  const trpc = useTRPC();
  const { user: session } = useSimpleAuth();

  // Fetching Invoices from the Postgres (Server)
  const trpcData = useQuery({
    ...trpc.invoice.list.queryOptions(),
    enabled: !!session, // Only fetch if user is logged in
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
    <div className="dash-page gap-4 p-4">
      {trpcData.isError && (
        <Alert variant="destructive">
          <AlertTitle>Échec de la récupération du serveur !</AlertTitle>
          <AlertDescription>
            Nous n&apos;avons pas pu récupérer vos factures depuis le serveur. Veuillez réessayer plus tard.
          </AlertDescription>
          <AlertButtonGroup>
            <Button onClick={() => trpcData.refetch()} variant="destructive" size="xs">
              Réessayer
            </Button>
          </AlertButtonGroup>
        </Alert>
      )}
      <DataTable
        isLoading={isLoading}
        data={data}
        columns={columns}
        columnConfig={columnConfig}
        defaultSorting={[{ id: "createdAt", desc: true }]}
      />
    </div>
  );
};

export default InvoicesPage;
