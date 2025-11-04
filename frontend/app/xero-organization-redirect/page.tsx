"use client";

import { XeroOrganizationService } from "@/app/client";
import { OAuthRedirectHandler } from "@/components/oauth/oauth-redirect-handler";

export default function XeroOrganizationRedirectPage() {
  return (
    <OAuthRedirectHandler
      provider="Xero"
      loadingMessage="Please wait while we are connecting your organization..."
      errorRedirectPath="/dashboard"
      errorButtonText="Back to Dashboard"
      successRedirectPath="/dashboard"
      shouldSaveToken={false}
      onCallback={async (code: string) => {
        return await XeroOrganizationService.connectCallbackApiV1XeroOrganizationConnectCallbackPost(
          {
            requestBody: { code },
          }
        );
      }}
    />
  );
}
