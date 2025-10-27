import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createUserSchema } from '@/lib/validations';
import { apiHandler, createSuccessResponse, createErrorResponse, ValidationError, NotFoundError } from '@/lib/apiHandler';
import { eq } from 'drizzle-orm';

export const GET = apiHandler(async (req: NextRequest) => {
  try {
    const allUsers = await db.select().from(users);
    return createSuccessResponse(allUsers, 'Users retrieved successfully');
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
});

export const POST = apiHandler(async (req: NextRequest) => {
  try {
    const body = await req.json();
    
    const validation = createUserSchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError(validation.error.issues[0].message);
    }

    const newUser = await db.insert(users).values(validation.data).returning();

    if (!newUser[0]) {
      throw new Error('Failed to create user');
    }

    return createSuccessResponse(newUser[0], 'User created successfully!', 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error('Error creating user:', error);
    throw new Error('Failed to create user. Please try again.');
  }
});
