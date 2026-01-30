/* eslint-disable @typescript-eslint/no-explicit-any */
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { toast } from "sonner";
import { ZodError } from "zod";

/**
 * Extracts a user-friendly error message from various error types.
 * 
 * Handles:
 * 1. Direct string errors
 * 2. Zod validation errors
 * 3. Network errors (e.g., fetch)
 * 4. Drizzle ORM errors
 * 5. Authentication/Authorization errors
 * 6. Next.js redirect errors (re-throws)
 * 7. FieldErrors type ({ field: { message } })
 * 8. Standard JS errors
 * 9. Generic { message: string } objects
 * 10. Fallback unknown errors
 */
export function getErrorMessage(err: unknown): string {
  const fallbackMessage = "Something went wrong, please try again later.";

  // 1️⃣ Direct string error
  if (typeof err === "string") {
    return err;
  }

  // 2️⃣ Zod validation errors (aggregate messages)
  if (err instanceof ZodError) {
    return err.issues.map((issue) => issue.message).join("\n");
  }

  // 3️⃣ Network errors (like fetch)
  if (err instanceof TypeError) {
    return `Network error: ${err.message}`;
  }

  // 4️⃣ Drizzle ORM / database errors
  if (
    typeof err === "object" &&
    err !== null &&
    ("code" in err || "meta" in err || "cause" in err)
  ) {
    const drizzleErr = err as { code?: string; message?: string; meta?: any };
    return drizzleErr.message
      ? `Database error [${drizzleErr.code ?? "UNKNOWN"}]: ${drizzleErr.message}`
      : `Database error [${drizzleErr.code ?? "UNKNOWN"}]`;
  }

  // 5️⃣ Authentication / Authorization errors
  if (
    typeof err === "object" &&
    err !== null &&
    ("name" in err || "code" in err)
  ) {
    const authErr = err as { name?: string; code?: string; message?: string };
    if (
      authErr.name === "UnauthorizedError" ||
      authErr.name === "AuthError" ||
      authErr.code === "AUTH_EXPIRED"
    ) {
      return authErr.message ?? "Authentication or authorization failed.";
    }
  }

  // 6️⃣ Next.js redirect errors → must be rethrown
  if (isRedirectError(err)) {
    throw err;
  }

  // 7️⃣ FieldErrors ({ field: { message } })
  if (
    typeof err === "object" &&
    err !== null &&
    Object.values(err).every(
      (val) => val && typeof val === "object" && "message" in val
    )
  ) {
    const fieldErrors = err as Record<string, { message?: string }>;
    return Object.values(fieldErrors)
      .map((fe) => fe.message)
      .filter(Boolean)
      .join("\n") || fallbackMessage;
  }

  // 8️⃣ Standard JS errors
  if (err instanceof Error) {
    return err.message;
  }

  // 9️⃣ Generic { message: string } objects
  if (typeof err === "object" && err !== null && "message" in err) {
    const maybeMessage = (err as { message?: unknown }).message;
    if (typeof maybeMessage === "string") {
      return maybeMessage;
    }
  }

  // 🔟 Fallback unknown errors
  return fallbackMessage;
}

/**
 * Show an error toast using Sonner with a parsed message.
 */
export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);
  return toast.error(errorMessage);
}
