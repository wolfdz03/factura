import { NextRequest, NextResponse } from "next/server";

export function addCorsHeaders(response: NextResponse, request: NextRequest) {
  const origin = request.headers.get("origin");
  
  // Define allowed origins
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001", 
    "https://factura-duan.onrender.com",
    "https://suzali-facture.onrender.com",
    // Add your production domains here
  ];

  // Check if the origin is allowed
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", isAllowedOrigin ? origin : allowedOrigins[0]);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours

  return response;
}

export function handleCors(request: NextRequest) {
  // Handle preflight requests
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 200 });
    return addCorsHeaders(response, request);
  }
  
  return null;
}
