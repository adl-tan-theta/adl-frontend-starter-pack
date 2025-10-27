import { type NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: "Middleware error occurred",
      error: "MIDDLEWARE_ERROR",
      statusCode: 500,
    },
    {
      status: 500,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
  );
}
