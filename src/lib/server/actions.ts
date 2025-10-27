"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  comments,
  newsletterSubscriptions,
  posts,
  users,
} from "@/lib/db/schema";
import {
  createCommentSchema,
  createPostSchema,
  createUserSchema,
  newsletterSubscriptionSchema,
} from "@/lib/validations";

// User actions
export async function createUser(formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
    };

    const validation = createUserSchema.safeParse(rawData);

    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0].message,
      };
    }

    const newUser = await db.insert(users).values(validation.data).returning();

    return {
      success: true,
      message: "User created successfully!",
      data: newUser[0],
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: "Failed to create user. Please try again.",
    };
  }
}

export async function getUsers() {
  try {
    const allUsers = await db.select().from(users);
    return {
      success: true,
      message: "Users retrieved successfully",
      data: allUsers,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      message: "Failed to fetch users.",
    };
  }
}

// Post actions
export async function createPost(formData: FormData) {
  try {
    const rawData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      published: formData.get("published") === "true",
      authorId: parseInt(formData.get("authorId") as string, 10),
    };

    const validation = createPostSchema.safeParse(rawData);

    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0].message,
      };
    }

    const newPost = await db.insert(posts).values(validation.data).returning();

    return {
      success: true,
      message: "Post created successfully!",
      data: newPost[0],
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      message: "Failed to create post. Please try again.",
    };
  }
}

export async function getPosts() {
  try {
    const allPosts = await db.select().from(posts);
    return {
      success: true,
      message: "Posts retrieved successfully",
      data: allPosts,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      success: false,
      message: "Failed to fetch posts.",
    };
  }
}

// Comment actions
export async function createComment(formData: FormData) {
  try {
    const rawData = {
      content: formData.get("content") as string,
      postId: parseInt(formData.get("postId") as string, 10),
      authorId: parseInt(formData.get("authorId") as string, 10),
    };

    const validation = createCommentSchema.safeParse(rawData);

    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0].message,
      };
    }

    const newComment = await db
      .insert(comments)
      .values(validation.data)
      .returning();

    return {
      success: true,
      message: "Comment created successfully!",
      data: newComment[0],
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      success: false,
      message: "Failed to create comment. Please try again.",
    };
  }
}

// Newsletter subscription action
export async function subscribeToNewsletter(formData: FormData) {
  try {
    const email = formData.get("email") as string;

    const validation = newsletterSubscriptionSchema.safeParse({ email });

    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0].message,
      };
    }

    // Check if email already exists
    const existingSubscription = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, email))
      .limit(1);

    if (existingSubscription.length > 0) {
      return {
        success: false,
        message: "Email is already subscribed to the newsletter.",
      };
    }

    const newSubscription = await db
      .insert(newsletterSubscriptions)
      .values({ email })
      .returning();

    return {
      success: true,
      message: "Successfully subscribed to newsletter!",
      data: newSubscription[0],
    };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return {
      success: false,
      message: "Failed to subscribe to newsletter. Please try again.",
    };
  }
}
