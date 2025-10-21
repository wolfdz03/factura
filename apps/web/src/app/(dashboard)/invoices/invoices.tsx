"use client";

import { Alert, AlertButtonGroup, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { columnConfig, columns } from "@/components/table-columns/invoices";
import { getAllInvoices } from "@/lib/indexdb-queries/invoice";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useSimpleAuth } from "@/lib/client-simple-auth";
import { useTRPC } from "@/trpc/client";
import React, { useEffect } from "react";

const InvoicesPage = () => {
  console.log("🔍 INVOICES PAGE: Component rendering");
  
  const trpc = useTRPC();
  const { user: session, isAuthenticated, isLoading: authLoading } = useSimpleAuth();

  // Debug authentication state
  useEffect(() => {
    console.log("🔐 AUTH DEBUG:", {
      session,
      isAuthenticated,
      authLoading,
      hasUser: !!session,
      userId: session?.id,
      userEmail: session?.email
    });
  }, [session, isAuthenticated, authLoading]);

  // Debug TRPC setup
  useEffect(() => {
    console.log("🌐 TRPC DEBUG:", {
      trpcExists: !!trpc,
      trpcMethods: trpc ? Object.keys(trpc) : [],
      invoiceListExists: !!(trpc?.invoice?.list)
    });
  }, [trpc]);

  // Fetching Invoices from the Postgres (Server)
  const trpcData = useQuery({
    ...trpc.invoice.list.queryOptions(),
    enabled: !!session, // Only fetch if user is logged in
  });

  // Debug TRPC query state
  useEffect(() => {
    console.log("📊 TRPC QUERY DEBUG:", {
      isLoading: trpcData.isLoading,
      isError: trpcData.isError,
      error: trpcData.error,
      data: trpcData.data,
      dataLength: trpcData.data?.length,
      enabled: !!session,
      fetchStatus: trpcData.fetchStatus,
      status: trpcData.status
    });
  }, [trpcData.isLoading, trpcData.isError, trpcData.error, trpcData.data, session]);

  // Fetching Invoices from the LocalDB
  const idbData = useQuery({
    queryKey: ["idb-invoices"],
    queryFn: getAllInvoices,
  });

  // Debug IndexedDB query state
  useEffect(() => {
    console.log("💾 INDEXEDDB DEBUG:", {
      isLoading: idbData.isLoading,
      isError: idbData.isError,
      error: idbData.error,
      data: idbData.data,
      dataLength: idbData.data?.length,
      fetchStatus: idbData.fetchStatus,
      status: idbData.status
    });
  }, [idbData.isLoading, idbData.isError, idbData.error, idbData.data]);

  const isLoading = trpcData.isLoading || idbData.isLoading;

  // Combine and ensure data is an array
  const data = [...(trpcData.data ?? []), ...(idbData.data ?? [])];

  // Debug final data
  useEffect(() => {
    console.log("📋 FINAL DATA DEBUG:", {
      trpcDataLength: trpcData.data?.length || 0,
      idbDataLength: idbData.data?.length || 0,
      combinedDataLength: data.length,
      isLoading,
      hasData: data.length > 0,
      data: data
    });
  }, [data, trpcData.data, idbData.data, isLoading]);

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
