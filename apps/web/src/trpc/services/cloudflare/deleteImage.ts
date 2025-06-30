import { cloudflareContextMiddleware } from "@/trpc/middlewares/cloudflareContextMiddleware";
import { authorizedProcedure } from "@/trpc/procedures/authorizedProcedure";
import { NotOwnerError, R2StorageError } from "@/lib/effect/error/trpc";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";
import { z } from "zod";

export const deleteImageFile = authorizedProcedure
  .use(cloudflareContextMiddleware)
  .input(
    z.object({
      key: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.auth.user.id;

    const deleteCloudflareImage = Effect.gen(function* () {
      if (!input.key.startsWith(userId)) {
        return yield* new NotOwnerError({ message: ERROR_MESSAGES.NOT_ALLOWED_TO_DELETE_IMAGE });
      }

      yield* Effect.tryPromise({
        try: () => ctx.cloudflareEnv.R2_IMAGES.delete(input.key),
        catch: (error) => new R2StorageError({ message: parseCatchError(error) }),
      });

      return {
        success: true,
        message: SUCCESS_MESSAGES.IMAGE_DELETED,
      };
    });

    return Effect.runPromise(
      deleteCloudflareImage.pipe(
        Effect.catchTags({
          NotOwnerError: (error) => Effect.fail(new TRPCError({ code: "BAD_REQUEST", message: error.message })),
          R2StorageError: (error) =>
            Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
        }),
      ),
    );
  });
