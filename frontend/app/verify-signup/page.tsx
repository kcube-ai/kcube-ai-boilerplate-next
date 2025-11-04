"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { UsersService } from "@/app/client";
import { AuthButton } from "@/components/auth/auth-button";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthLayout } from "@/components/auth/auth-layout";
import { CodeInput } from "@/components/auth/code-input";
import { APP_NAME } from "@/config/app";
import { useUser } from "@/contexts/user-context";
import { usePageTitle } from "@/hooks/use-page-title";
import { useToast } from "@/hooks/use-toast";
import { handleError } from "@/lib/error";
import { ERROR_MESSAGES, isValid6DigitCode } from "@/lib/validation";

export default function VerifySignupPage() {
  usePageTitle(`Verify Email - ${APP_NAME}`);
  const router = useRouter();
  const { user, setUser } = useUser();
  const { toast } = useToast();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

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
    if (!user) {
      setError("User not found. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const verifiedUser =
        await UsersService.verifySignupApiV1UserVerifySignupPost({
          requestBody: {
            signup_token: codeToVerify,
          },
        });

      // Update user context with verified user
      setUser(verifiedUser);

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

  const handleResendVerification = async () => {
    setResendLoading(true);

    try {
      await UsersService.resendVerificationApiV1UserResendVerificationPost();
      toast({
        title: "Email sent",
        description: "Verification code has been resent to your email.",
      });
    } catch (error) {
      handleError(error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Verify your email"
        description="Enter the 6-digit code sent to your email"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <CodeInput
            label="Verification Code"
            value={code}
            onChange={setCode}
            onComplete={handleComplete}
            error={error}
            disabled={loading}
          />

          <AuthButton loading={loading}>Verify</AuthButton>

          <p className="text-center text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendLoading}
              className="font-medium text-primary hover:text-primary/90 underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? "Sending..." : "Resend"}
            </button>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
