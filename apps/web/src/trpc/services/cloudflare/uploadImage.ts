import { ForbiddenError, PayloadTooLargeError, R2StorageError, ServiceUnavailableError } from "@/lib/effect/error/trpc";
import { cloudflareContextMiddleware } from "@/trpc/middlewares/cloudflareContextMiddleware";
import { getFileSizeFromBase64 } from "@/lib/invoice/get-file-size-from-base64";
import { getUserImagesCount } from "@/lib/cloudflare/r2/getUserImagesCount";
import { authorizedProcedure } from "@/trpc/procedures/authorizedProcedure";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { uploadImage } from "@/lib/cloudflare/r2/uploadImage";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";
import { z } from "zod";

const fileSizes = {
  logo: 400000, // 400kb
  signature: 150000, // 150kb
};

export const uploadImageFile = authorizedProcedure
  .use(cloudflareContextMiddleware)
  .input(
    z.object({
      type: z.enum(["logo", "signature"]),
      base64: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.auth.user.id;

    const uploadImageEffect = Effect.gen(function* () {
      if (!ctx.auth.user.allowedSavingData) {
        return yield* new ForbiddenError({ message: ERROR_MESSAGES.NOT_ALLOWED_TO_SAVE_DATA });
      }

      const userImagesCount = yield* Effect.tryPromise({
        try: () => getUserImagesCount(ctx.cloudflareEnv, userId),
        catch: (error) => new R2StorageError({ message: parseCatchError(error) }),
      });

      if (userImagesCount >= 25) {
        return yield* new ForbiddenError({ message: ERROR_MESSAGES.MAX_IMAGES_REACHED });
      }

      const size = getFileSizeFromBase64(input.base64);

      const typeSize = fileSizes[input.type];

      if (size > typeSize) {
        return yield* new PayloadTooLargeError({
          message: `Image is too large. ${input.type} can only be below ${Math.round(typeSize / 1000)} KB`,
        });
      }

      const image = yield* Effect.tryPromise({
        try: () => uploadImage(ctx.cloudflareEnv, input.base64, userId, input.type),
        catch: (error) => new R2StorageError({ message: parseCatchError(error) }),
      });

      if (!image) {
        return yield* new ServiceUnavailableError({ message: ERROR_MESSAGES.UPLOADING_IMAGE });
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.IMAGE_UPLOADED,
        image: image,
      };
    });

    return Effect.runPromise(
      uploadImageEffect.pipe(
        Effect.catchTags({
          ForbiddenError: (error) => Effect.fail(new TRPCError({ code: "FORBIDDEN", message: error.message })),
          PayloadTooLargeError: (error) =>
            Effect.fail(new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: error.message })),
          R2StorageError: (error) =>
            Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
          ServiceUnavailableError: (error) =>
            Effect.fail(new TRPCError({ code: "SERVICE_UNAVAILABLE", message: error.message })),
        }),
      ),
    );
  });
