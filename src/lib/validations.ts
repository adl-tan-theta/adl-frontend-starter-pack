import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  name: z.string().min(1, { message: "Name is required." }).max(255),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }).max(255).optional(),
});

// Post validation schemas
export const createPostSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }).max(255),
  content: z.string().optional(),
  published: z.boolean().default(false),
  authorId: z.number().int().positive(),
});

export const updatePostSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }).max(255).optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
});

// Comment validation schemas
export const createCommentSchema = z.object({
  content: z.string().min(1, { message: "Comment content is required." }),
  postId: z.number().int().positive(),
  authorId: z.number().int().positive(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, { message: "Comment content is required." }),
});

// Newsletter subscription schema
export const newsletterSubscriptionSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
});

// Error response schema
export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(z.string()).optional(),
});

// Success response schema
export const successResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.any().optional(),
});

// Export types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type NewsletterSubscriptionInput = z.infer<typeof newsletterSubscriptionSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
