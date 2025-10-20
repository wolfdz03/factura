import { ModernCardDescription, ModernCardTitle } from "@/components/ui/modern-card";
import React from "react";

const Features = () => {
  return (
    <div className="grid grid-flow-row sm:h-[150px] sm:grid-cols-3">
      <div className="flex h-40 flex-col gap-3 border-b border-dashed p-4 sm:h-auto">
        <ModernCardTitle>Magnifique</ModernCardTitle>
        <ModernCardDescription>
          Des factures conçues professionnellement et visuellement attrayantes peuvent augmenter les chances que les clients paient rapidement.
        </ModernCardDescription>
      </div>
      <div className="flex h-40 flex-col gap-3 border-b border-dashed p-4 sm:h-auto sm:border-l">
        <ModernCardTitle>Gratuit et illimité</ModernCardTitle>
        <ModernCardDescription>
          Créez et envoyez autant de factures que nécessaire — aucune limite, aucun coût caché, juste une liberté de facturation fluide.
        </ModernCardDescription>
      </div>
      <div className="flex h-40 flex-col gap-3 border-b border-dashed p-4 sm:h-auto sm:border-l">
        <ModernCardTitle>Sécurisé et Open Source</ModernCardTitle>
        <ModernCardDescription>
          Vos données restent les vôtres — nous ne les suivons, ne les vendons ou ne les partageons jamais. Stockez tout localement ou en toute sécurité sur notre serveur — le choix vous appartient.
        </ModernCardDescription>
      </div>
    </div>
  );
};

export default Features;
