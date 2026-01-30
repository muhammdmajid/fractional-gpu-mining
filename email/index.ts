"use server";

import { createTransport, type TransportOptions } from "nodemailer";
import { EmailTemplate, getEmailTemplate, PropsMap } from "./email-template";
import smtpConfig from "@/config/smtp.config";
import { ServerResponse } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";
import { MailMessage } from "@/lib/message/mail.message";

/**
 * Initialize Nodemailer transporter using SMTP configuration.
 */
const transporter = createTransport(smtpConfig as TransportOptions);

/**
 * Sends an email using a predefined template.
 */
export const sendMail = async <T extends EmailTemplate>(
  to: string,
  template: T,
  props: PropsMap[T]
): Promise<ServerResponse<null, string>> => {
  try {
    const { subject, body: htmlBody } = await getEmailTemplate(template, props);

    const missingEnv = [
      !process.env.SMTP_HOST && "SMTP_HOST",
      !process.env.SMTP_PORT && "SMTP_PORT",
      !process.env.SMTP_USER && "SMTP_USER",
      !process.env.SMTP_PASSWORD && "SMTP_PASSWORD",
    ].filter(Boolean);

    if (missingEnv.length > 0) {
      const errorMessage = `${MailMessage.ERRORS.MISSING_ENV}: ${missingEnv.join(", ")}`;
      console.error(errorMessage);
      return {
        error: errorMessage,
        message: undefined,
        success: false,
        statusCode: 500,
      };
    }

    await transporter.verify().catch(() => {
      throw new Error(MailMessage.ERRORS.CONNECTION_FAILED);
    });

    const mailOptions = {
      from: process.env.SMTP_USER!,
      to,
      subject,
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);

    return {
      error: undefined,
      message: MailMessage.SUCCESS.SEND_SUCCESS(to), // ✅ now a function
      success: true,
      statusCode: 200,
    };
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    return {
      error: error ? getErrorMessage(error) : MailMessage.ERRORS.UNKNOWN_ERROR,
      message: undefined,
      success: false,
      statusCode: 500,
    };
  }
};
