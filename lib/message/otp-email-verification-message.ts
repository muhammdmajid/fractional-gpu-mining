// src/lib/message/otp-email-verification-message.ts

export const otpEmailVerificationMessage = {
  SUCCESS: {
    EMAIL_VERIFIED: "Your email has been successfully verified.",
  },
  ERRORS: {
    EMAIL_NOT_FOUND: "No account found with this email address.",
    EMAIL_ALREADY_VERIFIED: "Email address is already verified.",
    INVALID_OTP: "The OTP provided is invalid or has expired.",
    PROCESS_FAILED: "Failed to process email verification request.",
    UNKNOWN_ERROR: "An unexpected server error occurred. Please try again later.",
  },
} as const;
