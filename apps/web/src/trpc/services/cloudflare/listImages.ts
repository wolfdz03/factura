import { cloudflareContextMiddleware } from "@/trpc/middlewares/cloudflareContextMiddleware";
import { authorizedProcedure } from "@/trpc/procedures/authorizedProcedure";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { R2StorageError } from "@/lib/effect/error/trpc";
import { SUCCESS_MESSAGES } from "@/constants/issues";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";

export const listImages = authorizedProcedure.use(cloudflareContextMiddleware).query(({ ctx }) => {
  const userId = ctx.auth.user.id;

  const listImages = Effect.gen(function* () {
    const images = yield* Effect.tryPromise({
      try: () => ctx.cloudflareEnv.R2_IMAGES.list({ prefix: `${userId}/` }),
      catch: (error) => new R2StorageError({ message: parseCatchError(error) }),
    });

    const mappedImageKeys = images.objects.map((image) => image.key);

    return {
      success: true,
      message: SUCCESS_MESSAGES.IMAGES_FETCHED,
      images: mappedImageKeys,
      count: images.objects.length,
    };
  });

  return Effect.runPromise(
    listImages.pipe(
      Effect.catchTags({
        R2StorageError: (error) =>
          Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
      }),
    ),
  );
});
