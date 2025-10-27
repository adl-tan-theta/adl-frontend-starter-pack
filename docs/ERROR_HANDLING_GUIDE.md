# 🚨 Error Handling & Monitoring System

This starter kit includes a comprehensive error handling and monitoring system designed for **Next.js 15** with **React 19** compatibility. It provides robust error boundaries, API error handling, and Sentry integration for production monitoring.

## 📁 File Structure

```
src/
├── app/
│   ├── error.tsx              # Segment-level error boundary
│   ├── global-error.tsx       # App-wide error boundary
│   ├── not-found.tsx          # 404 page
│   └── api/
│       └── test-error/        # Error testing endpoint
├── lib/
│   └── apiHandler.ts          # API error handling utilities
├── components/
│   └── ErrorHandlingDemo.tsx  # Demo component
└── middleware.ts              # Enhanced with error handling

# Sentry Configuration
sentry.client.config.ts        # Client-side Sentry config
sentry.server.config.ts        # Server-side Sentry config
sentry.edge.config.ts          # Edge runtime Sentry config
sentry.env.example             # Environment variables template
```

## 🛡️ Error Boundaries

### 1. Segment-Level Error Boundary (`app/error.tsx`)

Handles errors within specific route segments:

```tsx
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => console.error('Client Error:', error), [error]);
  
  return (
    <div className="error-page">
      <h2>Something went wrong.</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### 2. Global Error Boundary (`app/global-error.tsx`)

Handles unrecoverable app-wide errors:

```tsx
'use client';

export default function GlobalError({ error }: { error: Error }) {
  console.error('Global app error:', error);
  
  return (
    <html>
      <body>
        <h1>Critical Error</h1>
        <p>Something went terribly wrong. Please refresh the page.</p>
      </body>
    </html>
  );
}
```

### 3. Custom 404 Page (`app/not-found.tsx`)

User-friendly not found page:

```tsx
export default function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404 — Page Not Found</h1>
      <a href="/">Go back home</a>
    </div>
  );
}
```

## 🔧 API Error Handling

### Error Classes

The system includes predefined error classes for different scenarios:

```typescript
// Validation errors
throw new ValidationError('Invalid email format');

// Not found errors
throw new NotFoundError('User');

// Authentication errors
throw new UnauthorizedError('Invalid credentials');

// Rate limiting
throw new RateLimitError('Too many requests');

// Server errors
throw new InternalServerError('Database connection failed');
```

### API Handler Wrapper

Wrap your API routes with the `apiHandler` for automatic error handling:

```typescript
import { apiHandler, createSuccessResponse } from '@/lib/apiHandler';

export const GET = apiHandler(async (req: NextRequest) => {
  try {
    const data = await fetchData();
    return createSuccessResponse(data, 'Data retrieved successfully');
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
});
```

### Response Utilities

```typescript
// Success responses
return createSuccessResponse(data, 'Success message', 200);

// Error responses
return createErrorResponse('Error message', 400, 'ERROR_CODE');
```

## 📊 Sentry Integration

### Setup

1. **Install Sentry:**
   ```bash
   bun add @sentry/nextjs
   ```

2. **Configure Environment Variables:**
   ```bash
   # Copy the example file
   cp sentry.env.example .env.local
   
   # Add your Sentry DSN and other credentials
   NEXT_PUBLIC_SENTRY_DSN="https://your-dsn@sentry.io/project-id"
   ```

3. **Initialize Sentry:**
   The configuration files are already set up:
   - `sentry.client.config.ts` - Client-side monitoring
   - `sentry.server.config.ts` - Server-side monitoring
   - `sentry.edge.config.ts` - Edge runtime monitoring

### Features

- **Automatic Error Capture:** React errors, API exceptions, and middleware issues
- **Performance Monitoring:** Track page load times and API response times
- **Session Replay:** See exactly what users did before errors occurred
- **Release Tracking:** Monitor error rates across different deployments
- **Custom Context:** Add user information and custom tags to errors

## 🚦 Rate Limiting

The middleware includes built-in rate limiting for API routes:

```typescript
// Configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

// Applied to all /api/* routes
// Returns 429 status with proper headers when limit exceeded
```

### Rate Limit Headers

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 5
X-RateLimit-Reset: 2024-01-01T12:00:00Z
Retry-After: 60
```

## 🧪 Testing Error Handling

### Error Testing Endpoint

Use `/api/test-error` to test different error scenarios:

```typescript
// Test different error types
GET /api/test-error?type=validation
GET /api/test-error?type=not-found
GET /api/test-error?type=server
GET /api/test-error?type=rate-limit
```

### Demo Component

The `ErrorHandlingDemo` component provides interactive testing:

- **Client Error Testing:** Trigger React error boundaries
- **API Error Testing:** Test different server error types
- **Rate Limiting:** Test API rate limiting functionality
- **Error Pages:** Navigate to 404 and other error pages

## 🚀 Production Considerations

### Environment-Specific Behavior

- **Development:** Detailed error messages and stack traces
- **Production:** Sanitized error messages, Sentry integration active

### Error Monitoring Best Practices

1. **Set up Sentry Alerts:** Get notified of critical errors
2. **Monitor Error Rates:** Track error trends over time
3. **Use Custom Tags:** Add context like user ID, feature flags
4. **Performance Monitoring:** Track slow API endpoints
5. **Release Tracking:** Monitor error rates per deployment

### Security Considerations

- **Sanitize Error Messages:** Don't expose sensitive information
- **Rate Limiting:** Prevent abuse of error endpoints
- **CORS Configuration:** Properly configure cross-origin requests
- **Input Validation:** Validate all inputs to prevent errors

## 🔄 Error Recovery Strategies

### Client-Side Recovery

- **Retry Mechanisms:** Automatic retry for transient errors
- **Fallback UI:** Show alternative content when errors occur
- **User Guidance:** Clear instructions for users when errors happen

### Server-Side Recovery

- **Circuit Breakers:** Prevent cascading failures
- **Graceful Degradation:** Return partial data when possible
- **Health Checks:** Monitor system health and alert on issues

## 📈 Monitoring Dashboard

When using Sentry, you'll have access to:

- **Error Overview:** Error frequency and trends
- **Performance Metrics:** Page load times and API response times
- **User Impact:** Which users are affected by errors
- **Release Health:** Error rates across different deployments
- **Custom Dashboards:** Create custom views for your specific needs

## 🛠️ Customization

### Adding Custom Error Types

```typescript
export class CustomError extends ApiError {
  constructor(message: string, public customField: string) {
    super(400, message, 'CUSTOM_ERROR');
    this.name = 'CustomError';
  }
}
```

### Custom Error Pages

Create custom error pages for specific routes:

```typescript
// app/dashboard/error.tsx
export default function DashboardError({ error, reset }) {
  return (
    <div className="dashboard-error">
      <h2>Dashboard Error</h2>
      <p>Something went wrong in the dashboard.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Sentry Customization

```typescript
// Add custom context
Sentry.setContext('user', { id: userId, email: userEmail });

// Add custom tags
Sentry.setTag('feature', 'checkout');

// Add breadcrumbs
Sentry.addBreadcrumb({
  message: 'User clicked checkout button',
  category: 'user-action',
});
```

This error handling system provides a solid foundation for building robust, production-ready applications with comprehensive error monitoring and user-friendly error experiences.
