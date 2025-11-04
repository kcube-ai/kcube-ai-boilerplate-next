"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { UsersService, XeroService } from "@/app/client";
import { AuthButton } from "@/components/auth/auth-button";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthLayout } from "@/components/auth/auth-layout";
import { OAuthButton } from "@/components/auth/oauth-button";
import { APP_NAME } from "@/config/app";
import { usePageTitle } from "@/hooks/use-page-title";
import { handleError } from "@/lib/error";
import { saveToken } from "@/lib/token";
import {
  ERROR_MESSAGES,
  isValidEmail,
  isValidFullName,
  isValidPassword,
  normalizeEmail,
  normalizeFullName,
} from "@/lib/validation";

export default function SignupPage() {
  usePageTitle(`Sign Up - ${APP_NAME}`);
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!isValidFullName(fullName)) {
      newErrors.fullName = ERROR_MESSAGES.INVALID_FULL_NAME;
    }

    if (!email.trim()) {
      newErrors.email = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!isValidEmail(email)) {
      newErrors.email = ERROR_MESSAGES.INVALID_EMAIL;
    }

    if (!password) {
      newErrors.password = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!isValidPassword(password)) {
      newErrors.password = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await UsersService.signupApiV1UserSignupPost({
        requestBody: {
          email: normalizeEmail(email),
          password,
          full_name: normalizeFullName(fullName),
        },
      });

      // Save the JWT token (this also updates OpenAPI client)
      saveToken(response.access_token);

      // Redirect to verify-signup page
      router.push("/verify-signup");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Create an account"
        description="Enter your details to get started"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            id="fullName"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={setFullName}
            error={errors.fullName}
            disabled={loading}
            autoComplete="name"
          />
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
          <AuthInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            error={errors.password}
            disabled={loading}
            autoComplete="new-password"
          />
          <AuthButton loading={loading}>Create Account</AuthButton>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <OAuthButton
            provider="google"
            onGetAuthUrl={() => UsersService.googleLoginApiV1UserGoogleLoginGet()}
            icon={
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            }
          >
            Continue with Google
          </OAuthButton>

          <OAuthButton
            provider="xero"
            onGetAuthUrl={() => XeroService.loginApiV1XeroLoginGet()}
            icon={
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.585 14.655c-1.485 0-2.69-1.206-2.69-2.689 0-1.485 1.205-2.69 2.69-2.69 1.484 0 2.689 1.205 2.689 2.69 0 1.483-1.205 2.689-2.689 2.689zm-4.447-2.689c0-1.485-1.205-2.69-2.689-2.69-1.485 0-2.69 1.205-2.69 2.69 0 1.483 1.205 2.689 2.69 2.689 1.484 0 2.689-1.206 2.689-2.689zm-7.723 0c0-1.485-1.206-2.69-2.69-2.69C2.242 9.276 1.037 10.481 1.037 11.966c0 1.483 1.205 2.689 2.688 2.689 1.485 0 2.69-1.206 2.69-2.689z"
                  fill="#13B5EA"
                />
              </svg>
            }
          >
            Continue with Xero
          </OAuthButton>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
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
