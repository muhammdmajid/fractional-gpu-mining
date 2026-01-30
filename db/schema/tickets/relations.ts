import { relations } from "drizzle-orm";
import { tickets } from "./tickets";
import { userTable } from "../user";
import { ticketReplies } from "./ticket_replies";

// ============================
// 🔹 tickets Table Relations
// Each ticket belongs to a user (via email) and can have multiple replies
// ============================
export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  user: one(userTable, {
    fields: [tickets.email],
    references: [userTable.email],
  }),
  replies: many(ticketReplies),
}));

// ============================
// 🔹 ticketReplies Table Relations
// Each reply belongs to a ticket and is linked to a responder (user)
// ============================
export const ticketRepliesRelations = relations(ticketReplies, ({ one }) => ({
  ticket: one(tickets, {
    fields: [ticketReplies.ticketId],
    references: [tickets.id],
  }),
  responderUser: one(userTable, {
    fields: [ticketReplies.responder],
    references: [userTable.email],
  }),
}));
