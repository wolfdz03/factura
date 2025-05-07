import Script from "next/script";
import React from "react";

export const OneDollarStatsProvider = ({ children }: { children: React.ReactNode }) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  const isDebug = isDevelopment && { "data-debug": "invoicely.gg" };

  return (
    <>
      <Script defer src="https://assets.onedollarstats.com/stonks.js" {...isDebug} />
      {children}
    </>
  );
};
