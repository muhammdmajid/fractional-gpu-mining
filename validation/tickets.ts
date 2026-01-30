import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tickets, ticketReplies} from "@/db/schema";

// ==============================
// 1️⃣ Tickets Schema
// ==============================
const baseTicketSchema = createInsertSchema(tickets).extend({
  email: z.email("Valid email is required."),
  subject: z.string().min(1, "Ticket subject is required."),
  message: z.string().min(1, "Ticket message is required."),
});

export const insertTicketSchema = baseTicketSchema.omit({   id: true,
  createdAt: true,
  updatedAt: true, });
export const selectTicketSchema = createSelectSchema(tickets);
export const updateTicketSchema = baseTicketSchema.omit({ id: true }).partial().loose();

// ==============================
// 2️⃣ Ticket Replies Schema
// ==============================
const baseTicketReplySchema = createInsertSchema(ticketReplies).extend({
  ticketId: z.string().min(1, "Parent ticket ID is required."),
  responder: z.email("Responder email is required."), // assuming responder is a user email
  message: z.string().min(1, "Reply message is required."),
});

export const insertTicketReplySchema = baseTicketReplySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectTicketReplySchema = createSelectSchema(ticketReplies);
export const updateTicketReplySchema = baseTicketReplySchema.omit({ id: true }).partial().loose();
