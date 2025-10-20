import { CircleCheckIcon, CircleXmarkIcon, LabelInfoIcon, TriangleWarningIcon } from "@/assets/icons";
import { ToasterProps } from "sonner";

export const TOAST_OPTIONS = {
  unstyled: true,
  classNames: {
    icon: "!mt-[1.5px] !pl-[2px]",
    error: "!text-red-500",
    success: "!text-emerald-500",
    info: "!text-primary",
    warning: "!text-orange-500",
    title: "text-xs font-medium mb-0.5",
    toast:
      "group toast !bg-background !p-4 !rounded-xl border !border-border/70 flex flex-row gap-2 !items-start w-full shadow-md select-none",
    description: "!text-secondary-foreground/50 text-xs",
    actionButton:
      "bg-black text-white min-w-max px-2 py-0.5 !text-[11px] h-fit !rounded-sm cursor-pointer duration-200",
    cancelButton:
      "!text-black !text-[11px] h-fit !rounded-sm min-w-max px-2 py-0.5 bg-zinc-200 cursor-pointer duration-200",
  },
} satisfies ToasterProps["toastOptions"];

export const TOAST_ICONS = {
  error: <CircleXmarkIcon className="size-4" />,
  success: <CircleCheckIcon className="size-4" />,
  warning: <TriangleWarningIcon className="size-4" />,
  info: <LabelInfoIcon className="size-4" />,
} satisfies ToasterProps["icons"];
