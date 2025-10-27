import Image from "next/image";
import AnimationsDemo from "@/components/AnimationsDemo";
import BackendDemo from "@/components/BackendDemo";
import ErrorHandlingDemo from "@/components/ErrorHandlingDemo";
import NextJSFeaturesDemo from "@/components/NextJSFeaturesDemo";
import React19Demo from "@/components/React19Demo";
import ShadcnUIDemo from "@/components/ShadcnUIDemo";
import { ThemeToggle, ThemeToggleWithDropdown } from "@/components/ThemeToggle";

// Next.js 15: Explicit caching configuration
// Force static generation for the home page
export const dynamic = "force-static";
export const revalidate = false; // Never revalidate - fully static

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div></div>
            <ThemeToggle />
          </div>
          <Image
            className="dark:invert mx-auto mb-4"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Next.js 15 + React 19 Demo
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Turbopack enabled with new caching models and React 19 features
          </p>
          <div className="mt-4">
            <ThemeToggleWithDropdown />
          </div>
        </div>

        <React19Demo />

        <div className="mt-12">
          <ShadcnUIDemo />
        </div>

        <div className="mt-12">
          <BackendDemo />
        </div>

        <div className="mt-12">
          <AnimationsDemo />
        </div>

        <div className="mt-12">
          <NextJSFeaturesDemo />
        </div>

        <div className="mt-12">
          <ErrorHandlingDemo />
        </div>
      </main>
    </div>
  );
}
