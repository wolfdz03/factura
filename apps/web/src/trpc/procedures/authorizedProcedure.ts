import { simpleAuthMiddleware } from "@/trpc/middlewares/simpleAuthMiddleware";
import { baseProcedure } from "@/trpc/init";

// This procedure will be used to check if the user is authorized
export const authorizedProcedure = baseProcedure.use(simpleAuthMiddleware);
