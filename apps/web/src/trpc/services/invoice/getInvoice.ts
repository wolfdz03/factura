import { InternalServerError, NotFoundError } from "@/lib/effect/error/trpc";
import { authorizedProcedure } from "@/trpc/procedures/authorizedProcedure";
import { getInvoiceQuery } from "@/lib/db-queries/invoice/getInvoice";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { ERROR_MESSAGES } from "@/constants/issues";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";
import { z } from "zod";

const getInvoiceSchema = z.object({
  id: z.string(),
});

export const getInvoice = authorizedProcedure.input(getInvoiceSchema).query(async ({ input, ctx }) => {
  const getInvoiceEffect = Effect.gen(function* () {
    const invoice = yield* Effect.tryPromise({
      try: () => getInvoiceQuery(input.id, ctx.auth.user.id),
      catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
    });

    if (!invoice) {
      return yield* new NotFoundError({ message: ERROR_MESSAGES.INVOICE_NOT_FOUND });
    }

    return {
      ...invoice,
      invoiceFields: {
        ...invoice.invoiceFields,
        items: invoice.invoiceFields.items.map((item) => ({
          ...item,
          unitPrice: item.unitPrice.toNumber(),
        })),
        invoiceDetails: {
          ...invoice.invoiceFields.invoiceDetails,
          billingDetails: invoice.invoiceFields.invoiceDetails.billingDetails.map((billingDetail) => ({
            ...billingDetail,
            value: billingDetail.value.toNumber(),
          })),
        },
      },
    };
  });

  return Effect.runPromise(
    getInvoiceEffect.pipe(
      Effect.catchTags({
        NotFoundError: (error) => Effect.fail(new TRPCError({ code: "NOT_FOUND", message: error.message })),
        InternalServerError: (error) =>
          Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
      }),
    ),
  );
});
