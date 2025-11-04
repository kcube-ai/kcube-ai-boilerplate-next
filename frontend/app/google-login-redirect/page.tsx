"use client";

import { UsersService } from "@/app/client";
import { OAuthRedirectHandler } from "@/components/oauth/oauth-redirect-handler";

export default function GoogleLoginRedirectPage() {
  return (
    <OAuthRedirectHandler
      provider="Google"
      loadingMessage="Please wait while we complete your sign in..."
      errorRedirectPath="/login"
      errorButtonText="Back to Login"
      successRedirectPath="/dashboard"
      shouldSaveToken={true}
      onCallback={async (code: string) => {
        return await UsersService.googleLoginCallbackApiV1UserGoogleLoginCallbackPost(
          {
            requestBody: { code },
          }
        );
      }}
    />
  );
}
