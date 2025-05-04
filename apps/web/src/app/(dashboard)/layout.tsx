import DashboardSidebarHeader from "@/components/layout/sidebar/dashboard-sidebar-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/sidebar";
import type { Metadata } from "next";
// import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Invoicely | Dashboard",
  description: "Invoicely is a simple and easy to use invoice generator ~ Proudly OSS",
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
        <div className="dash-page h-full overflow-hidden">
          <DashboardSidebarHeader />
          {/* <Suspense fallback={<div>Loading...</div>}> */}
          <main className="dash-layout-page-content-height">{children}</main>
          {/* </Suspense> */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
