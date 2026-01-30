/**
 * Centralized OTP-related messages.
 */
export const SendOtpEmailMessage = {
  ERRORS: {
    PROCESS_FAILED: "Failed to process OTP request.",
    UNKNOWN_ERROR: "Unexpected error occurred while handling OTP.",
    EMAIL_NOT_FOUND: "No account found with the provided email address.",
    EMAIL_ALREADY_VERIFIED: "This email is already verified. No OTP is required.",
  }
} as const;