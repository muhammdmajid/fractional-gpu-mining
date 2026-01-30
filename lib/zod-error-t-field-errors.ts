import { FieldErrors } from "@/types";
import { ZodError } from "zod";

/**
 * Converts a ZodError into a structured FieldErrors object.
 * 
 * This allows easy mapping of validation errors to form fields.
 *
 * @param error - The ZodError object returned from Zod validation
 * @returns FieldErrors object with field names as keys and messages as values
 */
export default function zodErrorToFieldErrors(error: ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};

  // Iterate over issues returned by ZodError
  for (const issue of error.issues) {
    // Extract first element of path as field name
    const field = issue.path[0];

    if (typeof field === "string" && field.trim()) {
      // Only set the first error per field
      if (!fieldErrors[field]) {
        fieldErrors[field] = { message: issue.message };
      }
    }
  }

  return fieldErrors;
}
