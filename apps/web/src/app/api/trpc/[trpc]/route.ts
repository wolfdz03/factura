import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc/routers/_app";
import { createTRPCContext } from "@/trpc/init";
import { addCorsHeaders, handleCors } from "@/lib/cors";
import { NextRequest, NextResponse } from "next/server";

// TRPC
const handler = async (req: NextRequest) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) {
    return corsResponse;
  }

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

  // Add CORS headers to the response
  return addCorsHeaders(NextResponse.json(await response.json(), { 
    status: response.status,
    statusText: response.statusText 
  }), req);
};

export { handler as GET, handler as POST };
