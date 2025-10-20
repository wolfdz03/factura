import { authorizedProcedure } from "@/trpc/procedures/authorizedProcedure";
import { NotOwnerError, R2StorageError } from "@/lib/effect/error/trpc";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import { supabaseMiddleware } from "@/trpc/middlewares/supabaseMiddleware";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { deleteImage } from "@/lib/supabase/storage";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";
import { z } from "zod";

export const deleteImageFile = authorizedProcedure
  .use(supabaseMiddleware)
  .input(
    z.object({
      key: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.auth.user.id;

    // Delete Image Effect
    const deleteSupabaseImage = Effect.gen(function* () {
      // Check if the image is owned by the user
      if (!input.key.startsWith(userId)) {
        return yield* new NotOwnerError({ message: ERROR_MESSAGES.NOT_ALLOWED_TO_DELETE_IMAGE });
      }

      // Now, as image is owned by the user, we can delete it
      // Delete the image from Supabase Storage
      yield* Effect.tryPromise({
        try: () => deleteImage(input.key),
        catch: (error) => new R2StorageError({ message: parseCatchError(error) }),
      });

      // Return the success message
      return {
        success: true,
        message: SUCCESS_MESSAGES.IMAGE_DELETED,
      };
    });

    // Run the effect
    return Effect.runPromise(
      deleteSupabaseImage.pipe(
        Effect.catchTags({
          // If the image is not owned by the user, return a bad request error
          NotOwnerError: (error) => Effect.fail(new TRPCError({ code: "BAD_REQUEST", message: error.message })),
          // If the image is owned by the user, but the deletion fails, return an internal server error
          R2StorageError: (error) =>
            Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
        }),
      ),
    );
  });
