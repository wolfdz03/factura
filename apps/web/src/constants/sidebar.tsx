import { ReceiptIcon, SquareWandSparkleIcon, GaugeIcon } from "@/assets/icons";
import type { ISidebar } from "@/types";

export const SIDEBAR_ITEMS: ISidebar = {
  Navigation: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: <SquareWandSparkleIcon />,
    },
    {
      name: "Invoices",
      url: "/invoices",
      icon: <ReceiptIcon />,
    },
    {
      name: "Analytics",
      url: "/analytics",
      icon: <GaugeIcon />,
    },
  ],
};
