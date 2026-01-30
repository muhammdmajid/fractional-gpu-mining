import { z } from "zod";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { tickets, ticketReplies } from "@/db/schema";
import {
  insertTicketSchema,
  selectTicketSchema,
  insertTicketReplySchema,
  selectTicketReplySchema,
} from "@/validation/tickets";

// ============================
// ✅ TypeScript Types
// ============================

// --- Tickets ---
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type SelectTicket = z.infer<typeof selectTicketSchema>;
export type Ticket = InferSelectModel<typeof tickets>;
export type NewTicket = InferInsertModel<typeof tickets>;

// --- Ticket Replies ---
export type InsertTicketReply = z.infer<typeof insertTicketReplySchema>;
export type SelectTicketReply = z.infer<typeof selectTicketReplySchema>;
export type TicketReply = InferSelectModel<typeof ticketReplies>;
export type NewTicketReply = InferInsertModel<typeof ticketReplies>;

// ============================
// Nested / Extended Types
// ============================

// Ticket with all its replies
export type TicketWithReplies = Ticket & {
  replies?: TicketReply[];
};

// Reply with linked ticket and responder user (optional for extended data)
export type TicketReplyFull = TicketReply & {
  ticket?: Ticket;
  responderUserEmail?: string;
};
