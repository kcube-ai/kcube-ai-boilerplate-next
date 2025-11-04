"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ForgotPasswordService } from "@/app/client";
import { AuthButton } from "@/components/auth/auth-button";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthLayout } from "@/components/auth/auth-layout";
import { APP_NAME } from "@/config/app";
import { usePageTitle } from "@/hooks/use-page-title";
import { handleError } from "@/lib/error";
import { ERROR_MESSAGES, isValidEmail, normalizeEmail } from "@/lib/validation";

export default function ForgotPasswordPage() {
  usePageTitle(`Forgot Password - ${APP_NAME}`);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!isValidEmail(email)) {
      newErrors.email = ERROR_MESSAGES.INVALID_EMAIL;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await ForgotPasswordService.requestApiV1ForgotPasswordPost({
        requestBody: {
          email: normalizeEmail(email),
        },
      });

      setSubmitted(true);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout>
        <AuthCard
          title="Check your email"
          description="We've sent password reset instructions to your email"
        >
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                If an account exists with <strong>{email}</strong>, you will
                receive an email with instructions to reset your password.
              </p>
              <p className="text-sm text-muted-foreground">
                Please check your inbox and spam folder.
              </p>
            </div>
            <div className="pt-4">
              <Link href="/login">
                <AuthButton>Back to Login</AuthButton>
              </Link>
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Forgot password?"
        description="Enter your email address and we'll send you a reset link"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            error={errors.email}
            disabled={loading}
            autoComplete="email"
          />
          <AuthButton loading={loading}>Send Reset Link</AuthButton>
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/90 underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
