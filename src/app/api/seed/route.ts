import { type NextRequest, NextResponse } from "next/server";
import { apiHandler, createSuccessResponse } from "@/lib/apiHandler";
import { seedDatabase } from "@/lib/seed";

export const POST = apiHandler(async (_req: NextRequest) => {
  // Only allow seeding in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { success: false, message: "Seeding is only allowed in development" },
      { status: 403 },
    );
  }

  try {
    const result = await seedDatabase();
    return createSuccessResponse(result, "Database seeded successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
    throw new Error("Failed to seed database");
  }
});
