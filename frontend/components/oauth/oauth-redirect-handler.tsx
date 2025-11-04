"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { APP_NAME } from "@/config/app";
import { usePageTitle } from "@/hooks/use-page-title";
import { handleError } from "@/lib/error";
import { saveToken } from "@/lib/token";

import { OAuthErrorState } from "./oauth-error-state";
import { OAuthLoadingState } from "./oauth-loading-state";

interface OAuthRedirectConfig {
  provider: string;
  loadingMessage: string;
  errorRedirectPath: string;
  errorButtonText: string;
  successRedirectPath: string;
  shouldSaveToken: boolean;
  onCallback: (code: string) => Promise<{ access_token?: string } | unknown>;
}

function OAuthRedirectContent({
  provider,
  loadingMessage,
  errorRedirectPath,
  errorButtonText,
  successRedirectPath,
  shouldSaveToken,
  onCallback,
}: OAuthRedirectConfig) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");

        if (!code) {
          setError(`No authorization code received from ${provider}`);
          return;
        }

        const response = await onCallback(code);

        if (shouldSaveToken) {
          if (
            response &&
            typeof response === "object" &&
            "access_token" in response &&
            typeof response.access_token === "string"
          ) {
            saveToken(response.access_token);
          }
        }

        router.push(successRedirectPath);
      } catch (err) {
        handleError(err);
        setError(`Failed to authenticate with ${provider}. Please try again.`);
      }
    };

    handleCallback();
  }, [
    searchParams,
    router,
    provider,
    successRedirectPath,
    shouldSaveToken,
    onCallback,
  ]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-lg bg-card border p-8 shadow-lg">
          {error ? (
            <OAuthErrorState
              error={error}
              redirectPath={errorRedirectPath}
              buttonText={errorButtonText}
            />
          ) : (
            <OAuthLoadingState provider={provider} message={loadingMessage} />
          )}
        </div>
      </div>
    </div>
  );
}

export function OAuthRedirectHandler(config: OAuthRedirectConfig) {
  usePageTitle(`Authenticating - ${APP_NAME}`);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-md text-center">
            <div className="rounded-lg bg-card border p-8 shadow-lg">
              <OAuthLoadingState
                provider={config.provider}
                message={config.loadingMessage}
              />
            </div>
          </div>
        </div>
      }
    >
      <OAuthRedirectContent {...config} />
    </Suspense>
  );
}
