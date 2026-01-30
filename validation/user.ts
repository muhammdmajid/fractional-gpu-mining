import {
  userTable,
  GENDER_IDENTITIES,
  USER_ROLES,
  ACCOUNT_STATUSES,
} from "@/db/schema/user";
import { OTP_LENGTH } from "@/lib/constants";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ✅ Strong password rules
export const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(/[@$!%*?&#]/, "Password must contain at least one special character.");


// ============================
// ✅ Base Schema
// ============================
const baseUserSchema = createInsertSchema(userTable).extend({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.number().int().positive().max(120).optional(),


  name: z.string().optional(),
  email: z
    .email("The email address provided is invalid.")
    .min(1, { message: "Email is required." }),

  image: z.url().optional(),
  phone_number: z.string().nullable().optional(),
  gender_identity: z.enum(GENDER_IDENTITIES).optional(),
  account_status: z.enum(ACCOUNT_STATUSES).default("pending").optional(),
  role: z.enum(USER_ROLES).default("register").optional(),
  bio: z.array(z.string()).nullable().optional(),
  referral_code:z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  website: z.url().nullable().optional(),
});

// ============================
// ✅ Insert Schema
// ============================
export const insertUserSchema = baseUserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ============================
// ✅ Select Schema
// ============================
export const selectUserSchema = createSelectSchema(userTable);

// ============================
// ✅ Update Schema
// ============================
export const updateUserSchema = baseUserSchema
  .omit({ id: true, createdAt: true })
  .partial()
  .loose();

// ============================
// ✅ Login Schema
// ============================
export const LoginCredentialsSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});



/**
 * Validation schema for resetting a password using Email + OTP.
 * Ensures strong password rules and proper OTP format.
 */
export const resetPasswordSchema = insertUserSchema.pick({
  // Reuse only the "email" field from user schema for consistency
  email: true,
}).extend({
  // OTP must be exactly OTP_LENGTH digits
  otpCode: z
    .string()
    .min(OTP_LENGTH, { message: `OTP must be exactly ${OTP_LENGTH} digits` })
    .max(OTP_LENGTH, { message: `OTP must be exactly ${OTP_LENGTH} digits` }),

  // New password (must follow central passwordValidation rules)
  newPassword: passwordValidation,

  // Confirmation password (must follow same rules as newPassword)
  confirmPassword: passwordValidation,
}).refine(
  // Ensure newPassword and confirmPassword match
  (data) => data.newPassword === data.confirmPassword,
  {
    path: ["confirmPassword"], // Point error to confirmPassword field
    message: "Passwords do not match",
  }
);



// ---------------------------------------------------------------------------
// Sign-up credentials validation schema
// ---------------------------------------------------------------------------
export const signUpCredentialsSchema = insertUserSchema
  .pick({
    // Reuse only the "email" field from user schema for consistency
    email: true,
    // Include "name" field for sign-up form
    name: true,
    referral_code:true,
  })
  .extend({
    // New password field
    // Must follow central passwordValidation rules (e.g., min length, complexity)
    newPassword: passwordValidation,

    // Confirm password field
    // Must follow the same validation rules as newPassword
    confirmPassword: passwordValidation,
  })
  .refine(
    // Custom validation to ensure newPassword and confirmPassword match
    (data) => data.newPassword === data.confirmPassword,
    {
      // Attach error specifically to confirmPassword field
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );


  export const signUpCredentialsSchema2 = insertUserSchema
  .pick({
    email: true,         // reuse "email" from user schema
    name: true,          // include "name"
    referral_code: true, // include "referral_code"
  })
  .extend({
    password: passwordValidation, // new password field with validation
  });