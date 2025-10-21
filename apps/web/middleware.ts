import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/simple-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for dashboard routes
  if (pathname.startsWith("/invoices") || 
      pathname.startsWith("/create") || 
      pathname.startsWith("/edit") || 
      pathname.startsWith("/assets")) {
    
    try {
      const session = await getServerSession();
      
      // If user is not authenticated, redirect to login
      if (!session.isAuthenticated || !session.user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      // If there's an error checking authentication, redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
