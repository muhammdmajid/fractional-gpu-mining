// messages.ts (or anywhere central)
export const EMAIL_OTP_SENT = "Email successfully sent";

// OTP-related constants
export const OTP_EXPIRE = Number(process.env.OTP_EXPIRE ?? 3600); // default 1 hour
export const OTP_LENGTH = Number(process.env.OTP_LENGTH ?? 4); // default 4 digits
export const OTP_ATTEMPT_LIMIT = Number(process.env.OTP_ATTEMPT_LIMIT ?? 3);

// Profile-related defaults
export const DEFAULT_PROFILE_IMAGE_URL = "/img/profile/user-pic.png";


export const databasePrefix = "gpu_mining_"

// Time units
export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;

// Mining update interval (default: 1 hour)
export const MINING_STATUS_INTERVAL = 1 * HOUR;


export const REFERRAL_CODE_DIGITS = 10 as const;