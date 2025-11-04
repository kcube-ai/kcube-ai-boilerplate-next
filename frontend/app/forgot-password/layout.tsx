import type { Metadata } from "next";

import { APP_NAME } from "@/config/app";

export const metadata: Metadata = {
  title: `Forgot Password - ${APP_NAME}`,
  description: `Reset your ${APP_NAME} account password. Enter your email to receive a password reset link.`,
  keywords: [
    "forgot password",
    "reset password",
    "password recovery",
    "account recovery",
    "Sample password",
  ],
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
