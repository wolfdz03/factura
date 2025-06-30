import { ForbiddenError, InternalServerError } from "@/lib/effect/error/trpc";
import { insertInvoiceQuery } from "@/lib/db-queries/invoice/insertInvoice";
import { authorizedProcedure } from "@/trpc/procedures/authorizedProcedure";
import { createInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";

interface MutationResponse {
  success: boolean;
  message: string;
  invoiceId?: string;
}

export const insertInvoice = authorizedProcedure
  .input(createInvoiceSchema)
  .mutation<MutationResponse>(async ({ ctx, input }) => {
    const insertInvoiceEffect = Effect.gen(function* () {
      if (!ctx.auth.user.allowedSavingData) {
        return yield* new ForbiddenError({ message: ERROR_MESSAGES.NOT_ALLOWED_TO_SAVE_DATA });
      }

      const invoiceId = yield* Effect.tryPromise({
        try: () => insertInvoiceQuery(input, ctx.auth.user.id),
        catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
      });

      return {
        success: true,
        message: SUCCESS_MESSAGES.INVOICE_SAVED,
        invoiceId,
      };
    });

    return Effect.runPromise(
      insertInvoiceEffect.pipe(
        Effect.catchTags({
          ForbiddenError: (error) => Effect.fail(new TRPCError({ code: "FORBIDDEN", message: error.message })),
          InternalServerError: (error) =>
            Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
        }),
      ),
    );
  });
