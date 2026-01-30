"use server";

import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email: string) {
  // Fetch the user from the database by email
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  return user || null; // Return null if user not found
}
