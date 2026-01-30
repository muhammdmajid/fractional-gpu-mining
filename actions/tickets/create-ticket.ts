"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { tickets, userTable } from "@/db/schema";
import { FieldErrors, ServerResponse } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";
import { sendMail } from "@/email";
import { EmailTemplate } from "@/email/email-template";
import { insertTicketSchema } from "@/validation/tickets";
import { InsertTicket, SelectTicket } from "@/types/tickets";
import zodErrorToFieldErrors from "@/lib/zod-error-t-field-errors";

export default async function createTicketWithEmail(
  payload: InsertTicket
): Promise<ServerResponse<SelectTicket>> {
  try {
    // 1️⃣ Validate the input
    const validation = insertTicketSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: FieldErrors = zodErrorToFieldErrors(validation.error);
      return {
        success: false,
        error: fieldErrors,
        message: undefined,
        statusCode: 400,
      };
    }

    const { email, subject, message } = validation.data;

    // 2️⃣ Check if the user exists
    const [user] = await db
      .select({ email: userTable.email, name: userTable.name })
      .from(userTable)
      .where(eq(userTable.email, email));

    if (!user) {
      return {
        success: false,
        error: "No user found with the provided email address.",
        message: undefined,
        statusCode: 404,
      };
    }

    // 3️⃣ Insert the new ticket
    const [newTicket] = await db
      .insert(tickets)
      .values({
        email: email,
        subject: subject,
        message: message,
      })
      .returning();

    // 4️⃣ Get all admin users
    const admins = await db
      .select()
      .from(userTable)
      .where(eq(userTable.role, "admin"));

    // 5️⃣ Send emails in parallel to all admins
    await Promise.all(
      admins.map(async (admin) => {
        if (!admin.email) return;
        try {
          await sendMail(admin.email, EmailTemplate.NewTicket, {
            name: admin.name ?? "there",
            email: admin.email,
            subject: subject,
            message: message,
            ticketId: newTicket.id,
          });
        } catch (err) {
          console.error(`Failed to send email to ${admin.email}:`, err);
        }
      })
    );

    // 6️⃣ Return structured response
    return {
      success: true,
      error: undefined,
      message: "Ticket created and emails sent to all admins successfully.",
      statusCode: 201,
      data: newTicket,
    };
  } catch (error: unknown) {
    console.error("Error creating ticket:", error);
    return {
      success: false,
      error:
        getErrorMessage(error) ||
        "An unknown error occurred while creating the ticket.",
      message: undefined,
      statusCode: 500,
    };
  }
}
