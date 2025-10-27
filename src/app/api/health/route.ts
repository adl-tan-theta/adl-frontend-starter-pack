import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import redisClient from "@/lib/redis";

interface HealthCheck {
  service: string;
  status: "healthy" | "unhealthy";
  responseTime?: number;
  error?: string;
}

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    await db.execute("SELECT 1");
    return {
      service: "database",
      status: "healthy",
      responseTime: Date.now() - start,
    };
  } catch (error) {
    return {
      service: "database",
      status: "unhealthy",
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkRedis(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    await redisClient.ping();
    return {
      service: "redis",
      status: "healthy",
      responseTime: Date.now() - start,
    };
  } catch (error) {
    return {
      service: "redis",
      status: "unhealthy",
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET(_request: NextRequest) {
  const start = Date.now();

  try {
    // Run health checks in parallel
    const [databaseCheck, redisCheck] = await Promise.all([
      checkDatabase(),
      checkRedis(),
    ]);

    const checks = [databaseCheck, redisCheck];
    const allHealthy = checks.every((check) => check.status === "healthy");

    const response = {
      status: allHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      checks: checks.reduce(
        (acc, check) => {
          acc[check.service] = {
            status: check.status,
            responseTime: check.responseTime,
            ...(check.error && { error: check.error }),
          };
          return acc;
        },
        {} as Record<string, any>,
      ),
    };

    return NextResponse.json(response, {
      status: allHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        responseTime: Date.now() - start,
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  }
}
