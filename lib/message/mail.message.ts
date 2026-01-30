/**
 * Centralized mail-related messages.
 */
export const MailMessage = {
  ERRORS: {
    MISSING_ENV: "Missing required SMTP environment variables.",
    CONNECTION_FAILED: "Failed to connect to the SMTP server.",
    SEND_FAILED: "Failed to send email. Please try again later.",
    UNKNOWN_ERROR: "An unknown error occurred while sending the email.",
  },
  SUCCESS: {
    SEND_SUCCESS: (to: string) => `Email successfully sent to ${to}.`,
  },
} as const;