"use client";

import { CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { ForgotPasswordService } from "@/app/client";
import { AuthButton } from "@/components/auth/auth-button";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthLayout } from "@/components/auth/auth-layout";
import { APP_NAME } from "@/config/app";
import { usePageTitle } from "@/hooks/use-page-title";
import { handleError } from "@/lib/error";
import { ERROR_MESSAGES, isValidPassword } from "@/lib/validation";

function VerifyForgotPasswordContent() {
  usePageTitle(`Reset Password - ${APP_NAME}`);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const userId = searchParams.get("user_id") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newPassword) {
      newErrors.newPassword = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!isValidPassword(newPassword)) {
      newErrors.newPassword = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await ForgotPasswordService.verifyApiV1ForgotPasswordVerifyPost({
        requestBody: {
          token,
          user_id: userId,
          new_password: newPassword,
        },
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <AuthCard
          title="Password reset successful"
          description="Your password has been updated"
        >
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Your password has been successfully reset. You can now sign in
                with your new password.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to login page...
              </p>
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Reset your password"
        description="Enter your new password below"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            id="newPassword"
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={setNewPassword}
            error={errors.newPassword}
            disabled={loading}
            autoComplete="new-password"
          />
          <div>
            <AuthInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={setConfirmPassword}
              error={errors.confirmPassword}
              disabled={loading}
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Password must be at least 8 characters long
            </p>
          </div>
          <AuthButton loading={loading}>Reset Password</AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

export default function VerifyForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyForgotPasswordContent />
    </Suspense>
  );
}
