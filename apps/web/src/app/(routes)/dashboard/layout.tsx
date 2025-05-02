import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Invoicely | Dashboard",
  description:
    "Invoicely is a simple and easy to use invoice generator ~ Proudly OSS",
  icons: {
    icon: "/official/invoicely-logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <Suspense fallback={<div>Loading...</div>}>
          <main className="p-4">{children}</main>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
