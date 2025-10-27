"use client";

import {
  Clock,
  Code,
  Download,
  ExternalLink,
  Layers,
  Loader2,
  Shield,
  Zap,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Dynamic import with loading component
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Loading heavy component...</span>
    </div>
  ),
  ssr: false, // Disable SSR for this component
});

// Lazy loaded component
const LazyChart = dynamic(() => import("./LazyChart"), {
  loading: () => (
    <div className="h-64 bg-secondary rounded-lg flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ),
});

// Simulated async data fetching
async function fetchUserData(): Promise<{
  name: string;
  email: string;
  avatar: string;
}> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    name: "John Doe",
    email: "john@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  };
}

// Component that uses Suspense for data fetching
function UserProfile() {
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const data = await fetchUserData();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile (Suspense Demo)</CardTitle>
        <CardDescription>
          Demonstrating async data loading with Suspense
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!userData ? (
          <div className="space-y-4">
            <Button onClick={loadUserData} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Load User Data
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Image
              src={userData.avatar}
              alt={userData.name}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold">{userData.name}</h3>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function NextJSFeaturesDemo() {
  const [showHeavyComponent, setShowHeavyComponent] = useState(false);
  const [showChart, setShowChart] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">
          Next.js Advanced Features Demo
        </h2>
        <p className="text-muted-foreground">
          Showcasing dynamic imports, Suspense, image optimization, and more
        </p>
      </div>

      {/* Dynamic Imports */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Dynamic Imports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Heavy Component</CardTitle>
              <CardDescription>
                Dynamically loaded component with custom loading state
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowHeavyComponent(!showHeavyComponent)}
                className="mb-4"
              >
                {showHeavyComponent ? "Hide" : "Load"} Heavy Component
              </Button>
              {showHeavyComponent && (
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading...</span>
                    </div>
                  }
                >
                  <HeavyComponent />
                </Suspense>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lazy Chart</CardTitle>
              <CardDescription>
                Chart component loaded only when needed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowChart(!showChart)} className="mb-4">
                {showChart ? "Hide" : "Show"} Chart
              </Button>
              {showChart && <LazyChart />}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Suspense Demo */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Suspense for Data Fetching</h3>
        <UserProfile />
      </div>

      {/* Image Optimization */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Image Optimization</h3>
        <Card>
          <CardHeader>
            <CardTitle>Next.js Image Component</CardTitle>
            <CardDescription>
              Automatic optimization, lazy loading, and responsive images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                  alt="Mountain landscape"
                  width={400}
                  height={300}
                  className="rounded-lg"
                  priority
                />
                <p className="text-sm text-muted-foreground">
                  Priority loading
                </p>
              </div>
              <div className="space-y-2">
                <Image
                  src="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop"
                  alt="Ocean view"
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
                <p className="text-sm text-muted-foreground">Lazy loading</p>
              </div>
              <div className="space-y-2">
                <Image
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
                  alt="Forest path"
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
                <p className="text-sm text-muted-foreground">Responsive</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Features */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Performance Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Splitting</CardTitle>
              <CardDescription>
                Automatic code splitting with dynamic imports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Automatic bundle splitting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Faster initial page load</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Lazy loading on demand</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Headers</CardTitle>
              <CardDescription>
                Built-in security headers and CSP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Content Security Policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">X-Frame-Options</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Referrer Policy</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Highlight */}
      <Card>
        <CardHeader>
          <CardTitle>Next.js Advanced Features</CardTitle>
          <CardDescription>
            Key features and optimizations demonstrated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Dynamic Imports</h4>
              <p className="text-sm text-muted-foreground">
                Load components and modules only when needed
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Suspense</h4>
              <p className="text-sm text-muted-foreground">
                Handle loading states for async operations
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Image Optimization</h4>
              <p className="text-sm text-muted-foreground">
                Automatic WebP/AVIF conversion and lazy loading
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Code Splitting</h4>
              <p className="text-sm text-muted-foreground">
                Automatic bundle splitting for better performance
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Security Headers</h4>
              <p className="text-sm text-muted-foreground">
                Built-in security headers and CSP configuration
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Rate Limiting</h4>
              <p className="text-sm text-muted-foreground">
                API rate limiting with middleware
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
