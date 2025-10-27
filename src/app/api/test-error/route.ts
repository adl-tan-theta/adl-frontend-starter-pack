import type { NextRequest } from "next/server";
import {
  apiHandler,
  createSuccessResponse,
  InternalServerError,
  NotFoundError,
  RateLimitError,
  ValidationError,
} from "@/lib/apiHandler";

export const GET = apiHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const errorType = url.searchParams.get("type");

  switch (errorType) {
    case "validation":
      throw new ValidationError("Invalid input data provided");

    case "not-found":
      throw new NotFoundError("User");

    case "server":
      throw new InternalServerError("Database connection failed");

    case "rate-limit":
      throw new RateLimitError("Too many requests from this IP");

    case "success":
      return createSuccessResponse({
        message: "This is a successful response",
      });

    default:
      return createSuccessResponse({
        message: "Error testing endpoint",
        availableTypes: [
          "validation",
          "not-found",
          "server",
          "rate-limit",
          "success",
        ],
      });
  }
});
