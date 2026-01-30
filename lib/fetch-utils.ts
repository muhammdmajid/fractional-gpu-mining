import { ServerResponse } from "@/types";
import { getErrorMessage } from "./handle-error";

/**
 * Utility function to fetch data from the server with standardized error handling.
 *
 * @template T - Expected data type from the server response.
 * @param fetchFn - Async function that performs the server call and returns a ServerResponse<T>.
 * @param label - A human-readable label for contextual error messages (e.g., "courses", "profile").
 * @returns A normalized object containing either the fetched `data` or an error `message`.
 */
export async function fetchServerData<T>(
  fetchFn: () => Promise<ServerResponse<T>>,
  label: string
): Promise<{ data: T | null; message: string | null }> {
  try {
    const res = await fetchFn();

    // Handle unsuccessful response or missing data
    if (!res?.success || !res?.data) {
      return {
        data: null,
        message: getErrorMessage(res?.message ?? `Failed to fetch ${label}.`),
      };
    }

    return { data: res.data, message: null };
  } catch (error: unknown) {
    // Catch unexpected runtime/network errors


    return {
      data: null,
      message: error
        ? getErrorMessage(error)
        : `An unexpected error occurred while fetching ${label}. Please try again later.`,
    };
  }
}
