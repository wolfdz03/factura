import { FileAlertIcon } from "@/assets/icons";
import React from "react";

const PDFLoading = ({
  message = "Génération du PDF",
  description = "Veuillez patienter pendant que nous générons le PDF",
}: {
  message?: string;
  description?: string;
}) => {
  return (
    <div className="bg-background flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-muted-foreground/10 text-muted-forebg-muted-foreground flex h-14 w-14 items-center justify-center rounded-lg">
          <FileAlertIcon />
        </div>
        <div className="flex flex-col">
          <p className="text-muted-foreground font-semibold">{message}</p>
          <p className="text-muted-foreground max-w-md text-xs">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default PDFLoading;
