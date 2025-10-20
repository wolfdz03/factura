import { TRPCError } from "@trpc/server";
import { middleware } from "@/trpc/init";
import { getServerSession } from "@/lib/simple-auth";

export const simpleAuthMiddleware = middleware(async function (options) {
  // Getting Simple Auth Session
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return options.next({
    ctx: {
      auth: {
        user: session.user,
        session: session,
      },
    },
  });
});
