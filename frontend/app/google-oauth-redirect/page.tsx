"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { UsersService } from "@/app/client";
import { APP_NAME } from "@/config/app";
import { usePageTitle } from "@/hooks/use-page-title";
import { handleError } from "@/lib/error";
import { saveToken } from "@/lib/token";

export default function GoogleOAuthRedirectPage() {
  usePageTitle(`Authenticating - ${APP_NAME}`);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get authorization code from query params
        const code = searchParams.get("code");

        if (!code) {
          setError("No authorization code received from Google");
          return;
        }

        // Exchange code for JWT token
        const response = await UsersService.googleAuthCallbackApiV1UserGoogleAuthCallbackPost({
          requestBody: { code },
        });

        // Save the JWT token (this also updates OpenAPI client)
        saveToken(response.access_token);

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (err) {
        handleError(err);
        setError("Failed to authenticate with Google. Please try again.");
      }
    };

    handleOAuthCallback();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sample-blue-50 to-sample-gray-50 dark:from-sample-gray-900 dark:to-sample-gray-950 p-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-lg bg-card border p-8 shadow-lg">
          {error ? (
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mx-auto">
                <svg
                  className="h-6 w-6 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Authentication Failed
              </h2>
              <p className="text-sm text-muted-foreground">{error}</p>
              <button
                onClick={() => router.push("/login")}
                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto animate-spin">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Authenticating with Google
              </h2>
              <p className="text-sm text-muted-foreground">
                Please wait while we complete your sign in...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
