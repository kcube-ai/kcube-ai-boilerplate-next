"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { TwoFaService } from "@/app/client";
import { AuthButton } from "@/components/auth/auth-button";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthLayout } from "@/components/auth/auth-layout";
import { CodeInput } from "@/components/auth/code-input";
import { APP_NAME } from "@/config/app";
import { useUser } from "@/contexts/user-context";
import { usePageTitle } from "@/hooks/use-page-title";
import { handleError } from "@/lib/error";
import { saveToken } from "@/lib/token";
import { ERROR_MESSAGES, isValid6DigitCode } from "@/lib/validation";

export default function Verify2FAPage() {
  usePageTitle(`Two-Factor Authentication - ${APP_NAME}`);
  const router = useRouter();
  const { setUser } = useUser();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    if (!code.trim()) {
      setError(ERROR_MESSAGES.REQUIRED_FIELD);
      return false;
    }

    if (!isValid6DigitCode(code)) {
      setError(ERROR_MESSAGES.INVALID_CODE);
      return false;
    }

    setError("");
    return true;
  };

  const verifyCode = async (codeToVerify: string) => {
    setLoading(true);

    try {
      const response = await TwoFaService.verifyCodeApiV1TwoFaVerifyCodePost({
        requestBody: {
          totp: codeToVerify,
        },
      });

      // Save the new JWT token (with pending_2fa=false)
      saveToken(response.access_token);

      // Update user context
      setUser(response.user);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await verifyCode(code);
  };

  const handleComplete = async (completedCode: string) => {
    // Auto-submit when all 6 digits are entered
    if (isValid6DigitCode(completedCode)) {
      setError("");
      await verifyCode(completedCode);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Two-Factor Authentication"
        description="Enter the 6-digit code from your authenticator app"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <CodeInput
            label="Authentication Code"
            value={code}
            onChange={setCode}
            onComplete={handleComplete}
            error={error}
            disabled={loading}
          />

          <AuthButton loading={loading}>Verify</AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
