"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  createUser, 
  getUsers, 
  createPost, 
  getPosts, 
  subscribeToNewsletter 
} from "@/lib/server/actions";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export default function BackendDemo() {
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  const handleCreateUser = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', 'user@example.com');
      formData.append('name', 'John Doe');
      
      const result = await createUser(formData);
      setResponse(result);
      if (result.success) {
        fetchUsers();
      }
    });
  };

  const fetchUsers = async () => {
    try {
      const result = await getUsers();
      if (result.success) {
        setUsers(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreatePost = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('title', 'Sample Post');
      formData.append('content', 'This is a sample post content.');
      formData.append('published', 'true');
      formData.append('authorId', '1');
      
      const result = await createPost(formData);
      setResponse(result);
      if (result.success) {
        fetchPosts();
      }
    });
  };

  const fetchPosts = async () => {
    try {
      const result = await getPosts();
      if (result.success) {
        setPosts(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleNewsletterSubscription = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', 'subscriber@example.com');
      
      const result = await subscribeToNewsletter(formData);
      setResponse(result);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Backend Integration Demo</h2>
        <p className="text-muted-foreground">
          Showcasing Server Actions, API Routes, Zod validation, and Drizzle ORM
        </p>
      </div>

      {/* Server Actions Demo */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Server Actions with Zod Validation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Create and fetch users using Server Actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateUser}
                  disabled={isPending}
                  size="sm"
                >
                  {isPending ? "Creating..." : "Create User"}
                </Button>
                <Button 
                  onClick={fetchUsers}
                  variant="outline"
                  size="sm"
                >
                  Fetch Users
                </Button>
              </div>
              {users.length > 0 && (
                <div className="text-sm">
                  <p className="font-medium">Users ({users.length}):</p>
                  <ul className="list-disc list-inside">
                    {users.map((user) => (
                      <li key={user.id}>{user.name} - {user.email}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Post Management</CardTitle>
              <CardDescription>
                Create and fetch posts using Server Actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreatePost}
                  disabled={isPending}
                  size="sm"
                >
                  {isPending ? "Creating..." : "Create Post"}
                </Button>
                <Button 
                  onClick={fetchPosts}
                  variant="outline"
                  size="sm"
                >
                  Fetch Posts
                </Button>
              </div>
              {posts.length > 0 && (
                <div className="text-sm">
                  <p className="font-medium">Posts ({posts.length}):</p>
                  <ul className="list-disc list-inside">
                    {posts.map((post) => (
                      <li key={post.id}>{post.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Newsletter Subscription</h3>
        <Card>
          <CardHeader>
            <CardTitle>Email Subscription</CardTitle>
            <CardDescription>
              Subscribe to newsletter with validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleNewsletterSubscription}
              disabled={isPending}
            >
              {isPending ? "Subscribing..." : "Subscribe to Newsletter"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* API Response */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle>API Response</CardTitle>
            <CardDescription>
              Latest server action response
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-md ${
              response.success 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}>
              <p className="font-medium">
                {response.success ? '✅ Success' : '❌ Error'}
              </p>
              <p className="text-sm mt-1">{response.message}</p>
              {response.data && (
                <pre className="text-xs mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Highlight */}
      <Card>
        <CardHeader>
          <CardTitle>Backend Features</CardTitle>
          <CardDescription>
            Key features and technologies used in the backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Server Actions</h4>
              <p className="text-sm text-muted-foreground">
                Type-safe server-side functions with form integration
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Zod Validation</h4>
              <p className="text-sm text-muted-foreground">
                Runtime type validation for all incoming data
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Drizzle ORM</h4>
              <p className="text-sm text-muted-foreground">
                Type-safe database operations with PostgreSQL
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ API Routes</h4>
              <p className="text-sm text-muted-foreground">
                RESTful endpoints with proper error handling
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Database Schema</h4>
              <p className="text-sm text-muted-foreground">
                Structured tables for users, posts, comments, and subscriptions
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Error Handling</h4>
              <p className="text-sm text-muted-foreground">
                Comprehensive error handling and user feedback
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
