import { type NextRequest, NextResponse } from "next/server";
import { withSpan, setAttributes, addEvent } from "./telemetry";

// Error types for better error handling
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(400, message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = "Resource") {
    super(404, `${resource} not found`, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(401, message, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden") {
    super(403, message, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = "Too many requests") {
    super(429, message, "RATE_LIMIT_EXCEEDED");
    this.name = "RateLimitError";
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = "Internal server error") {
    super(500, message, "INTERNAL_SERVER_ERROR");
    this.name = "InternalServerError";
  }
}

// API Handler wrapper for error handling
export function apiHandler<T = any>(
  handler: (req: NextRequest) => Promise<NextResponse<T>>,
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const method = req.method;
    const url = req.url;

    return withSpan(
      `${method} ${new URL(url).pathname}`,
      async () => {
        try {
          setAttributes({
            "http.method": method,
            "http.url": url,
            "http.user_agent": req.headers.get("user-agent") || "unknown",
          });

          const response = await handler(req);

          const duration = Date.now() - startTime;
          setAttributes({
            "http.status_code": response.status,
            "http.response_time_ms": duration,
          });

          addEvent("api.request.completed", {
            status: response.status.toString(),
            duration: duration.toString(),
          });

          return response;
        } catch (error) {
          const duration = Date.now() - startTime;

          setAttributes({
            "http.status_code": 500,
            "http.response_time_ms": duration,
            error: "true",
          });

          addEvent("api.request.error", {
            error: error instanceof Error ? error.message : "Unknown error",
            duration: duration.toString(),
          });

          console.error("API Error:", error);

          // Handle known API errors
          if (error instanceof ApiError) {
            return NextResponse.json(
              {
                success: false,
                message: error.message,
                code: error.code,
                ...(process.env.NODE_ENV === "development" && {
                  stack: error.stack,
                }),
              },
              { status: error.statusCode },
            );
          }

          // Handle unknown errors
          const errorId = Math.random().toString(36).substring(2, 15);

          // In production, this would be sent to OpenTelemetry
          if (process.env.NODE_ENV === "production") {
            // OpenTelemetry error tracking would go here
          }

          return NextResponse.json(
            {
              success: false,
              message: "Internal server error",
              code: "INTERNAL_SERVER_ERROR",
              ...(process.env.NODE_ENV === "development" && {
                error: error instanceof Error ? error.message : "Unknown error",
                errorId,
              }),
            },
            { status: 500 },
          );
        }
      },
      {
        "api.endpoint": new URL(url).pathname,
        "api.method": method,
      },
    );
  };
}

// Utility function for creating success responses
export function createSuccessResponse<T>(
  data: T,
  message: string = "Success",
  status: number = 200,
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status },
  );
}

// Utility function for creating error responses
export function createErrorResponse(
  message: string,
  status: number = 500,
  code?: string,
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      code,
    },
    { status },
  );
}
