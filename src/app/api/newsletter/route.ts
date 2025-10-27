import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletterSubscriptions } from '@/lib/db/schema';
import { newsletterSubscriptionSchema } from '@/lib/validations';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = newsletterSubscriptionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: validation.error.issues[0].message 
        },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Check if email already exists
    const existingSubscription = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, email))
      .limit(1);

    if (existingSubscription.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email is already subscribed to the newsletter.' 
        },
        { status: 409 }
      );
    }

    const newSubscription = await db
      .insert(newsletterSubscriptions)
      .values({ email })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: newSubscription[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to subscribe to newsletter. Please try again.' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allSubscriptions = await db.select().from(newsletterSubscriptions);
    
    return NextResponse.json({
      success: true,
      message: 'Newsletter subscriptions retrieved successfully',
      data: allSubscriptions
    });
  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch newsletter subscriptions.' 
      },
      { status: 500 }
    );
  }
}
