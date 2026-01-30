import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { tickets } from "./tickets";
import { generateUniqueId } from "@/db/utils";

// 📑 Ticket replies table
export const ticketReplies = pgTable("ticket_replies", {
  // 🔑 Unique reply ID
  id: text("id").primaryKey().$defaultFn(() => generateUniqueId("reply", 35)),

  // 🔗 Reference to parent ticket
  ticketId: text("ticket_id")
    .notNull()
    .references(() => tickets.id, { onDelete: "cascade" }),

  // 📝 Reply details
  responder: text("responder").notNull(), // e.g., "Support Team"
  message: text("message").notNull(),

  // 📅 Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});
