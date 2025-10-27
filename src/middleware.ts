import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

// Create the intl middleware
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'fr', 'es', 'de'],
  defaultLocale: 'en'
});

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

function getRateLimitKey(request: NextRequest): string {
  // Use IP address as the key (in production, consider using user ID for authenticated requests)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return ip;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (now > record.resetTime) {
    // Reset the counter
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  // Increment the counter
  record.count++;
  rateLimitMap.set(key, record);
  return false;
}

export function middleware(request: NextRequest) {
  try {
    // Handle internationalization first
    const intlResponse = intlMiddleware(request);
    
    // Only apply rate limiting to API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
      const key = getRateLimitKey(request);
      
      if (isRateLimited(key)) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Too many requests. Please try again later.',
            error: 'RATE_LIMIT_EXCEEDED'
          },
          { 
            status: 429,
            headers: {
              'Retry-After': '60',
              'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString(),
            }
          }
        );
      }

      // Add rate limit headers to successful responses
      const record = rateLimitMap.get(key);
      if (record) {
        const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - record.count);
        const resetTime = new Date(record.resetTime).toISOString();
        
        const response = NextResponse.next();
        response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
        response.headers.set('X-RateLimit-Remaining', remaining.toString());
        response.headers.set('X-RateLimit-Reset', resetTime);
        
        return response;
      }
    }

    return intlResponse;
  } catch (error) {
    console.error('Middleware error:', error);
    
    // Return a safe response to prevent middleware crashes
    return NextResponse.json(
      { 
        success: false, 
        message: 'Middleware error occurred',
        error: 'MIDDLEWARE_ERROR'
      },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: [
    // Match only internationalized pathnames
    '/(fr|es|de|en)/:path*',
    // Match API routes
    '/api/:path*',
  ],
};