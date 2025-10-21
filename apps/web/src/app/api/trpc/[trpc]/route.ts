import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc/routers/_app";
import { createTRPCContext } from "@/trpc/init";

// TRPC
const handler = (req: Request) => {
  console.log("🚀 TRPC HANDLER: Request received");
  console.log("🚀 TRPC HANDLER: Method:", req.method);
  console.log("🚀 TRPC HANDLER: URL:", req.url);
  console.log("🚀 TRPC HANDLER: Headers:", Object.fromEntries(req.headers.entries()));
  
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
};

export { handler as GET, handler as POST };
