import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { generateUniqueId } from "@/db/utils";
import { userTable } from "../user";

// 📑 Tickets table
export const tickets = pgTable("tickets", {
  // 🔑 Unique ticket ID
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUniqueId("ticket", 39)),

  // Reference to user's email
  email: text("email")
    .notNull()
    .references(() => userTable.email, { onDelete: "cascade" }),

  subject: text("subject").notNull(),
  message: text("message").notNull(),

  // 📅 Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
