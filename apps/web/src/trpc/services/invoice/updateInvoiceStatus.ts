import { BadRequestError, InternalServerError, NotFoundError } from "@/lib/effect/error/trpc";
import { authorizedProcedure } from "@/trpc/procedures/authorizedProcedure";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { invoiceStatusEnum } from "@invoicely/db/schema/invoice";
import { db, schema } from "@invoicely/db";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { Effect } from "effect";
import { z } from "zod";

const updateInvoiceStatusSchema = z.object({
  id: z.string(),
  status: z.enum(invoiceStatusEnum.enumValues),
});

export const updateInvoiceStatus = authorizedProcedure
  .input(updateInvoiceStatusSchema)
  .mutation(async ({ ctx, input }) => {
    const updateInvoiceStatusEffect = Effect.gen(function* () {
      const invoice = yield* Effect.tryPromise({
        try: () =>
          db.query.invoices.findFirst({
            where: (_invoice, { eq, and }) => and(eq(_invoice.id, input.id), eq(_invoice.userId, ctx.auth.user.id)),
          }),
        catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
      });

      if (!invoice) {
        return yield* new NotFoundError({ message: ERROR_MESSAGES.INVOICE_NOT_FOUND });
      }

      if (invoice.status === input.status) {
        return yield* new BadRequestError({ message: ERROR_MESSAGES.TRY_UPDATING_TO_DIFFERENT_STATUS });
      }

      yield* Effect.tryPromise({
        try: () =>
          db
            .update(schema.invoices)
            .set({ status: input.status, paidAt: input.status === "success" ? new Date() : null })
            .where(and(eq(schema.invoices.id, input.id), eq(schema.invoices.userId, ctx.auth.user.id))),
        catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
      });

      return {
        success: true,
        message: SUCCESS_MESSAGES.INVOICE_STATUS_UPDATED,
      };
    });

    return Effect.runPromise(
      updateInvoiceStatusEffect.pipe(
        Effect.catchTags({
          NotFoundError: (error) => Effect.fail(new TRPCError({ code: "NOT_FOUND", message: error.message })),
          BadRequestError: (error) => Effect.fail(new TRPCError({ code: "BAD_REQUEST", message: error.message })),
          InternalServerError: (error) =>
            Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
        }),
      ),
    );
  });
