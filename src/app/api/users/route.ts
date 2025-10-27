import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createUserSchema } from '@/lib/validations';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    
    return NextResponse.json({
      success: true,
      message: 'Users retrieved successfully',
      data: allUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch users.' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = createUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: validation.error.issues[0].message 
        },
        { status: 400 }
      );
    }

    const newUser = await db.insert(users).values(validation.data).returning();

    return NextResponse.json({
      success: true,
      message: 'User created successfully!',
      data: newUser[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create user. Please try again.' 
      },
      { status: 500 }
    );
  }
}
