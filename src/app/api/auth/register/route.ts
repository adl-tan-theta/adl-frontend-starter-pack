import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  apiHandler,
  createSuccessResponse,
  ValidationError,
} from "@/lib/apiHandler";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashPassword, validatePassword } from "@/lib/password";

const registerUserSchema = {
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new ValidationError("Valid email is required");
    }
    return email.toLowerCase();
  },
  password: (password: string) => {
    const validation = validatePassword(password);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(", "));
    }
    return password;
  },
  name: (name: string) => {
    if (!name || name.trim().length < 2) {
      throw new ValidationError("Name must be at least 2 characters long");
    }
    return name.trim();
  },
};

export const POST = apiHandler(async (req: NextRequest) => {
  try {
    const body = await req.json();

    // Validate input
    const email = registerUserSchema.email(body.email);
    const password = registerUserSchema.password(body.password);
    const name = registerUserSchema.name(body.name);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existingUser.length > 0) {
      throw new ValidationError("User with this email already exists");
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        email,
        name,
        passwordHash,
      })
      .returning();

    if (!newUser[0]) {
      throw new Error("Failed to create user");
    }

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser[0];

    return createSuccessResponse(
      userWithoutPassword,
      "User created successfully!",
      201,
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error("Error creating user:", error);
    throw new Error("Failed to create user. Please try again.");
  }
});
