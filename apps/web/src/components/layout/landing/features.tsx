import React from "react";

const Features = () => {
  return (
    <div className="grid h-[150px] divide-y divide-dashed sm:grid-cols-3 sm:divide-x">
      <div className="flex h-40 flex-col gap-3 p-4 sm:h-auto">
        <h2 className="jetbrains-mono text-sm font-medium tracking-tight">Beautiful</h2>
        <p className="jetbrains-mono text-muted-foreground text-xs leading-5 tracking-tight">
          professionally designed and visually appealing invoices can increase the chances of clients paying promptly.
        </p>
      </div>
      <div className="flex h-40 flex-col gap-3 p-4 sm:h-auto">
        <h2 className="jetbrains-mono text-sm font-medium tracking-tight">Free & Unlimited</h2>
        <p className="jetbrains-mono text-muted-foreground text-xs leading-5 tracking-tight">
          create and send as many invoices as you need — no limits, no hidden costs, just seamless billing freedom.
        </p>
      </div>
      <div className="flex h-40 flex-col gap-3 p-4 sm:h-auto">
        <h2 className="jetbrains-mono text-sm font-medium tracking-tight">Safe & Open Source</h2>
        <p className="jetbrains-mono text-muted-foreground text-xs leading-5 tracking-tight">
          Your data stays yours — we never track, sell, or share it. Store everything locally or securely on our server
          — the choice is yours.
        </p>
      </div>
    </div>
  );
};

export default Features;
