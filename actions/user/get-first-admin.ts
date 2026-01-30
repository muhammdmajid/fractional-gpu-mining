"use server";

import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getFirstAdmin() {
  const [admin] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.role, "admin"))
    .limit(1);

  return admin || null; // Return null if no admin exists
}
