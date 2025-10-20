import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/simple-auth";

export async function GET() {
  try {
    const session = await getServerSession();

    if (session.isAuthenticated && session.user) {
      return NextResponse.json(session.user);
    } else {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
