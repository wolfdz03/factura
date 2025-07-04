"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { useMounted } from "@mantine/hooks";
import { Moon, Sun } from "@/assets/icons";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import React from "react";

const ThemeSwitch = () => {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();
  return mounted ? (
    <Switch defaultChecked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
  ) : null;
};

export default ThemeSwitch;

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const { theme } = useTheme();
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-secondary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-9 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-secondary-foreground pointer-events-none flex size-5 items-center justify-center rounded-full border text-black ring-0 transition-transform duration-300 data-[state=checked]:translate-x-[calc(100%-4px)] data-[state=unchecked]:translate-x-[-4px]",
        )}
      >
        {theme === "dark" ? <Sun className="size-3" /> : <Moon className="size-3" />}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}
