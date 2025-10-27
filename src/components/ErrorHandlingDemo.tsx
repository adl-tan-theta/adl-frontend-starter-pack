"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Bug, 
  Server, 
  Network, 
  Shield,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function ErrorHandlingDemo() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ type: string; success: boolean; message: string }[]>([]);

  const testApiError = async (errorType: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/test-error?type=${errorType}`);
      const data = await response.json();
      
      setResults(prev => [...prev, {
        type: errorType,
        success: data.success,
        message: data.message
      }]);
    } catch (error) {
      setResults(prev => [...prev, {
        type: errorType,
        success: false,
        message: 'Network error occurred'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const testClientError = () => {
    // This will trigger the error boundary
    throw new Error('This is a test client error');
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Error Handling & Monitoring Demo</h2>
        <p className="text-muted-foreground">
          Comprehensive error handling with Sentry integration and user-friendly error pages
        </p>
      </div>

      {/* Error Boundary Test */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Error Boundary Testing</h3>
        <Card>
          <CardHeader>
            <CardTitle>Client-Side Error</CardTitle>
            <CardDescription>
              Test React error boundaries with client-side errors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testClientError}
              variant="destructive"
              className="w-full"
            >
              <Bug className="h-4 w-4 mr-2" />
              Trigger Client Error
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              This will trigger the error boundary and show the error page.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Error Testing */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">API Error Testing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Server Errors</CardTitle>
              <CardDescription>
                Test different types of server-side errors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={() => testApiError('validation')}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Validation Error
              </Button>
              <Button 
                onClick={() => testApiError('not-found')}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Not Found Error
              </Button>
              <Button 
                onClick={() => testApiError('server')}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <Server className="h-4 w-4 mr-2" />
                Server Error
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rate Limiting</CardTitle>
              <CardDescription>
                Test API rate limiting functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={() => testApiError('rate-limit')}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <Shield className="h-4 w-4 mr-2" />
                Rate Limit Test
              </Button>
              <p className="text-xs text-muted-foreground">
                Make multiple requests to test rate limiting
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Display */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Test Results</h3>
            <Button onClick={clearResults} variant="outline" size="sm">
              Clear Results
            </Button>
          </div>
          <div className="space-y-2">
            {results.map((result, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium capitalize">{result.type} Error</p>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Error Pages Demo */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Error Pages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>404 Page</CardTitle>
              <CardDescription>
                Custom not found page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.location.href = '/non-existent-page'}
                variant="outline"
                className="w-full"
              >
                <Network className="h-4 w-4 mr-2" />
                Visit 404 Page
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Global Error</CardTitle>
              <CardDescription>
                Critical error handling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => {
                  // This would trigger global error in a real scenario
                  console.log('Global error simulation');
                }}
                variant="outline"
                className="w-full"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Simulate Global Error
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Highlight */}
      <Card>
        <CardHeader>
          <CardTitle>Error Handling Features</CardTitle>
          <CardDescription>
            Comprehensive error handling and monitoring capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Error Boundaries</h4>
              <p className="text-sm text-muted-foreground">
                React error boundaries for graceful error recovery
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Custom Error Pages</h4>
              <p className="text-sm text-muted-foreground">
                User-friendly 404, 500, and global error pages
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ API Error Handling</h4>
              <p className="text-sm text-muted-foreground">
                Structured error responses with proper HTTP status codes
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Sentry Integration</h4>
              <p className="text-sm text-muted-foreground">
                Real-time error monitoring and performance tracking
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Rate Limiting</h4>
              <p className="text-sm text-muted-foreground">
                API protection with proper error responses
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Development Support</h4>
              <p className="text-sm text-muted-foreground">
                Detailed error information in development mode
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
