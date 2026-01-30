// ✅ Object version (better for frontend bundles)
export const OtpError = {
  NO_REQUEST: "No OTP request found for this email address. Please request a new code.",
  MAX_ATTEMPTS_REACHED: "You have reached the maximum number of verification attempts. Please request a new OTP.",
  OTP_EXPIRED: "This OTP has expired. Please request a new verification code.",
  INCORRECT_OTP: "The OTP you entered is incorrect. Please try again.",
} as const;

export type OtpError = typeof OtpError[keyof typeof OtpError];
