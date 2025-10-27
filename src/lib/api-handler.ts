import type { NextRequest, NextResponse } from "next/server";
import { AppError, handleApiError } from "@/lib/errors";

export type ApiHandler = (
  request: NextRequest,
  context?: { params: Record<string, string> },
) => Promise<NextResponse>;

export function createApiHandler(handlers: {
  GET?: ApiHandler;
  POST?: ApiHandler;
  PUT?: ApiHandler;
  DELETE?: ApiHandler;
  PATCH?: ApiHandler;
}) {
  return {
    async GET(
      request: NextRequest,
      context?: { params: Record<string, string> },
    ) {
      if (!handlers.GET) {
        throw new AppError("Method not allowed", 405);
      }
      return handlers.GET(request, context);
    },
    async POST(
      request: NextRequest,
      context?: { params: Record<string, string> },
    ) {
      if (!handlers.POST) {
        throw new AppError("Method not allowed", 405);
      }
      return handlers.POST(request, context);
    },
    async PUT(
      request: NextRequest,
      context?: { params: Record<string, string> },
    ) {
      if (!handlers.PUT) {
        throw new AppError("Method not allowed", 405);
      }
      return handlers.PUT(request, context);
    },
    async DELETE(
      request: NextRequest,
      context?: { params: Record<string, string> },
    ) {
      if (!handlers.DELETE) {
        throw new AppError("Method not allowed", 405);
      }
      return handlers.DELETE(request, context);
    },
    async PATCH(
      request: NextRequest,
      context?: { params: Record<string, string> },
    ) {
      if (!handlers.PATCH) {
        throw new AppError("Method not allowed", 405);
      }
      return handlers.PATCH(request, context);
    },
  };
}

export function withApiErrorHandling(handler: ApiHandler): ApiHandler {
  return async (
    request: NextRequest,
    context?: { params: Record<string, string> },
  ) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

export function createSafeApiHandler(handlers: {
  GET?: ApiHandler;
  POST?: ApiHandler;
  PUT?: ApiHandler;
  DELETE?: ApiHandler;
  PATCH?: ApiHandler;
}) {
  const safeHandlers = Object.fromEntries(
    Object.entries(handlers).map(([method, handler]) => [
      method,
      handler ? withApiErrorHandling(handler) : undefined,
    ]),
  );

  return createApiHandler(safeHandlers);
}
