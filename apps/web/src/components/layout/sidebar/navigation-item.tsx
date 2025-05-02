"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

import { type ISidebarItem } from "@/types";
import Link from "next/link";

export function NavigationItem({
  title,
  items,
}: {
  title: string;
  items: ISidebarItem[];
}) {
  const pathname = usePathname();

  console.log("pathname", pathname);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                variant={isActive ? "active" : "default"}
              >
                <Link href={item.url}>
                  <span className="">{item.icon}</span>
                  <span className="text-sm font-medium tracking-tight">
                    {item.name}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
