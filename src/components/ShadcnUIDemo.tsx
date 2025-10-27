"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShadcnUIDemo() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Shadcn/ui Components Demo</h2>
        <p className="text-muted-foreground">
          Showcasing Shadcn/ui components with Tailwind CSS v4 and React 19
        </p>
      </div>

      {/* Button Variants */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Button Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
              <CardDescription>
                A basic card with title and description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is the card content area where you can place any content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>
                Card with interactive elements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This card demonstrates interactive elements.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Action 1
                </Button>
                <Button size="sm" variant="outline">
                  Action 2
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Highlight */}
      <Card>
        <CardHeader>
          <CardTitle>Shadcn/ui Features</CardTitle>
          <CardDescription>
            Key features and benefits of using Shadcn/ui with Tailwind CSS v4
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">✅ React 19 Compatible</h4>
              <p className="text-sm text-muted-foreground">
                No more forwardRef needed - ref is passed as a regular prop
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Tailwind CSS v4</h4>
              <p className="text-sm text-muted-foreground">
                Uses OKLCH colors and new sizing system (size-* classes)
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ data-slot Attributes</h4>
              <p className="text-sm text-muted-foreground">
                Enhanced styling capabilities for internal component parts
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Full Control</h4>
              <p className="text-sm text-muted-foreground">
                Copy component code directly into your project
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
