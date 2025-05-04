import { ZodError } from "zod";
import { atom } from "jotai";

export const invoiceErrorAtom = atom<ZodError["issues"]>([]);
