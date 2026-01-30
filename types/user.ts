import { z } from "zod";
import {
  insertUserSchema,
  selectUserSchema,
  updateUserSchema,
  LoginCredentialsSchema,
  resetPasswordSchema,
  signUpCredentialsSchema,
} from "@/validation/user";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { ACCOUNT_STATUSES, GENDER_IDENTITIES, USER_ROLES, userTable } from "@/db/schema";

// ============================
// ✅ TypeScript Types
// ============================
export type GenderIdentity = typeof GENDER_IDENTITIES[number];
export type UserRole = typeof USER_ROLES[number];
export type AccountStatus = typeof ACCOUNT_STATUSES[number];

export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

export type User = InferSelectModel<typeof userTable>;
export type NewUser = InferInsertModel<typeof userTable>;


/**
 * TypeScript type for reset password form input.
 * Can be used in forms, API routes, and services for strong typing.
 */
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Infer TypeScript type from the Zod schema
export type SignUpCredentialsInput = z.infer<typeof signUpCredentialsSchema>;


export type SignInProps = {
     email: string;
        password: string;
        callbackURL?: string | undefined;
        rememberMe?: boolean | undefined;
};