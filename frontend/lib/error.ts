/**
 * Error handling utilities.
 * Centralized error handling and message formatting for API errors.
 */

import { toast } from "@/hooks/use-toast";
import { clearToken } from "@/lib/token";

export const LOGIN_REDIRECT_URL = "/login";

/**
 * Extract error message from API error response.
 */
const getErrorMessage = (error: any): string => {
  if (typeof error?.body?.detail === "string") {
    return error.body.detail;
  }

  if (Array.isArray(error?.body?.detail)) {
    const firstError = error.body.detail[0];
    return firstError?.msg || "Validation error occurred";
  }

  return "Something went wrong. Please try again.";
};

/**
 * Handle API errors globally.
 * - 401/403: Clear token and redirect to login
 * - 429: Rate limit exceeded
 * - Other errors: Show toast notification
 */
export const handleError = (err: any) => {
  // Handle authentication errors
  if (err.status === 401 || err.status === 403) {
    clearToken();

    // Only redirect if not already on target page
    if (window.location.pathname !== LOGIN_REDIRECT_URL) {
      window.location.href = LOGIN_REDIRECT_URL;
      return;
    }
  }

  // Handle rate limit errors
  if (err.status === 429) {
    toast({
      variant: "destructive",
      title: "Too many requests",
      description: "You've made too many requests. Please wait a moment and try again.",
    });
    return;
  }

  // Handle all other errors
  const errorMessage = getErrorMessage(err);

  toast({
    variant: "destructive",
    title: "Error",
    description: errorMessage,
  });
};
