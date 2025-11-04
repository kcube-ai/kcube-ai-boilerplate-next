/**
 * API client configuration.
 * Configures the OpenAPI client for making requests to the backend.
 */

"use client";

import { OpenAPI } from "@/app/client";
import { getToken } from "@/lib/token";

/**
 * Initialize the OpenAPI client configuration.
 * Must be called on the client side only.
 */
export const initializeApiClient = () => {
  if (typeof window === "undefined") return;

  // Set base URL
  OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin;

  // Set token for authenticated requests
  OpenAPI.TOKEN = getToken() || undefined;
};

// Auto-initialize on import
initializeApiClient();
