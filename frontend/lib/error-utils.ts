/**
 * Extracts the best possible error message from:
 * - apiRequest results
 * - thrown errors
 * - backend JSON errors
 * - network errors
 * - unknown objects
 */
export function extractErrorMessage(err: any): string {
  if (!err) return "Unknown error";

  // If API returned: { success: false, error: "...", errorAr: "..." }
  if (typeof err === "object") {
    if (err.error) return err.error;
    if (err.errorAr) return err.errorAr;
  }

  // If APIRequest threw an exception
  if (err?.message && typeof err.message === "string") {
    return err.message;
  }

  // If it's literally a string
  if (typeof err === "string") {
    return err;
  }

  // Fallback
  return "Unknown error";
}
