# Next.js 15 Caching Guide

## Overview
Next.js 15 introduces significant changes to caching behavior. By default, fewer things are cached, requiring explicit configuration for optimal performance.

## Caching Configuration Options

### Route Segment Config Options

| Option | Description | Default |
|--------|-------------|---------|
| `dynamic` | Controls how the route is rendered | `'auto'` |
| `revalidate` | Controls how long the route is cached | `false` |
| `fetchCache` | Controls how fetch requests are cached | `'auto'` |
| `runtime` | Controls the runtime environment | `'nodejs'` |
| `preferredRegion` | Controls the preferred region | `'auto'` |

### Dynamic Options

- `'force-static'` - Force static generation (○ symbol)
- `'force-dynamic'` - Force dynamic rendering (λ symbol)
- `'auto'` - Let Next.js decide based on usage

### Revalidate Options

- `false` - Never revalidate (fully static)
- `0` - Always revalidate (dynamic)
- `number` - Revalidate after N seconds

## Static Route Indicators

When running `next dev`, you'll see these symbols in the console:

- **○** - Static route (cached at build time)
- **λ** - Dynamic route (rendered on each request)
- **◐** - Partially static route

## Common Caching Patterns

### Fully Static Page
```typescript
export const dynamic = 'force-static';
export const revalidate = false;
```

### Dynamic Page with ISR
```typescript
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour
```

### Hybrid Page (auto-detect)
```typescript
export const dynamic = 'auto';
export const revalidate = 60; // 1 minute
```

## Fetch Caching

### Static Data Fetching
```typescript
// Cached indefinitely
const data = await fetch('https://api.example.com/data', {
  cache: 'force-cache'
});
```

### Dynamic Data Fetching
```typescript
// Always fresh
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store'
});
```

### ISR Data Fetching
```typescript
// Cached with revalidation
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 }
});
```

## Troubleshooting

### Common Issues

1. **Page rendering dynamically despite force-static**
   - Check for dynamic functions: `headers()`, `cookies()`, `searchParams`
   - Verify no dynamic imports or client-side only code

2. **Caching not working as expected**
   - Verify `cache` option in fetch calls
   - Check route segment config exports
   - Use Static Route Indicator for diagnosis

3. **Build errors with caching config**
   - Ensure correct TypeScript types
   - Verify experimental flags in next.config.ts

## Turbopack Configuration

Turbopack is enabled with the `--turbo` flag and provides:

- Faster development builds
- Better hot reloading
- Improved bundling performance

### Usage
```bash
# Development with Turbopack
npm run dev

# Development without Turbopack (fallback)
npm run dev:no-turbo
```

## Best Practices

1. **Explicit Configuration**: Always set caching options explicitly
2. **Static by Default**: Use `force-static` for pages that don't need dynamic data
3. **ISR for Content**: Use ISR for content that changes but doesn't need real-time updates
4. **Dynamic for Real-time**: Use `force-dynamic` only when you need real-time data
5. **Monitor Indicators**: Watch the route indicators in development console

## Migration from Next.js 14

- Remove implicit caching assumptions
- Add explicit `dynamic` and `revalidate` exports
- Update fetch calls with explicit cache options
- Test with Static Route Indicators
