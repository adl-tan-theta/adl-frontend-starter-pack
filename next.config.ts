import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Turbopack for faster development builds
  experimental: {
    turbo: {
      // Turbopack configuration options
      rules: {
        // Add any specific rules for Turbopack if needed
      },
    },
    // Enable server components logging for debugging
    serverComponentsExternalPackages: [],
    // Enable optimized package imports
    optimizePackageImports: ['react', 'react-dom'],
  },
  
  // Next.js 15 caching configuration
  // Explicitly set caching strategies
  cacheHandler: undefined, // Use default cache handler
  
  // Enable static optimization by default
  output: 'standalone',
  
  // Configure build optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
