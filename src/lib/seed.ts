import { db } from "@/lib/db";
import {
  comments,
  newsletterSubscriptions,
  posts,
  users,
} from "@/lib/db/schema";
import { hashPassword } from "@/lib/password";

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data
    await db.delete(comments);
    await db.delete(posts);
    await db.delete(newsletterSubscriptions);
    await db.delete(users);
    console.log("✅ Cleared existing data");

    // Create users
    const hashedPassword = await hashPassword("password123");

    const seededUsers = await db
      .insert(users)
      .values([
        {
          email: "demo@example.com",
          name: "Demo User",
          passwordHash: hashedPassword,
        },
        {
          email: "admin@example.com",
          name: "Admin User",
          passwordHash: hashedPassword,
        },
        {
          email: "john@example.com",
          name: "John Doe",
          passwordHash: hashedPassword,
        },
        {
          email: "jane@example.com",
          name: "Jane Smith",
          passwordHash: hashedPassword,
        },
      ])
      .returning();

    console.log(`✅ Created ${seededUsers.length} users`);

    // Create posts
    const seededPosts = await db
      .insert(posts)
      .values([
        {
          title: "Welcome to Next.js 15",
          content:
            "This is a comprehensive starter kit built with Next.js 15, React 19, and modern technologies. It includes authentication, database integration, Redis caching, and Docker support.",
          published: true,
          authorId: seededUsers[0].id,
        },
        {
          title: "Getting Started with Drizzle ORM",
          content:
            "Drizzle ORM provides a type-safe way to interact with your database. It supports PostgreSQL, MySQL, and SQLite with excellent TypeScript integration.",
          published: true,
          authorId: seededUsers[1].id,
        },
        {
          title: "Redis Caching Strategies",
          content:
            "Redis is an in-memory data structure store that can be used as a database, cache, and message broker. Learn how to implement effective caching strategies.",
          published: true,
          authorId: seededUsers[2].id,
        },
        {
          title: "Docker Best Practices",
          content:
            "Docker containers provide a consistent environment for development and deployment. Here are some best practices for containerizing your applications.",
          published: false,
          authorId: seededUsers[3].id,
        },
        {
          title: "OpenTelemetry Integration",
          content:
            "OpenTelemetry provides observability for your applications through tracing, metrics, and logging. Learn how to instrument your Next.js applications.",
          published: true,
          authorId: seededUsers[0].id,
        },
      ])
      .returning();

    console.log(`✅ Created ${seededPosts.length} posts`);

    // Create comments
    const seededComments = await db
      .insert(comments)
      .values([
        {
          content: "Great article! This starter kit looks very comprehensive.",
          postId: seededPosts[0].id,
          authorId: seededUsers[1].id,
        },
        {
          content: "I love the TypeScript integration with Drizzle ORM.",
          postId: seededPosts[1].id,
          authorId: seededUsers[2].id,
        },
        {
          content:
            "Redis caching has improved our application performance significantly.",
          postId: seededPosts[2].id,
          authorId: seededUsers[3].id,
        },
        {
          content: "Looking forward to trying out the OpenTelemetry features.",
          postId: seededPosts[4].id,
          authorId: seededUsers[1].id,
        },
        {
          content: "The Docker setup looks clean and well-organized.",
          postId: seededPosts[3].id,
          authorId: seededUsers[0].id,
        },
      ])
      .returning();

    console.log(`✅ Created ${seededComments.length} comments`);

    // Create newsletter subscriptions
    const seededNewsletters = await db
      .insert(newsletterSubscriptions)
      .values([
        {
          email: "demo@example.com",
          subscribed: true,
        },
        {
          email: "admin@example.com",
          subscribed: true,
        },
        {
          email: "newsletter@example.com",
          subscribed: false,
        },
      ])
      .returning();

    console.log(
      `✅ Created ${seededNewsletters.length} newsletter subscriptions`,
    );

    console.log("🎉 Database seeding completed successfully!");

    return {
      users: seededUsers.length,
      posts: seededPosts.length,
      comments: seededComments.length,
      newsletters: seededNewsletters.length,
    };
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then((result) => {
      console.log("Seeding result:", result);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}
