import { FolderFeatherIcon, ReceiptIcon, VersionsIcon } from "@/assets/icons";
import type { ISidebar } from "@/types";
import { LINKS } from "./links";

export const SIDEBAR_ITEMS: ISidebar = {
  Navigation: [
    {
      name: "Factures",
      url: LINKS.INVOICES,
      icon: <VersionsIcon />,
    },
    {
      name: "Gérer les actifs",
      url: LINKS.ASSETS,
      icon: <FolderFeatherIcon />,
    },
  ],
  Create: [
    {
      name: "Créer une facture",
      url: LINKS.CREATE.INVOICE,
      icon: <ReceiptIcon />,
    },
  ],
};
