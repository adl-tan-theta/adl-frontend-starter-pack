import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable optimized package imports
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  
  // Server external packages (moved from experimental)
  serverExternalPackages: [],
  
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
