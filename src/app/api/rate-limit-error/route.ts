import { type NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: "Too many requests. Please try again later.",
      error: "RATE_LIMIT_EXCEEDED",
      statusCode: 429,
    },
    {
      status: 429,
      headers: {
        "Retry-After": "60",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
  );
}
