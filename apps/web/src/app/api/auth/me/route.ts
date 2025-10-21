import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/simple-auth";

export async function GET(request: NextRequest) {
  console.log("🔐 AUTH/ME: Request received");
  console.log("🔐 AUTH/ME: URL:", request.url);
  console.log("🔐 AUTH/ME: Headers:", Object.fromEntries(request.headers.entries()));
  
  try {
    console.log("🔐 AUTH/ME: Getting server session");
    const session = await getServerSession();
    console.log("🔐 AUTH/ME: Session result:", {
      isAuthenticated: session.isAuthenticated,
      hasUser: !!session.user,
      userId: session.user?.id,
      userEmail: session.user?.email
    });

    if (session.isAuthenticated && session.user) {
      console.log("🔐 AUTH/ME: Returning user data");
      return NextResponse.json(session.user);
    } else {
      console.log("🔐 AUTH/ME: Not authenticated, returning 401");
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.log("🔐 AUTH/ME: Error occurred:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}