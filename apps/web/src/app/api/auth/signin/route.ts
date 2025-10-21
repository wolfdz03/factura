import { NextRequest, NextResponse } from "next/server";
import { signIn, createSession } from "@/lib/simple-auth";
import { cookies } from "next/headers";
import { addCorsHeaders, handleCors } from "@/lib/cors";

export async function POST(request: NextRequest) {
  // Handle CORS preflight requests
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await signIn(email, password);

    if (result.success && result.user) {
      const token = await createSession(result.user);
      
      const cookieStore = await cookies();
      cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      const response = NextResponse.json({
        success: true,
        user: result.user,
      });
      return addCorsHeaders(response, request);
    } else {
      const response = NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
      return addCorsHeaders(response, request);
    }
  } catch {
    const response = NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
    return addCorsHeaders(response, request);
  }
}
