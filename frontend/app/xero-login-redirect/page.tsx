"use client";

import { XeroService } from "@/app/client";
import { OAuthRedirectHandler } from "@/components/oauth/oauth-redirect-handler";

export default function XeroLoginRedirectPage() {
  return (
    <OAuthRedirectHandler
      provider="Xero"
      loadingMessage="Please wait while we complete your sign in..."
      errorRedirectPath="/login"
      errorButtonText="Back to Login"
      successRedirectPath="/dashboard"
      shouldSaveToken={true}
      onCallback={async (code: string) => {
        return await XeroService.loginCallbackApiV1XeroLoginCallbackPost({
          requestBody: { code },
        });
      }}
    />
  );
}
