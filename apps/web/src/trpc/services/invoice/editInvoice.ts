import { InternalServerError, NotFoundError } from "@/lib/effect/error/trpc";
import { deleteInvoiceQuery } from "@/lib/db-queries/invoice/deleteInvoice";
import { insertInvoiceQuery } from "@/lib/db-queries/invoice/insertInvoice";
import { authorizedProcedure } from "@/trpc/procedures/authorizedProcedure";
import { createInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { getInvoiceQuery } from "@/lib/db-queries/invoice/getInvoice";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";
import { z } from "zod";

const EditInvoiceSchema = z.object({
  id: z.string(),
  invoice: createInvoiceSchema,
});

export const editInvoice = authorizedProcedure.input(EditInvoiceSchema).mutation(async ({ input, ctx }) => {
  const { id, invoice } = input;

  const editInvoiceEffect = Effect.gen(function* () {
    const oldInvoice = yield* Effect.tryPromise({
      try: () => getInvoiceQuery(id, ctx.auth.user.id),
      catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
    });

    if (!oldInvoice) {
      return yield* new NotFoundError({ message: ERROR_MESSAGES.INVOICE_NOT_FOUND });
    }

    yield* Effect.tryPromise({
      try: () => deleteInvoiceQuery(id, ctx.auth.user.id),
      catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
    });

    yield* Effect.tryPromise({
      try: () => insertInvoiceQuery(invoice, ctx.auth.user.id, oldInvoice.id),
      catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
    });

    return {
      success: true,
      message: SUCCESS_MESSAGES.INVOICE_EDITED,
    };
  });

  return Effect.runPromise(
    editInvoiceEffect.pipe(
      Effect.catchTags({
        NotFoundError: (error) => Effect.fail(new TRPCError({ code: "NOT_FOUND", message: error.message })),
        InternalServerError: (error) =>
          Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
      }),
    ),
  );
});
