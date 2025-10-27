import { context, SpanStatusCode, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("openkb-api", "1.0.0");

/**
 * Create a span for API operations
 */
export async function withSpan<T>(
  name: string,
  operation: () => Promise<T>,
  attributes?: Record<string, string | number | boolean>,
): Promise<T> {
  const span = tracer.startSpan(name);

  try {
    // Add attributes to the span
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        span.setAttribute(key, value);
      });
    }

    // Execute the operation within the span context
    return await context.with(
      trace.setSpan(context.active(), span),
      async () => {
        const result = await operation();
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      },
    );
  } catch (error) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    span.recordException(
      error instanceof Error ? error : new Error(String(error)),
    );
    throw error;
  } finally {
    span.end();
  }
}

/**
 * Add custom metrics
 */
export function recordMetric(
  name: string,
  value: number,
  attributes?: Record<string, string>,
) {
  const meter = trace.getActiveSpan()?.spanContext();
  if (meter) {
    // In a real implementation, you would use the metrics API here
    console.log(`Metric: ${name} = ${value}`, attributes);
  }
}

/**
 * Add custom events to the current span
 */
export function addEvent(
  name: string,
  attributes?: Record<string, string | number | boolean>,
) {
  const span = trace.getActiveSpan();
  if (span) {
    span.addEvent(name, attributes);
  }
}

/**
 * Set attributes on the current span
 */
export function setAttributes(attributes: Record<string, string | number | boolean>) {
  const span = trace.getActiveSpan();
  if (span) {
    Object.entries(attributes).forEach(([key, value]) => {
      span.setAttribute(key, value);
    });
  }
}