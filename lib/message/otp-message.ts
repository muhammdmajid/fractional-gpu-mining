/**
 * Centralized OTP-related messages.
 */
export const OtpMessage = {
  ERRORS: {
    NO_REQUEST: "No OTP request found for this email address. Please request a new code.",
    MAX_ATTEMPTS_REACHED: "You have reached the maximum number of OTP attempts. Please request a new OTP.",
    OTP_EXPIRED: "This OTP has expired. Please request a new verification code.",
    INCORRECT_OTP: "The OTP you entered is incorrect. Please try again.",
    PROCESS_FAILED: "Failed to process OTP request.",
    UNKNOWN_ERROR: "Unexpected error occurred while handling OTP.",
  },
  SUCCESS: {
    EXISTING_VALID: (remainingTime: string) =>
      `This OTP is still valid and will expire in ${remainingTime}. Please do not share this code with anyone.`,
    NEW_SENT: (remainingTime: string) =>
      `A new OTP has been sent to your email. It will expire in ${remainingTime}. Please do not share this code with anyone.`,
  },
} as const;
