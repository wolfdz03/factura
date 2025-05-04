import { ZodError } from "zod";
import { atom } from "jotai";

// Invoice Form Error Issues For Error Modal
export const invoiceErrorAtom = atom<ZodError["issues"]>([]);

// Invoice Form Tab For Preview and Form Tab Switching
export const invoiceTabAtom = atom<"preview" | "form">("form");
