import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addCorsHeaders, handleCors } from "@/lib/cors";

export async function POST(request: NextRequest) {
  // Handle CORS preflight requests
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");

    const response = NextResponse.json({ success: true });
    return addCorsHeaders(response, request);
  } catch {
    const response = NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
    return addCorsHeaders(response, request);
  }
}
