"use client";

import React, { useState, useTransition, Suspense } from "react";
import { Button } from "./ui/Button";

// React 19: Simplified form handling (compatible with current Next.js version)
function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{ error?: string; success?: boolean; message?: string } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!name || !email) {
        setState({ error: "Name and email are required" });
        return;
      }
      
      setState({ success: true, message: `Hello ${name}! Form submitted successfully.` });
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <SubmitButton isPending={isPending} />
      
      {state?.error && (
        <div className="text-red-600 text-sm">{state.error}</div>
      )}
      
      {state?.success && (
        <div className="text-green-600 text-sm">{state.message}</div>
      )}
    </form>
  );
}

// Simplified submit button (compatible version)
function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button 
      type="submit" 
      disabled={isPending}
      className="w-full"
    >
      {isPending ? "Submitting..." : "Submit"}
    </Button>
  );
}

// Simplified user profile component (compatible version)
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUser({ name: "John Doe", email: "john@example.com" });
      setLoading(false);
    }, 1000);
  }, [userId]);

  if (loading) {
    return <div className="p-4">Loading user...</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold">{user?.name}</h3>
      <p className="text-gray-600">{user?.email}</p>
    </div>
  );
}

// Main component demonstrating all React 19 features
export default function React19Demo() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">React 19 Integration Demo</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">1. Form Handling with useTransition</h3>
            <p className="text-gray-600 mb-4">
              Modern form handling using useTransition for better UX.
            </p>
            <ContactForm />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">2. Async Data Loading</h3>
            <p className="text-gray-600 mb-4">
              Simplified async data handling with proper loading states.
            </p>
            <UserProfile userId="123" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">3. Ref as Regular Prop</h3>
            <p className="text-gray-600 mb-4">
              No more forwardRef needed! ref is passed as a regular prop.
            </p>
            <Button 
              onClick={() => alert("Button clicked!")}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Click me (ref as prop)
            </Button>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">4. data-slot Attributes</h3>
            <p className="text-gray-600 mb-4">
              data-slot attributes for targeting internal component parts in CSS.
            </p>
            <div className="border rounded-lg">
              <div data-slot="accordion-item" className="border-b p-4">
                <button data-slot="accordion-trigger" className="w-full text-left font-medium">
                  Accordion Item with data-slot
                </button>
                <div data-slot="accordion-content" className="mt-2 text-gray-600">
                  This content uses data-slot attributes for styling.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
