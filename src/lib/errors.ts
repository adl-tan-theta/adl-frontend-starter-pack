import { NextResponse } from "next/server";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists") {
    super(message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429);
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        error: error.constructor.name,
        statusCode: error.statusCode,
      },
      { status: error.statusCode },
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: "Unknown error occurred",
      error: "UNKNOWN_ERROR",
      statusCode: 500,
    },
    { status: 500 },
  );
}

export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
) {
  return async (...args: T): Promise<R> => {
    return await handler(...args);
  };
}
