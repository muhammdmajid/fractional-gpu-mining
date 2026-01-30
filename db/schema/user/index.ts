// 📦 Drizzle ORM core imports
import { generateRandom10DigitNumber, generateUniqueId, } from "@/db/utils";
import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";


// ============================
// ✅ Enum Constants
// ============================
export const GENDER_IDENTITIES = ["male", "female", "other"] as const;
export const USER_ROLES = ["admin", "register"] as const;
export const ACCOUNT_STATUSES = [
  "invited",
  "processing",
  "pending",
  "verifying",
  "active",
  "inactive",
  "suspended",
  "closed",
] as const;

// ============================
// ✅ pgEnum Definitions
// ============================
export const genderIdentityEnum = pgEnum("gender_identity", GENDER_IDENTITIES);
export const userRoleEnum = pgEnum("user_role", USER_ROLES);
export const accountStatusEnum = pgEnum("account_status", ACCOUNT_STATUSES);

// ============================
// 👤 Define the users table schema
// ============================



export const userTable = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUniqueId("user", 36)),

  age: integer("age"),
  createdAt: timestamp("created_at").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  firstName: text("first_name"),

  image: text("image"),
  lastName: text("last_name"),
  name: text("name").notNull(),
  twoFactorEnabled: boolean("two_factor_enabled"),
  updatedAt: timestamp("updated_at").notNull(),
  bio: text("bio").array(),
  location: text("location"),
  website: text("website"),
  phone_number: text("phone_number"),
  role: userRoleEnum("role").default("register"),
  gender_identity: genderIdentityEnum("gender_identity"),
  account_status: accountStatusEnum("account_status"),
  referral_code: text("referral_code")
    .unique()  .notNull()
    .$defaultFn(() => generateRandom10DigitNumber()),

});


