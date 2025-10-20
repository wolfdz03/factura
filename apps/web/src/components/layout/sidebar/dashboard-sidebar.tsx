"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavigationUser } from "@/components/layout/sidebar/navigation-user";
import { NavigationItem } from "@/components/layout/sidebar/navigation-item";
import OpenSourceBadge from "@/components/ui/open-source-badge";
import LogoIcon from "@/components/assets/logo-icon";
import { SIDEBAR_ITEMS } from "@/constants/sidebar";

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-secondary-foreground select-none" variant="default" size="lg" asChild>
              <div className="flex items-center gap-2">
                <LogoIcon className="h-8 w-8" />
                <div className="instrument-serif text-xl font-semibold">Factures</div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {Object.keys(SIDEBAR_ITEMS).map((key) => (
          <NavigationItem key={key} title={key} items={SIDEBAR_ITEMS[key]} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <OpenSourceBadge />
        <NavigationUser />
      </SidebarFooter>
    </Sidebar>
  );
}
