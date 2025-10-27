"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the global error
    console.error("Global app error:", error);

    // In production, this would be sent to OpenTelemetry
    if (process.env.NODE_ENV === "production") {
      // OpenTelemetry error tracking would go here
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
              Critical Error
            </h1>
            <p className="text-muted-foreground mb-4">
              Something went terribly wrong. We've been notified and are working
              on a fix.
            </p>

            {process.env.NODE_ENV === "development" && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 mb-4">
                <p className="text-sm text-red-800 dark:text-red-200 font-mono">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = "/";
              }}
              className="w-full"
            >
              Go home
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
