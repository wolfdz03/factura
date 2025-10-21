import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/simple-auth";
import { addCorsHeaders, handleCors } from "@/lib/cors";

export async function GET(request: NextRequest) {
  // Handle CORS preflight requests
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const session = await getServerSession();

    if (session.isAuthenticated && session.user) {
      const response = NextResponse.json(session.user);
      return addCorsHeaders(response, request);
    } else {
      const response = NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
      return addCorsHeaders(response, request);
    }
  } catch {
    const response = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
    return addCorsHeaders(response, request);
  }
}
