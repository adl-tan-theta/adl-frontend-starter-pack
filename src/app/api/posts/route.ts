import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { createPostSchema } from "@/lib/validations";

export async function GET() {
  try {
    const allPosts = await db.select().from(posts);

    return NextResponse.json({
      success: true,
      message: "Posts retrieved successfully",
      data: allPosts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch posts.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = createPostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0].message,
        },
        { status: 400 },
      );
    }

    const newPost = await db.insert(posts).values(validation.data).returning();

    return NextResponse.json(
      {
        success: true,
        message: "Post created successfully!",
        data: newPost[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create post. Please try again.",
      },
      { status: 500 },
    );
  }
}
