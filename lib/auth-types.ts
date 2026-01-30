
import {User as UserDbInfer } from "@/types/user";
export type UserDbType = UserDbInfer;

// import type { User as UserRawInfer } from "better-auth";
// export type UserRawType = UserRawInfer;
// types/auth.ts
export interface SignUpPayload {
 email: string;
    password: string;
    name?: string | undefined;
    referral_code?: string | null | undefined;
}
