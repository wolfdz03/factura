import { FolderFeatherIcon, ReceiptIcon, VersionsIcon } from "@/assets/icons";
import type { ISidebar } from "@/types";
import { LINKS } from "./links";

export const SIDEBAR_ITEMS: ISidebar = {
  Create: [
    {
      name: "Créer une facture",
      url: LINKS.CREATE.INVOICE,
      icon: <ReceiptIcon />,
    },
  ],
};
