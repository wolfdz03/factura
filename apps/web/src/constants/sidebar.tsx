import { FolderFeatherIcon, ReceiptIcon, VersionsIcon } from "@/assets/icons";
import type { ISidebar } from "@/types";
import { LINKS } from "./links";

export const SIDEBAR_ITEMS: ISidebar = {
  Création: [
    {
      name: "Créer une facture",
      url: LINKS.CREATE.INVOICE,
      icon: <ReceiptIcon />,
    },
  ],
  Gérer: [
    {
      name: "Factures",
      url: LINKS.INVOICES,
      icon: <VersionsIcon />,
    },
  ],
};
