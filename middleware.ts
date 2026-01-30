import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * ✅ Helper: Safely parse TRUSTED_ORIGINS from environment
 */
function getTrustedOrigins(): string[] {
  try {
    const raw = (process.env.TRUSTED_ORIGINS || "")
    .toString();

    return raw
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
  } catch (err) {
    console.error("❌ Failed to parse TRUSTED_ORIGINS:", err);
    return [];
  }
}

/**
 * ✅ Helper: Build CORS headers
 */
function getCorsHeaders(origin: string) {
  const trusted = getTrustedOrigins();
  const allowedOrigin = trusted.includes(origin) ? origin : trusted[0] || "*";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

/**
 * ✅ Main Middleware with error handling and CORS support
 */
export function middleware(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || "";
    const isPreflight = req.method === "OPTIONS";

    const headers = getCorsHeaders(origin);
    const res = isPreflight
      ? new NextResponse(null, { status: 204 })
      : NextResponse.next();

    // Apply CORS headers
    Object.entries(headers).forEach(([key, value]) => res.headers.set(key, value));

    // ✅ Handle preflight OPTIONS requests
    if (isPreflight) {
      res.headers.set("Content-Length", "0");
      return res;
    }

    // ✅ Log blocked origins for debugging (safe server-side only)
    const trusted = getTrustedOrigins();
    if (origin && !trusted.includes(origin)) {
      console.warn(`⚠️  [CORS] Blocked untrusted origin: ${origin}`);
    }

    return res;
  } catch (error) {
    console.error("🔥 Middleware error:", error);

    // Return generic JSON error for API routes
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Internal middleware error",
        error: (error as Error).message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * ✅ Limit middleware to API routes only (performance optimization)
 */
export const config = {
  matcher: ["/api/:path*"],
};
